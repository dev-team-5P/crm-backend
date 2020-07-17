const express = require("express");
const Activity = require("../models/ActivitySchema");
const router = express.Router();
const Admin = require("../models/adminSchema");
passport = require("passport");

//create new activity
router.post("/add",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (!admin) return res.send({ message: "Unauthorized" });

    const activity = new Activity(req.body);
    await activity.save();
    res.send(activity);
  }
);
// create findAll
router.get("/get",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (admin.role === "superAdmin" || admin.role === 'admin') {
      const pageSize = +req.query.pagesize;
      const currentPage = +req.query.page;
      const activityQuery = Activity.find();

      if (pageSize && currentPage) {
        activityQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
      }
      const activity = await activityQuery;
      const activityCount = await Activity.countDocuments();
      res.send({ activity: activity, count: activityCount });
    }
    else
      {return res.send({ message: "Unauthorized" });}
  });

// create delete by id api 
router.delete(
  "/delete/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (admin.role !== "superAdmin")
      return res.status(401).send({ message: "Unauthorized" });

    await Activity.findByIdAndDelete(req.params.id);
    res.send({ message: "activity was deleted successfully" });
  }
);
// create update by id api 
router.put(
  "/edit/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (!admin) return res.send({ message: "Unauthorized" }); // only admin and superAdmin can modify 

    if (admin.role === "superAdmin") {
      await Activity.findByIdAndUpdate(req.params.id, req.body);
      res.send({ message: "activity was deleted successfully" });
    } else res.send({ message: "Unauthorized access" });
  }
);

// affect activity to pme
// router.put("/:id/:idact",
//     passport.authenticate('bearer', { session: false }),
//     (req, res) => {
//         const id = req.params.id;
//         const idact = req.params.idact;
//         Admin.findByIdAndUpdate(id, { $push: { article: idact } }, (err, resultat) => {
//             if (err) {
//                 res.send(err)
//             } else {
//                 res.send(resultat)
//             }
//         });
//     });

// // create findOne
// router.get("/get/:id", function (req, res) {
//     const id = req.params.id;
//     Activity.findById(id, (err, resultat) => {
//         if (err) res.send({
//             message: "Could not find activity with id=" + id
//         });
//         res.send(resultat);
//     })
// });
module.exports = router;
