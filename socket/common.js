'use strict';
/**
 *  Socket.io configuration file
 */
import MessageController from '../app/controllers/MessageController';
import Message from '../app/models/Message';

let count = 0;

/**
 * @param io - The app's io, which should be an instance of Socket.io
 * @param socket - a client's socket connection, obtained via the on.connect
 */
module.exports = async function (io, socket) {

    socket.on('auth', async(username) => {
        console.log('Username: ' + username);

        socket.username = await assignName(username);

        sendAuth();
        sendUsers();
        broadcastUser();
        sendRooms();

        const HISTORY = MessageController.getHistory(10);
        socket.emit('history', HISTORY);
    });

    socket.on('post message', (message) => {
        console.log(`${socket.id}: ${message}`);
        const MSG = MessageController.addMessage(message, socket.username);
        socket.broadcast.emit('message', MSG);
    });

    socket.on('private message', (message) => {
        console.log(`Private message to ${message.to}`);
        const msg = new Message({
            text  : message.text,
            author: socket.username,
            date  : Date.now()
        });
        socket.broadcast.to(message.to).emit('private message', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        io.emit('user disconnect', getUser());
    });

    socket.on('username', async(username) => {
        updateUser(username);
        socket.broadcast.emit('user update', getUser());
    });

    function sendUsers() {
        console.log('Sending users ...');
        const CLIENTS = getClients();
        console.log(CLIENTS);
        socket.emit('users', CLIENTS);
    }

    function sendAuth() {
        console.log('Sending auth ...');
        socket.emit('auth', getUser());
    }

    function broadcastUser() {
        console.log('Broadcasting user ...');
        socket.broadcast.emit('user', getUser());
    }

    async function sendRooms() {
        console.log('Sending rooms ...');
        const ROOMS = io.sockets.adapter.rooms;
        const MAP = Object.keys(ROOMS).map((name) => {
            return {
                room  : name,
                length: ROOMS[name].length
            }
        });
        let count = 0;
        for (let index in MAP) {
            let room = MAP[index];
            getClients().some((client) => {
                if (room.room === client.id) {
                    MAP.splice(index, 1);
                    count++;
                    return true;
                }
            });
        }
        MAP.push({
            room  : 'Main',
            length: count
        });
        socket.emit('rooms', MAP);
    }

    async function assignName(username) {
        if (username) {
            // check for duplicate
            await getClients().forEach((client) => { // TODO add users room
                if (client.username === username) {
                    return assignName(username + 1);
                }
            });
            return username;
        } else {
            return 'User' + ++count;
        }
    }

    function getClients(namespace) {
        const CLIENTS = [];
        const NS = io.of('/');
        if (NS) {
            for (var id in NS.connected) {
                const CLIENT = getUser(NS.connected[id]);
                CLIENTS.push(CLIENT);
            }
        }
        return CLIENTS;
    }

    function getUser(user) {
        const ID = user ? user.id : socket.id;
        const USERNAME = user ? user.username : socket.username;
        return {
            id      : ID,
            username: USERNAME
        }
    }


    function updateUser(newname) {
        socket.username = newname;
        socket.ut = Date.now();
    }
};

