const express = require("express");
const setting = require("../models/globalsettingSchema");
const passport = require("passport");
const Admin = require("../models/adminSchema");

const router = express.Router();

/* READ ME ==+++++W>>>>>>> cette partie est à utiliser une seule fois pour initialiser la base de donnée */
router.post(
    "/activemail/",
    // passport.authenticate("bearer", { session: false }),
    async (req, res) => {
            const set = new setting(req.body);
            await set.save();
            res.send(set);
    }
);
/*******************activate notif mail ************ */
router.get(
    "/activemail",
    passport.authenticate("bearer", { session: false }),
    async (req, res) => {
        const admin = await Admin.findById(req.user.admin._id);

        if (admin.role !== "superAdmin")
            return res.send({ message: "Unauthorized" });

        const set = await setting.findOne();
        res.send(set);
    }
);


/*******************desactivate notif mail ************ */
router.put("/desactivmail",
    passport.authenticate("bearer", { session: false }),
    async (req, res) => {
        const admin = await Admin.findById(req.user.admin._id);

        if (admin.role !== "superAdmin")
            return res.send({ message: "Unauthorized" });

        const set = await setting.findOneAndUpdate( req.body);
        await set.save();
        res.send('activation-email-notif was updated');
    }
);


module.exports = router;
