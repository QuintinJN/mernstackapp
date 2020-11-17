const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const multer = require("multer");

const File = require('../models/files');
const User = require('../models/users')

router.get('/',(req, res) => {

    User.find({})
    .then((data) =>{
        console.log('Data: ', data);
        res.json(data);
    })
    .catch((error) =>{
        console.log('Error: ', error);
    });
});

router.post('/save',(req, res) => {
    const data = req.body;

    const newUser = new User(data);

    //.save

    newUser.save((error) => {
        if(error){
            res.status(500).json({ msg: 'Internal server errors'});
            return;
        }
        return res.json({
            msg:'Your data has been saved'
        });
    });
});

const storage = multer.diskStorage({
    destination: "./public/",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });
 
 const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
 }).single("myfile");
 
 const obj =(req,res) => {
    upload(req, res, () => {
       console.log("Request ---", req.body);
       console.log("Request file ---", req.file);//Here you get file.
       const file = new File();
       file.meta_data = req.file;
       file.save().then(()=>{
       res.send({message:"uploaded successfully"})
       })
    });
 }
 
 router.post("/upload", obj);

module.exports = router;