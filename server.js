const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const activite = require("./routes/activity");
const fournisseur = require ("./routes/fournisseur");
// const path = require('path');
const pme = require("./routes/pme");
const user = require("./routes/user");
const admin = require("./routes/admin");
require("./passport");
// *************************** base de donnée*****************************************//
mongoose
  .connect("mongodb://localhost/crm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected"))
  .catch((err) => console.log("error", err));
//*********************************************************************************** */
const app = express();

// *************************** view engine setup*****************************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/pme", pme);
app.use("/user", user);
app.use("/admin", admin);
app.use("/activity", activite);
app.use("/fournisseur", fournisseur);
// app.post('/confirmation', userController.confirmationPost);// token confirmation
 



// *********************** app listening*******************//
const port = process.env.PORT || 3000;
app.set("port", port);
app.listen(port);
