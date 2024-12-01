const { Router } = require("express");
const userService = require("./service/user");
const userValidation = require("./validation/user.validation");
const UserDB = require("./models/user.model");
const { v4: uuidv4 } = require("uuid");
const response = require("./utils/response.helper");
const jwt = require("./utils/jwt.helper");

const router = Router();

const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

// GitHub strategiyasini sozlash
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID, // GitHub App Client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // GitHub App Client Secret
      callbackURL: "http://localhost:5000/auth/github/callback", // GitHub Callback URL
      scope: ["user:email"], // Kerakli huquqlar
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails?.[0]?.value || null;
        if (!email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const emails = await res.json();
          email = emails.find((e) => e.primary)?.email || null;
        }

        let user = {
          fullname: profile?.displayName,
          email,
          avatar: profile?.photos?.[0]?.value || null,
          birthday: null,
          country: profile?._json?.location || null,
        };

        done(null, user); // Profileni passport sessiyasiga yuborish
      } catch (error) {
        done(error, null); // Xatolik yuzaga kelsa, callback orqali qaytarish
      }
    }
  )
);

// Sessionni sozlash
passport.serializeUser((user, done) => done(null, user.id)); // Sessiyada user.id saqlanadi

passport.deserializeUser(async (id, done) => {
  done(null, { id }); // Faqat id qaytariladi
});

// GitHub orqali autentifikatsiya yo'li
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }) // Emailga ruxsat so'rash
);

// GitHub callback yo'li
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false }), // Sessiyani ishlatmaslik
  async (req, res) => {
    const verificationCode = uuidv4().replace(/-/g, "").slice(0, 10);
    let user = req.user;
    user.password = verificationCode;
    user.status = false;
    user.balans = 0;
    user.birthday = null;

    const exactUser = await UserDB.findOne({ email: user.email });
    if (exactUser) {
      const token = await jwt.generate(exactUser.toObject(), "1d");
      return response.success(res, "login successfully", { exactUser, token });
    }

    const newUser = await UserDB.create(user);

    res.redirect(`http://127.0.0.1:5500/index.html`);
  }
);

router.post("/register", [userValidation.register], userService.register);
router.post("/login", [userValidation.login], userService.login);
router.get("/users", userService.getAllUser);
router.delete("/users/:id", userService.deleteUser);
router.put("/users/:id", userService.updateUser);
router.patch("/users/:id", userService.blockUser);

module.exports = router;
