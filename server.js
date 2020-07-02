const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("./passport");

const pme = require("./routes/pme");

mongoose
  .connect("mongodb://localhost/crm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected"))
  .catch((err) => console.log("error", err));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/pme", pme);

const port = process.env.PORT || 3000;

app.set("port", port);

app.listen(port);
