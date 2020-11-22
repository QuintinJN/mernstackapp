const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 5000;


const routes = require('./routes/api');



const MONGODB_URI = 'mongodb+srv://QuintinNel:quintin123@cluster0.ds92k.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI || 'mongodb://localhost/mern_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () =>{
    console.log('Mongoose is connected!');
});


//Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//HTTP request logger
app.use(morgan('tiny'));
app.use('/api', routes);
//app.use(express.static('public'));


//app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));


if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
}

app.listen(PORT, console.log(`server is starting at ${PORT}`));