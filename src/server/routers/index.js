const express = require("express");
const StaffRoutes = require("./staff");
const WorkRoutes = require("./work");
const SettingsRoutes = require("./settings");
const UserRoutes = require("./user");

const app = express();

app.use("/staff-management", StaffRoutes);
app.use("/work-management", WorkRoutes);
app.use("/settings", SettingsRoutes);
app.use("/user", UserRoutes);

module.exports = app;
