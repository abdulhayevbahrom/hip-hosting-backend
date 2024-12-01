const validator = require("../utils/validate.helper.js");
const response = require("../utils/response.helper.js");

class userValidation {
  // register user POST / resgister
  async register(req, res, next) {
    try {
      const schema = {
        type: "object",
        properties: {
          fullname: { type: "string", minLength: 2, maxLength: 30 },
          email: { type: "string", format: "email" },
          password: { type: "string", pattern: "^[a-zA-Z0-9]{5,15}$" },
          balans: { type: "number" },
          avatar: { type: "string" },
          birthday: { type: "string", format: "date" },
          country: { type: "string" },
        },
        required: ["email"],
        additionalProperties: false,
        errorMessage: {
          properties: {
            name: "fullname must be string",
            email: "email format is invalid",
            password: "password must be string",
            balans: "balans must be number",
            avatar: "avatar must be string",
            birthday: "birthday must be string and date format",
            country: "country must be string",
          },
          required: {
            fullname: "fullname is required",
            email: "email is required",
            password: "password is required",
            balans: "balans is required",
            avatar: "avatar is required",
            birthday: "birthday is required",
            country: "country is required",
          },
        },
      };

      const validate = await validator(schema, req.body);
      if (validate) {
        return res.status(400).json({
          status: "error",
          message: "validation error",
          errors: validate,
        });
      }
      return next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  // login user POST / login
  async login(req, res, next) {
    try {
      const schema = {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", pattern: "^[a-zA-Z0-9]{5,15}$" },
        },
        required: ["email", "password"],
        additionalProperties: false,
        errorMessage: {
          properties: {
            email: "email format is invalid",
            password: "password must be string and min 5 max 15",
          },
          required: {
            email: "email is required",
            password: "password is required",
          },
        },
      };
      const validate = await validator(schema, req.body);
      if (validate) {
        return res.status(400).json({
          status: "error",
          message: "validation error",
          errors: validate,
        });
      }

      return next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new userValidation();
