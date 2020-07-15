

// *****      READ ME  ******//  first test 
// const express = require("express");
// const Admin = require("../models/adminSchema");
// const setting = require("../models/globalsettingSchema");
// const passport = require("passport");

// const router = express.Router();

// /*******************activate notif mail ************ */
// router.post(
//     "/activemail/",
//     // passport.authenticate("bearer", { session: false }),
//     async (req, res) => {
//             const set = new setting(req.body);
//             await set.save();
//             res.send(set);
//     }
// );
// /*******************activate notif mail ************ */
// router.get(
//     "/activemail/:id",
//     // passport.authenticate("bearer", { session: false }),
//     async (req, res) => {
//         // const admin = await Admin.findById(req.user.admin._id);

//         // if (admin.role !== "superAdmin")
//         //     return res.send({ message: "Unauthorized" });
//             const set = new setting();
//             await set.save();
//             res.send(set);
//     }
// );


// /*******************desactivate notif mail ************ */
// router.put("/desactivmail/:id",
//     // passport.authenticate("bearer", { session: false }),
//     async (req, res) => {
//         // const admin = await Admin.findById(req.user.admin._id);

//         // if (admin.role !== "superAdmin")
//         //     return res.send({ message: "Unauthorized" });

//         const set = new setting(req.body);
//         await set.save();
//         res.send('ok');
//     }
// );


// module.exports = router;