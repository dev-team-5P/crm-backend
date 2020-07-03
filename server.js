const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const pme = require("./routes/pme");
const activite = require("./routes/activity");
require("./passport");

<<<<<<< HEAD
const pme = require("./routes/pme");
const user = require("./routes/user");
const admin = require("./routes/admin");
=======
>>>>>>> e6142223e2e7b8cae8086770b287f47fdcbe2e1d

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

app.use("/pme", pme);
<<<<<<< HEAD
app.use("/user", user);
app.use("/admin", admin);
=======
app.use("/activity", activite);
>>>>>>> e6142223e2e7b8cae8086770b287f47fdcbe2e1d



// *********************** app listening*******************//
const port = process.env.PORT || 3000;
app.set("port", port);
app.listen(port);
