const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const pme = require("./routes/pme");
const activite = require("./routes/activity");
const user = require("./routes/user");
const admin = require("./routes/admin");

const stock = require("./routes/stock");
const upload =require("./routes/upload");
const categorie = require("./routes/categorie")
const path = require('path')

const fournis = require("./routes/fourni")
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/upload',express.static(path.join(__dirname, 'upload')));

app.use("/pme", pme);
app.use("/user", user);
app.use("/admin", admin);
app.use("/fournis", fournis);


app.use("/activity", activite);
app.use("/stock", stock);
app.use("/uploadimg", upload);
app.use("/categorie", categorie)


// *********************** app listening*******************//
const port = process.env.PORT || 3000;
app.set("port", port);
app.listen(port);
