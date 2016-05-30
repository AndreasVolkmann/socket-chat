'use strict';

import Message from '../models/Message';
import UserController from './UserController';

const history = [];

export default {
    
    addMessage : addMessage,
    getHistory : getHistory
    
}


function addMessage(message, userName) {
    const msg = new Message({
        text  : message,
        author: userName,
        date  : Date.now()
    });
    history.push(msg);
    return msg;
}

function getHistory(size) {
    const start = history.length >= size ? size : history.length;
    const recent = history.slice(history.length - start, history.length);
    return recent;
}