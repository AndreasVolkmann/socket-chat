'use strict';
/**
 *  Socket.io configuration file
 */
import MessageController from '../app/controllers/MessageController';
import Message from '../app/models/Message';
import UserController from '../app/controllers/UserController'

const history = [];

/**
 * @param io - The app's io, which should be an instance of Socket.io
 * @param socket - a client's socket connection, obtained via the on.connect
 */
module.exports = async function (io, socket) {
    let user;


    socket.on('auth', async(username) => {
        console.log('Username: ' + username);
        user = await UserController.addUser(socket.id, username);

        sendAuth(user, socket);
        sendUsers(socket);
        broadcastUser(user, socket);

        const HISTORY = MessageController.getHistory(10);
        socket.emit('history', HISTORY);
    });

    socket.on('post message', (message) => {
        console.log(`${socket.id}: ${message}`);
        const MSG = MessageController.addMessage(message, user.name);
        socket.broadcast.emit('message', MSG);
    });

    socket.on('private message', (message) => {
        console.log(`Private message to ${message.to}`);
        const msg = new Message({
            text  : message.text,
            author: user.name,
            date  : Date.now()
        });
        socket.broadcast.to(message.to).emit('private message', msg);
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