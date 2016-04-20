'use strict';

const Message = require('../models/Message');
const UserController = require('./UserController');


module.exports = function (io, socket) {
    console.log(`Socket connected: ${socket.id}`);
    
    let username = UserController.addUser(socket.id);
    socket.emit('username', username);

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });

    socket.on('post message', (message) => {
        console.log(`${socket.id}: ${message}`);
        socket.broadcast.emit('message', username + ': ' + message);
    });


};