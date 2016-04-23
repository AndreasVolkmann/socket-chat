'use strict';

const Message = require('../models/Message');
const UserController = require('./UserController');


module.exports = function (io, socket) {


    let user = UserController.addUser(socket.id);
    sendAuth(user, socket);
    sendUsers(socket);
    broadcastUser(user, socket);
    

    socket.on('post message', (message) => {
        console.log(`${socket.id}: ${message}`);
        let msg = new Message({
            message: message,
            author: user.name
        });
        socket.broadcast.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        io.emit('user disconnect', user);
        UserController.removeUser(socket.id);
    });
    
    socket.on('username', async(username) => {
        user.name = username;
        user = await Promise.resolve(UserController.updateUser(user));
        socket.broadcast.emit('user update', user);
    });
};

function sendUsers(socket) {
    console.log('Sending users ...');
    socket.emit('users', UserController.getUsers());
}

function sendAuth(user, socket) {
    console.log('Sending auth ...');
    socket.emit('auth', user);
}

function broadcastUser(user, socket) {
    console.log('Broadcasting user ...');
    socket.broadcast.emit('user', user);
}

function sendHistory() {
    
}