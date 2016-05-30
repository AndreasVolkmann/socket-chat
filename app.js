"use strict";
import Koa from 'koa';
import Router from 'koa-router';
import convert from 'koa-convert';
import json from 'koa-json';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import costatic from 'koa-static'



const app = new Koa();
const router = Router();
const io = require('socket.io')();
app.io = io;

const users = require('./routes/users');


// middleware
//if (process.env.FORCE_HTTPS === '1') app.use(enforceHttps());
app.use(convert(bodyparser()));
app.use(convert(json()));
app.use(convert(logger()));
app.use(convert(costatic(__dirname + '/public')));


// logger
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());

// response

app.on('error', function (err, ctx) {
    console.log(err);
    console.error('server error', err, ctx);
});

module.exports = app;