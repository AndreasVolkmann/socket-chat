'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    id  : {
        type    : String,
        required: true
    },
    name: {
        type    : String,
        required: true
    },
    room: {
        type   : String,
        default: ''
    }
}, {
    timestamps: true
});


export default mongoose.model('User', UserSchema);