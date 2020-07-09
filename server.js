const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("./passport");
// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger.json");

const activite = require("./routes/activity");
const pme = require("./routes/pme");
const user = require("./routes/user");
const admin = require("./routes/admin");
const stock = require("./routes/stock");
const upload =require("./routes/upload");
const categorie = require("./routes/categorie")
const path = require('path')

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
// const swaggerExpress = require("express-swagger-generator")(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/upload',express.static(path.join(__dirname, 'upload')));

app.use("/pme", pme);
app.use("/user", user);
app.use("/admin", admin);

app.use("/activity", activite);
app.use("/stock", stock);
app.use("/uploadimg", upload);
app.use("/categorie", categorie)

// *********************** app listening*******************//

// let options = {
//   swaggerDefinition: {
//     info: {
//       description: "This is a sample server",
//       title: "Swagger",
//       version: "1.0.0",
//     },
//     host: "localhost:3000",
//     produces: ["application/json", "application/xml"],
//     schemes: ["http", "https"],
//   },
//   basedir: __dirname, //app absolute path
//   files: ["./routes/*.js"], //Path to the API handle folder
// };
// console.log(__dirname);

// swaggerExpress(options);
const port = process.env.PORT || 3000;
app.set("port", port);
app.listen(port);
