'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    text  : {
        type: String
    },
    author: {
        type: String
    },
    date  : {
        type   : Date,
        default: Date.now()
    },
    room  : {
        type: String
    }
});


export default mongoose.model('Message', MessageSchema);