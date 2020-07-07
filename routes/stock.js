const express = require("express");
const passport = require("passport");
const multer = require("multer");
const Stock = require("../models/stockScheam");
const Pme = require("../models/pmeSchema");
const User = require("../models/userSchema");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const router = express.Router();

// create sock //
router.post(
  "/:domain/create",
  multer({ storage: storage }).single("image"),
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const domain = await Pme.findOne({ domain: req.params.domain });
    const user = await User.findById(req.user.user);

    if (!domain)
      return res.status(400).send({ message: "Enter a correct http address" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });

    // const url = req.protocol + "://" + req.get("host");
    // const imagePath = url + "/uploads/" + req.file.filename;
    const stock = new Stock(req.body);
    await stock.save();

    res.send(stock);
  }
);

// get allStock //
router.get(
  "/:domain",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const domain = await Pme.findOne({ domain: req.params.domain });
    const user = await User.findById(req.user.user);

    if (!domain)
      return res.status(400).send({ message: "Enter a correct http address" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });
    const stocks = await Stock.find();

    res.send(stocks);
  }
);

// get product by id //
router.get(
  "/:domain/:id",

  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const domain = await Pme.findOne({ domain: req.params.domain });
    const user = await User.findById(req.user.user);

    if (!domain)
      return res.status(400).send({ message: "Enter a correct http address" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });
    const product = await Stock.findById(req.params.id);

    res.send(product);
  }
);

// modify product by its id //
router.put(
  "/:domain/edit/:id",
  multer({ storage: storage }).single("image"),
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const product = await Stock.findByIdAndUpdate(req.params.id, req.body);

    res.send(product);
  }
);

// delete product by its id //
router.delete("/:domain/delete/:id", async (req, res) => {
  const domain = await Pme.findOne({ domain: req.params.domain });
  const user = await User.findById(req.user.user);

  if (!domain)
    return res.status(400).send({ message: "Enter a correct http address" });

  if (!user) return res.status(400).send({ message: "Unauthorized" });
  await Stock.findByIdAndDelete(req.params.id);

  res.send({ message: "product deleted" });
});

module.exports = router;
