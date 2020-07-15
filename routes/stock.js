const express = require("express");
const passport = require("passport");
// const multer = require("multer");
const Stock = require("../models/stockSchema");
const Pme = require("../models/pmeSchema");
const User = require("../models/userSchema");
// const notifRupture = require("./mail-notif-rupture-stock");
const NotifMail = require("../models/notifSchema");

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
    newStock.user = req.user.user._id;
    // newStock.imagePath = imagePath;
    const stock = new Stock(newStock);
    const notif = new NotifMail();

    await stock.save();
    await notif.save();
    await NotifMail.findByIdAndUpdate(notif._id, { produit: stock._id });

    res.send(stock);
  }
);

// get pme Stock //
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const stockQuery = Stock.find({ pme: req.params.id });

    if (pageSize && currentPage) {
      stockQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });
    // const stocks = await Stock.find({pme :req.params.id});

    const stocks = await stockQuery;
    const stockCount = await Stock.countDocuments({ pme: req.params.id });


    res.send({ stocks: stocks, count: stockCount });
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
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);

    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });

    const product = await Stock.findById(req.params.prodId);
    const notif = await NotifMail.findOne({ produit: product._id });

    // const url = req.protocol + "://" + req.get("host");
    // const imagePath = url + "/uploads/" + req.file.filename;
    const newStock = req.body;

    const updatedProduct = await Stock.findByIdAndUpdate(
      req.params.prodId,
      newStock
    );

    if (updatedProduct.stock > updatedProduct.min)
      await NotifMail.findByIdAndUpdate(notif._id, { send: true });

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

    const product = await Stock.findByIdAndDelete(req.params.prodId);
    await NotifMail.findOneAndDelete({ produit: product._id });

    res.send({ message: "product deleted" });
  }
);

// router.post(
//   "/:id/notif-rupture/:prodId",
//   passport.authenticate("bearer", { session: false }),
//   notifRupture.notifyRupture
// );

module.exports = router;
