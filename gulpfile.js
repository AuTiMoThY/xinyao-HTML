// ES Module import 語句
import browserSyncPackage from 'browser-sync';
const sync = browserSyncPackage.create();

import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;

import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);
import sassGlob from 'gulp-sass-glob';
import sassVars from 'gulp-sass-vars';
// import rename from 'gulp-rename';
// import cleanCss from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import plumber from 'gulp-plumber';
// import nunjucks from 'nunjucks';
import nunjucksRender from 'gulp-nunjucks-render';
import prettier from 'gulp-prettier';

// 如果 gulp.config.js 是一個 CommonJS 模塊，則需要將其轉換為 ES 模塊，
// 或者使用動態 import() 函數加載它，這裡假設它已經是 ES 模塊或已被轉換。
import config from './gulp.config.js';

// 自定義 Nunjucks 環境
function manageEnvironment(environment) {
    environment.opts.tags = {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '[[',
        variableEnd: ']]',
        commentStart: '<#',
        commentEnd: '#>'
    };
}

function generateCSS() {
    return src(`${config.entryPath.sass}/**/*.scss`)
        .pipe(plumber(function (err) {
            console.log('SASS Compile Error:', err.message);
            this.emit('end');
        }))
        .pipe(sassVars(config.sassVar, { verbose: true }))
        .pipe(sassGlob())
        .pipe(sourcemaps.init())
        .pipe(sass(config.sassOpt))
        // .pipe(sass.sync().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(config.outputPath.sass))
        .pipe(sync.stream())
        .on('end', () => {
            console.log('=================================');
            console.log(`generate CSS OK!`);
            console.log('=================================');
            // sync.reload();
        });
}

function nunjucksTask() {
    // Gets .html and .nunjucks files in pages
    return src(`${config.entry}/pages/**/*.+(html|nunjucks|njk)`)
        .pipe(plumber(function (err) {
            console.log('nunjucks Error:', err.message);
            this.emit('end');
        }))
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: [`${config.entry}/pages_templates`],
            manageEnv: manageEnvironment,
            data: config.njkOpt
        }))
        .pipe(prettier({
            printWidth: 120,
            tabWidth: 4,
            bracketSameLine: true,
            proseWrap: "preserve"
        }))
        // output files in app folder
        .pipe(dest(config.outputPath.html))
        .on('end', () => {
            console.log('=================================');
            console.log(`generate HTML OK!`);
            console.log('=================================');
            sync.reload();
        });
}

function browserSync() {
    sync.init({
        ui: {
            port: config.port
        },
        server: {
            baseDir: `./dist`
        },
        port: config.port,
    });

    console.log('=================================');
    console.log(config.project + " serving!!");
    console.log('=================================');

    global.isWatching = true;

    watch(config.entryPath.sass, generateCSS);
    watch([`${config.entry}/pages/**/*`, `${config.entry}/pages_templates/**/*`], nunjucksTask);
    watch([`${config.outputPath.js}/**/*`], (cb) => {
        console.log('=================================');
        console.log(`JS files have changed. Reloading...`);
        console.log('=================================');
        sync.reload();
        cb();
    });
}

// 將默認任務導出為 ES 模塊
export default series(browserSync);
