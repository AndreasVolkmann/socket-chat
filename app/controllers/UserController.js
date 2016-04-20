'use strict';

const users = {};
let count = 0;

function addUser(id) {
    users.id = 'User' + ++count;
    return users.id;
}



module.exports = {
    addUser: addUser
};