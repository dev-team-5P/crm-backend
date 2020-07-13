const routes = require("express").Router();
const process = require("process");
const multer = require("multer");
const Stock = require("./../models/stockSchema");
const passport = require("passport");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/upload");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now().toString() +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});
const upload = multer({ storage: storage });
routes.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  upload.single("image"),
  (req, res) => {
    if (!req.file) return res.send({ message: "no image uploaded" });
    else {
      const link = "http://localhost:3000/upload/" + req.file.filename;
      return Stock.findByIdAndUpdate(
        req.params.id,
        { $set: { imagePath: link } },
        (err, resultat) => {
          if (err) {
            res.send(err);
          }
          res.send(resultat);
        }
      );
    }
  }
);
module.exports = routes;
