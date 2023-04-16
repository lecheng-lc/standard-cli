import inquirer from 'inquirer';
import * as CONSTANTS from '../common/constant.js';
import execute from '../execute/index.js';
import { PackageManager } from '../utils/packageManager.js';
const pacMan = new PackageManager();
const mapAdd = [
    {
        name: CONSTANTS.esLint,
        fn: execute.addEslint,
    },
    {
        name: CONSTANTS.husky,
        fn: execute.addHusky,
    },
    {
        name: CONSTANTS.ts,
        fn: execute.addTS,
    },
    {
        name: CONSTANTS.pre,
        fn: execute.addPretter,
    },
    {
        name: CONSTANTS.commitLint,
        fn: execute.addCmLint,
    },
    {
        name: CONSTANTS.editor,
        fn: execute.addEditor,
    },
    {
        name: CONSTANTS.plop,
        fn: execute.addPlop,
    },
];
function dealFileLogic(options) {
    let excuteFileConfigs = [];
    let needInstall = [];
    for (let i = 0; i < mapAdd.length; i++) {
        for (let j = 0; j < options.configuration.length; j++) {
            if (options.configuration[j] === mapAdd[i].name) {
                excuteFileConfigs.push(mapAdd[i]);
            }
        }
    }
    excuteFileConfigs.forEach((element) => {
        needInstall.push(element.fn(false, options));
    });
    let isNeed = needInstall.some((item) => !!item);
    isNeed && pacMan.install();
}
async function promptIndex() {
    const options = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'configuration',
            message: '⭐️ Select constraint type',
            pageSize: 10,
            choices: [
                {
                    value: CONSTANTS.esLint,
                    name: 'eslint',
                },
                {
                    value: CONSTANTS.ts,
                    name: 'typescript',
                },
                {
                    value: CONSTANTS.editor,
                    name: 'editorconfig',
                },
                {
                    value: CONSTANTS.pre,
                    name: 'prettier',
                },
                {
                    value: CONSTANTS.husky,
                    name: 'husky',
                },
                // {
                //   value: CONSTANTS.lintStaged,
                //   name: 'lint-staged'
                // },
                {
                    value: CONSTANTS.commitLint,
                    name: 'commitLint',
                },
                {
                    value: CONSTANTS.plop,
                    name: 'plop',
                },
            ],
        },
    ]);
    dealFileLogic(options);
}
async function promptSingleConfig(type) {
    const options = {
        configuration: [type],
    };
    dealFileLogic(options);
}
export { promptIndex, promptSingleConfig };
