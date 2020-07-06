const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const pme = require("./routes/pme");
const activite = require("./routes/activity");

const mail = require("./routes/mail");
require("./passport");

const pme = require("./routes/pme");

const user = require("./routes/user");
const admin = require("./routes/admin");
require("./passport");

// *************************** base de donnée*****************************************//
mongoose
  .connect("mongodb://localhost:27017/crm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected"))
  .catch((err) => console.log("error", err));
//*********************************************************************************** */
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/pme", pme);
app.use("/user", user);
app.use("/admin", admin);

app.use("/activity", activite);
app.use("/mail", mail);


// *********************** app listening*******************//
const port = process.env.PORT || 3000;
app.set("port", port);
app.listen(port);
