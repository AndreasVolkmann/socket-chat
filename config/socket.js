'use strict';

const MessageController = require('../app/controllers/MessageController');
const UserController = require('../app/controllers/UserController');

module.exports = async(io, socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    socket.user = UserController.addUser(socket.id);
    sendAuth();
    sendUsers();
    sendHistory();
    
    function sendAuth() {
        socket.emit('auth', socket.user);
    }

    function sendUsers() {
        let users = UserController.getUsers();
        socket.emit('users', users);
    }

    function sendHistory() {
        let history;
        socket.emit('history', history);
    }
};