const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    status: { type: Boolean },
    balans: { type: Number, default: 0 },
    avatar: { type: String },
    birthday: { type: Date },
    country: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);
module.exports = UserModel;
