const { Router } = require("express");
const user = require("./controller/auth.controller");
const userValidation = require("./validation/user.validation");

const router = Router();

router.post("/register", [userValidation.register], user.register);
router.post("/login", [userValidation.login], user.login);

module.exports = router;
