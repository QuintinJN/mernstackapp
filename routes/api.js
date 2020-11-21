const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const debug = require('debug')('myapp:server');
const fs = require('fs');
const readline = require('readline');
const util = require('util');
const File = require('../models/files');
const User = require('../models/users');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

//Get every user
router.get('/', (req, res) => {

    User.find({})
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
});

router.get('/file', function (req, res) {
    return res.send("hello from my app express server!")
});

//Read file line for line
async function processLineByLine(fileName) {
    const fileStream = fs.createReadStream('public/uploads/' + fileName);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const myData = [];

        console.log(`${line}`);
    }
}

//Save user to DB
router.post('/save', (req, res) => {
    const data = req.body;

    const newUser = new User(data);

    //.save

    newUser.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Internal server errors' });
            return;
        }
        return res.json({
            msg: 'Your data has been saved'
        });
    });
});

//save file name to DB
router.post('/random', (req, res) => {
    const data = req.body;

    const newFile = new Files(data);

    //.save

    newFile.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Internal server errors' });
            return;
        }
        return res.json({
            msg: 'Your data has been saved'
        });
    });
});


router.post('/upload', upload.single('file'), function(req,res) {


    if(req.file == null){
        return res.json({
            msg:'No file recieved'
        });
    }
    debug(req.file);
    console.log('storage location is ', req.hostname +'/' + req.file.path);
    processLineByLine(req.file.filename);
    return res.send(req.file);
});

module.exports = router;