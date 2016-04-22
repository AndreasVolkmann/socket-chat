'use strict';

const User = require('../models/User');
const users = [];
let count = 0;

function addUser(id) {
    let user = new User({
        id: id,
        name: 'User' + ++count
    });
    users.push(user);

    return user;
}

function removeUser(id) {
    users.forEach((user) => {
        if (user.id === id) {
            let index = users.indexOf(user);
            users.splice(index, 1);
        }
    });
    return users;
}

function getUsers() {
    return users;
}

async function updateUser(update) {
    return new Promise((resolve, reject) => {
        users.forEach((user) => {
            if (user.id === update.id) {
                user.name = update.name;
                user.ct = Date.now();
                resolve(user);
            }
        });
    });
}



module.exports = {
    addUser: addUser,
    removeUser: removeUser,
    getUsers: getUsers,
    updateUser: updateUser
};