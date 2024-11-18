const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, required: true, default: "user" },
  status: { type: Boolean },
  balans: { type: Number, default: 0 },
});

const UserModel = model("User", userSchema);
module.exports = UserModel;
