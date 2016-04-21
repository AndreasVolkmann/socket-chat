'use strict';

const Message = require('../models/Message');
const UserController = require('./UserController');


module.exports = function (io, socket) {
    console.log(`Socket connected: ${socket.id}`);
    
    let user = UserController.addUser(socket.id);
    socket.emit('auth', user);
    socket.emit('users', UserController.getUsers());
    socket.broadcast.emit('user', user);

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });

    socket.on('post message', (message) => {
        console.log(`${socket.id}: ${message}`);
        socket.broadcast.emit('message', user.name + ': ' + message);
    });
    
    socket.on('disconnect', () => {
        console.log(user);
        io.emit('disconnect', user);
        UserController.removeUser(socket.id);
    });

};