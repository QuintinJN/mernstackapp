const mongoose = require('mongoose');

//Schema
const Schema = mongoose.Schema;
const FileSchema = new Schema({
     idNumber: Boolean
 });

 //Model
 const newFile = mongoose.model("File",FileSchema);
 
 module.exports = newFile;