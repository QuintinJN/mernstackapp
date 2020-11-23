const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const fs = require('fs');
const readline = require('readline');
const newFile = require('../models/files');
const User = require('../models/users');
const { object } = require('prop-types');
const { text } = require('express');
const { getMaxListeners, db } = require('../models/files');


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
  var tempEmail = false;
  var tempCell = false;
  var tempID = false;
  for await (const line of rl) {
    //console.log(`${line}`);
    const test = line;
    if (isEmail(test)) {
      console.log('Contains an Email');
      tempEmail = true;
    }
    if (hasNumber(test)) {
      if (extractFromID(test)) {
        console.log('Contains an ID');
        tempID = true;
      }
      if (testPhoneNumber(test)) {
        console.log('Contains a Cell phone number');
        tempCell = true;
      }
    }
  }
  const sampleFile = new newFile({
    "idNumber": tempID,
    "email": tempEmail,
    "cellNumber": tempCell
  })
  sampleFile.save();
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

router.post('/file', (req, res) => {
  newFile.create(req.body).then(function (File) {
    res.send(File);
  });
});

module.exports = router;