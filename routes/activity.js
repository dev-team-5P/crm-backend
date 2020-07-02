const express = require("express");
const activity = require("../models/ActivitySchema");
const router = express.Router();
// const admin = require("../models/adminSchema"); 
passport = require("passport");

//create new activity
router.post("/add",
    passport.authenticate('bearer', { session: false }),
    function (req, res) {
        activity.create(req.body, (err, resultat) => {
            if (err) { res.send(err); }
            res.send(resultat);
        });
    });
// affect activity to pme
router.put("/:id/:idact" , 
passport.authenticate('bearer', { session: false }),
(req , res)=> {
    const id = req.params.id;
    const idact  = req.params.idact;
    admin.findByIdAndUpdate(id, { $push: { article:idact } },(err, resultat)=>{
        if (err) {
            res.send(err)
        } else {
            res.send(resultat)
        }
    });
});
// create findAll
router.get("/findall", function (req, res) {
    activity.find({}, (err, resultat) => {
        if (err) res.send(err);
        res.send(resultat);
    })
});
// create findOne
router.get("/findone/:id", function (req, res) {
    var id = req.params.id;
    activity.findById(id, (err, resultat) => {
        if (err) res.send({
            message: "Could not find activity with id=" + id
        });
        res.send(resultat);
    })
});
// create update by id api 
router.put("/update/:id", function (req, res) {
    var id = req.params.id;
    activity.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update activity with id=${id}. Maybe activity was not found!`
                });
            } else res.send({ message: "activity was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating activity with id=" + id
            });
        });
})
// create delete by id api 
router.delete("/delete/:id", function (req, res) {
    var id = req.params.id;
    activity.findByIdAndRemove(id, (err, resultat) => {
        if (err) res.send({
            message: "Could not delete activity with id=" + id
        });
        res.send({
            message: "activity was deleted successfully!"
        });
    });
});

module.exports = router;
