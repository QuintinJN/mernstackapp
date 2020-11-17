const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const FileSchema = new Schema({
    meta_data:{}
});

const File = mongoose.model("File",FileSchema);
module.exports = File;