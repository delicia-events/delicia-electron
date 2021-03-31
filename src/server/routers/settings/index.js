const express = require("express");
// const { body } = require("express-validator");
const SettingsController = require("../../controller/settings");

const router = express.Router();
router.get("/basicconfig", SettingsController.getSettings);
router.get("/account", SettingsController.getAccountSettings);
router.post("/basicconfig", SettingsController.updateSettings);
router.post("/account", SettingsController.updateAccountSettings);

module.exports = router;
