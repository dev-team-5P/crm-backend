const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");

module.exports = {
  async getCollection(req) {
    const admin = await Admin.findOne({ email: req.body.email });
    const user = await User.findOne({ email: req.body.email });

    if (admin) return Admin;
    else if (user) return User;
  },
  async getCollectinById(userToken) {
    const adminId = await Admin.findOne({ resetToken: userToken._id });
    const userId = await User.findOne({ resetToken: userToken._id });
    if (adminId) return Admin;
    else if (userId) return User;
  },
  async updateCollection(req, resetToken) {
    const adminId = await Admin.findOneAndUpdate(
      { email: req.body.email },
      { resetToken: resetToken._id }
    );
    const userId = await User.findOneAndUpdate(
      { email: req.body.email },
      { resetToken: resetToken._id }
    );
    if (adminId) return Admin;
    else if (userId) return User;
  },
};
