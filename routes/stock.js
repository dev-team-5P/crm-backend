const express = require("express");
const passport = require("passport");
const multer = require("multer");
const Stock = require("../models/stockSchema");
const Pme = require("../models/pmeSchema");
const User = require("../models/userSchema");
const notifRupture = require("./mail-notif-rupture-stock");

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const router = express.Router();

// create sock //
router.post(
  "/:id/create",
  // multer({ storage: storage }).single("image"),
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);

    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });

    // const url = req.protocol + "://" + req.get("host");
    // const imagePath = url + "/uploads/" + req.file.filename;
    const newStock = req.body;
    newStock.pme = req.params.id;
    // newStock.imagePath = imagePath;
    const stock = new Stock(newStock);

    await stock.save();

    res.send(stock);
  }
);

// get allStock //
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);

    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });
    const stocks = await Stock.find();

    res.send(stocks);
  }
);

// get product by id //
router.get(
  "/:id/:prodId",

  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);

    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });

    const product = await Stock.findById(req.params.prodId);

    res.send(product);
  }
);

// modify product by its id //
router.put(
  "/:id/edit/:prodId",
  // multer({ storage: storage }).single("image"),
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);

    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });

    const product = await Stock.findById(req.params.prodId);

    // const url = req.protocol + "://" + req.get("host");
    // const imagePath = url + "/uploads/" + req.file.filename;
    const newStock = req.body;

    if (product.imagePath != imagePath) {
      newStock.imagePath = imagePath;
    }
    const updatedProduct = await Stock.findByIdAndUpdate(
      req.params.prodId,
      newStock
    );

    res.send(updatedProduct);
  }
);

// delete product by its id //
router.delete(
  "/:id/delete/:prodId",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);

    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });

    await Stock.findByIdAndDelete(req.params.prodId);

    res.send({ message: "product deleted" });
  }
);

router.post(
  "/:id/notif-rupture/:prodId",
  passport.authenticate("bearer", { session: false }),
  notifRupture.notifyRupture
);

module.exports = router;
