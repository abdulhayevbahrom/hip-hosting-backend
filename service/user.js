require("dotenv").config();
const UserDB = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("../utils/jwt.helper");
const response = require("../utils/response.helper");

class User {
  async register(req, res) {
    try {
      const { email } = req.body;

      // Foydalanuvchini tekshirish
      const exactUser = await UserDB.findOne({ email });
      if (exactUser) return response.error(res, "User already exists");

      // Verifikatsiya kodini yaratish
      const verificationCode = uuidv4().replace(/-/g, "").slice(0, 10);
      req.body.password = verificationCode;

      // Yangi foydalanuvchini saqlash
      const newUser = new UserDB(req.body);
      const savedUser = await newUser.save();
      if (!savedUser) return response.error(res, "User not saved");

      // Email jo'natish sozlamalari
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "🎉 Welcome to HIP-HOSTING!",
        text: `
Dear user,

Thank you for choosing HIP-HOSTING as your hosting provider! We are excited to have you as a new member of our community.

Your account has been successfully created and is now ready for use. To access your account, please use the following login credentials:

Email: ${email}
Password: ${verificationCode}

We recommend you to change your password immediately after logging in to ensure the security of your account.

Thank you again for choosing HIP-HOSTING. We look forward to serving you!

Best regards,
The HIP-HOSTING Team
Follow us on Telegram: @hiphosting
      `,
      };

      // Nodemailer sozlamalari
      const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      // Email jo'natish
      const mailResponse = await transporter.sendMail(mailOptions);
      if (!mailResponse.accepted.length) {
        return response.error(
          res,
          "Failed to send email. Please check your email settings or try again later."
        );
      }

      return response.success(
        res,
        "Registered successfully! Please check your email for verification code."
      );
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async login(req, res) {
    try {
      const user = await UserDB.findOne({
        email: req.body.email,
        password: req.body.password,
      });

      if (!user) return response.error(res, "login and password is incorrect");
      const token = await jwt.generate(user.toObject(), "1d");

      return response.success(res, "login successfully", { user, token });
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  // get all user
  async getAllUser(req, res) {
    try {
      const users = await UserDB.find();
      if (!users) return response.error(res, "User not found");
      return response.success(res, "User found", users);
    } catch (error) {
      return response.error(res, error.message);
    }
  }
}

module.exports = new User();
