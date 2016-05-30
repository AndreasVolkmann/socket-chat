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
    }
});


export default mongoose.model('Message', MessageSchema);