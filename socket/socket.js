'use strict';


export default {
    register: function (io) {
        io.on('connection', (socket) => {
            console.log(`Socket connected: ${socket.id}`);
            require('./common')(io, socket);
        });
    }
}