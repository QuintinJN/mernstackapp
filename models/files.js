const mongoose = require('mongoose');

//Schema
const Schema = mongoose.Schema;
const FileSchema = new Schema({
    idNumber: {
        type: Boolean,
        default: false
    },
    email: {
        type: Boolean,
        default: false
    },
    cellNumber: {
        type: Boolean,
        default: false
    }
});

//Model
const newFile = mongoose.model("File", FileSchema);

module.exports = newFile;