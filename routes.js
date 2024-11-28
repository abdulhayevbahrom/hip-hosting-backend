const { Router } = require("express");
const userService = require("./service/user");
const userValidation = require("./validation/user.validation");

const router = Router();

router.post("/register", [userValidation.register], userService.register);
router.post("/login", [userValidation.login], userService.login);
router.get("/users", userService.getAllUser);

module.exports = router;
