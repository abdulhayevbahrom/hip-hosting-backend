require("dotenv").config();
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const fetch = require("node-fetch");
const UserDB = require("../models/user.model");
const response = require("../utils/response.helper");
const { v4: uuidv4 } = require("uuid");

// GitHub callback funksiyasi
const githubCallback = async (req, res) => {
  const user = req.user;
  console.log(">>>>>", user);

  //   user.password = "234rr";
  //   user.status = false;
  //   user.balans = 0;
  //   user.birthday = null;

  //   const exactUser = await UserDB.findOne({ email: user.email });
  //   if (exactUser) return response.error(res, "User already exists");

  //   const verificationCode = uuidv4().replace(/-/g, "").slice(0, 10);
  //   req.body.password = verificationCode;

  //   // Yangi foydalanuvchini saqlash
  //   const newUser = new UserDB(req.body);
  //   const savedUser = await newUser.save();
  //   if (!savedUser) return response.error(res, "User not saved");

  return response.success(
    res,
    "Registered successfully! Please check your email for verification code."
  );
};
