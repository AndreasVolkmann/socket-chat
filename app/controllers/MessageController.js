'use strict';

const Message = require('../models/Message');
const UserController = require('./UserController');

const history = [];

module.exports = function (io, socket) {
    let user;


    socket.on('auth', async(username) => {
        console.log('Username: ' + username);
        user = await UserController.addUser(socket.id, username);

        sendAuth(user, socket);
        sendUsers(socket);
        broadcastUser(user, socket);
        sendHistory(socket);
    });

    socket.on('post message', (message) => {
        console.log(`${socket.id}: ${message}`);
        let msg = new Message({
            text: message,
            author: user.name,
            date: Date.now()
        });
        history.push(msg);
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

function sendHistory(socket) {
    let start = history.length >= 10 ? 10 : history.length;
    let recent = history.slice(history.length - start, history.length);
    console.log(recent);
    socket.emit('history', recent);
}