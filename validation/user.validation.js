const validator = require("../utils/validate.helper.js");
const response = require("../utils/response.helper.js");

class userValidation {
  // register user POST / resgister
  async register(req, res, next) {
    try {
      const schema = {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 30 },
          email: { type: "string", format: "email" },
          password: { type: "string", pattern: "^[a-zA-Z0-9]{5,15}$" },
        },
        required: ["email"],
        additionalProperties: false,
        errorMessage: {
          properties: {
            name: "fullname must be string",
            email: "email must be string",
            password: "password must be string",
          },
          required: {
            fullname: "fullname is required",
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
            email: "email must be string",
            password: "password must be string",
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
