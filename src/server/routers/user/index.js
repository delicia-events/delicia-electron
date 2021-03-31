const express = require("express");
// const { body } = require("express-validator");
const UserController = require("../../controller/user");

const router = express.Router();
router.post(
  "/login",
  UserController.appLogin
);

// router.get(
//   "/account",
//   SettingsController.getAccountSettings
// );

module.exports = router;
