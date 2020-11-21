const mongoose = require('mongoose');

//Schema
const Schema = mongoose.Schema;
const FileSchema = new Schema({
     fileLocation: {},
 });

 //Model
 const File = mongoose.model("Files",FileSchema);
 
 module.exports = File;