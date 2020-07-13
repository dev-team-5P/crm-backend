const routes = require('express').Router();
const process = require('process');
const multer = require('multer');
var stock = require('./../models/stockSchema')
var passport = require('passport');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + '/upload')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({ storage: storage });
routes.put('/:id',passport.authenticate('bearer', {session:false}), upload.single('image'), (req, res) => {
    var link = "http://localhost:3000/upload/"+ req.file.filename
    stock.findByIdAndUpdate(req.params.id,{$set:{imagePath:link}},(err,resultat)=>{
        if (err) {
            res.send(err)
        }
        res.send(resultat);
        console.log(resultat);
    })
})
module.exports = routes;