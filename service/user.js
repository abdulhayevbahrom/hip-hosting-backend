const UserDB = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("../utils/jwt.helper");

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE, // "gmail" yoki SMTP server sozlamalarini kiritish
  auth: {
    user: process.env.EMAIL, // Emailingiz
    pass: process.env.PASSWORD, // Email parolingiz
  },
});

class User {
  async register(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let exactUser = await UserDB.findOne({ email: req.body.email });
        if (exactUser) return reject("User already exists");
        let verificationCode = uuidv4().replace(/-/g, "").slice(0, 10);
        req.body.password = verificationCode;
        const newUser = new UserDB(req.body);
        const savedUser = await newUser.save();

        if (!savedUser) return reject("User not saved");

        const mailOptions = {
          from: process.env.EMAIL,
          to: req.body.email,
          subject: "🎉 Welcome to HIP-HOSTING!",
          text: `
Dear user,

Thank you for choosing HIP-HOSTING as your hosting provider! We are excited to have you as a new member of our community.

Your account has been successfully created and is now ready for use. To access your account, please use the following login credentials:

Email: ${req.body.email}
Password: ${verificationCode}

We recommend you to change your password immediately after logging in to ensure the security of your account.

Thank you again for choosing HIP-HOSTING. We look forward to serving you!

Best regards,
The HIP-HOSTING Team
Follow us on Telegram: @hiphosting
          `,
        };

        let res = await transporter.sendMail(mailOptions);

        let textField =
          "Failed to send email. Please check your email settings or try again later.";
        if (!res.accepted.length) return reject(textField);

        resolve(
          "User created successfully! Please check your email for verification code."
        );
      } catch (error) {
        reject(error); // Xatoni qaytarish
      }
    });
  }

  // login
  async login(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserDB.findOne({
          email: req.body.email,
          password: req.body.password,
        });

        if (!user) return reject("email or password is incorrect");
        const token = await jwt.generate(user.toObject(), "1d");

        resolve({ user, token });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new User();
