const response = require("../utils/response.helper");
const userService = require("../service/user");

class user {
  async register(req, res) {
    try {
      const user = await userService.register(req);
      return response.success(res, "User created successfully!", user);
    } catch (error) {
      return response.serverError(res, "Server Error", error);
    }
  }

  // login
  async login(req, res) {
    try {
      const user = await userService.login(req);
      return response.success(res, "User login successfully!", user);
    } catch (error) {
      console.log(error);
      return response.serverError(res, "Server Error", error);
    }
  }
}

module.exports = new user();
