
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId,  ref: 'User' },
    _adminId: { type: mongoose.Schema.Types.ObjectId,  ref: 'Admin' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

module.exports = mongoose.model("Token", tokenSchema);