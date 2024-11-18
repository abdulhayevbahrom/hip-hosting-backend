const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

class jwtHelper {
  // generate token
  async generate(data, expiresIn = "1h") {
    return new Promise((resolve, reject) => {
      try {
        const token = jwt.sign(data, secretKey, { expiresIn });
        return resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  }

  // verify token
  async verify(token) {
    return new Promise((resolve, reject) => {
      try {
        const verify = jwt.verify(token, secretKey);
        return resolve(verify);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new jwtHelper();
