'use strict';

import User from '../models/User';
const users = [];
let count = 0;

async function addUser(id, username) {
    const name = await assignName(username);

    const user = new User({
        id  : id,
        name: name
    });
    users.push(user);
    return user;
}

function removeUser(id) {
    users.forEach((user) => {
        if (user.id === id) {
            const index = users.indexOf(user);
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

async function assignName(username) {
    if (username) {
        // check for duplicate
        await users.forEach((user) => {
            if (user.name === username) {
                return assignName(username + 1);
            }
        });
        return username;
    } else {
        return 'User' + ++count;
    }
}


export default {
    addUser   : addUser,
    removeUser: removeUser,
    getUsers  : getUsers,
    updateUser: updateUser
};