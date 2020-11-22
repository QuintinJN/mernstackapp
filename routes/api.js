const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const debug = require('debug')('myapp:server');
const fs = require('fs');
const readline = require('readline');
const util = require('util');
const newFile = require('../models/files');
const User = require('../models/users');
const { object } = require('prop-types');
const { text } = require('express');
const { getMaxListeners } = require('../models/files');


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


//Read file line for line
async function processLineByLine(fileName) {
  const fileStream = fs.createReadStream(`${__dirname}/public/uploads/` + fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const myData = [];

    //console.log(`${line}`);
    const test = line;
    if (isEmail(test))
      console.log('Contains an Email');
    if (hasNumber(test)) {
      if (extractFromID(test)){
        console.log('Contains an ID');
      }
      if (testPhoneNumber(test)){
        console.log('Contains a Cell phone  number');
      }
    }

  }
}

function hasNumber(myString) {
  return /\d/.test(myString);
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

//ID validation
var generateLuhnDigit = function (inputString) {
  var total = 0;
  var count = 0;
  for (var i = 0; i < inputString.length; i++) {
    var multiple = count % 2 + 1;
    count++;
    var temp = multiple * +inputString[i];
    temp = Math.floor(temp / 10) + (temp % 10);
    total += temp;
  }

  total = (total * 9) % 10;

  return total;
};

var extractFromID = function (idNumber) {
  var checkIDNumber = function (idNumber) {
    var number = idNumber.substring(0, idNumber.length - 1);
    return generateLuhnDigit(number) === +idNumber[idNumber.length - 1];
  };

  var result = false;
  result = checkIDNumber(idNumber);
  return result;
};


//Validate cell phone  number
var testPhoneNumber = function (number) {
  var trimmed = number.replace(/\s/g, '');

  var regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/;
  var y = false;
  if (regex.test(trimmed) === true) {
    y = true;
  }
  return y;
}

//Validate email
function isEmail(email) {

  var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Convert the email to lowercase 
  return regexp.test(String(email).toLowerCase());
}

router.use(fileUpload());
router.post('/upload', async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
  processLineByLine(file.name);
});

module.exports = router;