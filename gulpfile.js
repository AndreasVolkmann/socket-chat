'use strict';

const gulp = require('gulp');
const argv = require('yargs').argv;
const nodemon = require('gulp-nodemon');


gulp.task('run', () => {

    let current_path = process.cwd();

    require('runkoa')(current_path + '/bin/www');

});