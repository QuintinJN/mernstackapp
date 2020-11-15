const express = require('express');

const router = express.Router();

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

router.get('/name',(req, res) => {
    const data = {
        username:'peter',
        age: 5
    };
    res.json(data);
});

module.exports = router;