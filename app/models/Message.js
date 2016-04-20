'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    message: {
        type: String
    },
    author: {
        type: String
    },
    ct: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Message', MessageSchema);