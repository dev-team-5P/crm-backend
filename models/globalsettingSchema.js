const mongoose = require("mongoose");

SettingSchema = new mongoose.Schema({
    isActivAdmin: { type: Boolean, default: true },
    isActivSuperAdmin: { type: Boolean, default: true },
});

module.exports = mongoose.model("Setting", SettingSchema);