import { readFileSync } from 'fs';

const project = "xinyao";
const packageJson = JSON.parse(readFileSync('./package.json'));
const version = packageJson.version;

const entry = 'src';
const output = 'dist';

// 使用 export default 導出配置物件
export default {
    project: project,
    port: 8081,
    entry: `./${entry}`,
    output: `./${output}`,
    entryPath: {
        sass: `./${entry}/sass`,
    },
    outputPath: {
        html: `./${output}`,
        sass: `./${output}/assets/css`,
        js: `./${output}/assets/js`
    },
    sassOpt: {
        outputStyle: 'expanded',
        includePaths: ['node_modules/']
    },
    sassVar: {
        PROJECT_NAME: project,
        VERSION: version
    },
    njkOpt: {
        PROJECT_NAME: project,
        VERSION: version,
        IMG_PATH: `./assets/images/`,
        CSS_PATH: `./assets/css/`,
        JS_PATH: `./assets/js/`,
    }
};
