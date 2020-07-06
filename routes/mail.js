const express = require("express");
const nodemailer = require("nodemailer");
// const ejs = require("ejs");
const Pme = require("../models/pmeSchema");
const User = require("../models/userSchema");
router = express.Router();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let mailTransporter = nodemailer.createTransport({ 
    service: 'Gmail',
    tls:{
        rejectUnauthorized: false
    },
    port: 465,
    secure: false,
    auth: { 
        user: 'amenbentoumi@gmail.com',
        pass: 'amen24256186'
    } 
});
    router.post('/sendmail', function(req,res){
        User.findOne({'users': req.body.email}, function(err,User ) {
    let mailDetails = { 
        from: '<amenbentoumi@gmail.com>', 
        to: User.email, // list of receivers
        subject: "stock status 👻", // Subject line
        html: `<h1>Hi ${User.name}</h1><br>
        <h4>chek your stock</h4>`
    }; 
    mailTransporter.sendMail(mailDetails,(err, data)=> { 
          if(err) { 
              console.log(err); 
              res.send(err)
            } else { 
                console.log('Email sent successfully'); 
                res.send(data);
                res.send({
                    message:'mail send success!'
                })
            } 
        }); 
    })
});
module.exports = router;
