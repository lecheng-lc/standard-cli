import { URL, fileURLToPath } from 'url'
import fs, { writeFileSync } from 'fs'
import chalk from 'chalk'
import semver from 'semver'
import path from 'path'
import prettier from 'prettier'
import { customCopyFile } from '../utils/file.js'
import { dumpObject } from '../utils/index.js'
import { PackageManager } from '../utils/packageManager.js'
const CWD = process.cwd()
const packagePath = fileURLToPath(new URL(`${CWD}/package.json`, import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
const proType = packageJson.dependencies.react ? 'react' : packageJson.dependencies.vue ? 'vue' : 'wxMini'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pacMan = new PackageManager()
// function havePretter(options: any) {
//   return options.configuration.includes(CONSTANTS.pre) || fs.existsSync(`${CWD}/.prettier.js`)
// }
function haveEslint() {
  return fs.existsSync(`${CWD}/.eslintrc.js`)
}
export const addPlop = (addType, options) => {
  const plopInfo = {
    plop: '^3.0.5',
  }
  packageJson.devDependencies = Object.assign(packageJson.devDependencies, plopInfo)
  packageJson.scripts = Object.assign(packageJson.scripts, {
    plop: 'plop',
  })
  writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
  const destDir = `${CWD}/plop-template`
  const targetDir = path.resolve(__dirname, `../../template/plop/${proType}`)
  !fs.existsSync(destDir) ? fs.mkdirSync(destDir) : ''
  customCopyFile(targetDir, destDir, ['plopfile.js'])
  fs.copyFileSync(`${targetDir}/plopfile.js`, `${CWD}/plopfile.js`)
  if (addType) {
    pacMan.install()
  }
  return true
}
/**
 * @param addType true->手动添加 false 统一执行
 */
export const addHusky = (addType, options) => {
  const huskyInfo = {
    husky: '^7.0.4',
  }
  packageJson.devDependencies = Object.assign(packageJson.devDependencies, huskyInfo)
  packageJson.scripts = Object.assign(packageJson.scripts, {
    prepare: 'husky install',
  })
  writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
  const destDir = `${CWD}/.husky`
  const targetDir = path.resolve(__dirname, '../../template/husky')
  // eslint-disable-next-line no-unused-expressions
  !fs.existsSync(targetDir) ? fs.mkdirSync(destDir) : ''
  customCopyFile(targetDir, destDir)
  if (addType) {
    pacMan.install()
  }
  return true
}
export const addCmLint = (addType, options) => {
  const commitLintInfo = {
    '@commitlint/cli': '^16.2.3',
    '@commitlint/config-conventional': '^16.2.1',
    'cz-customizable': '^6.3.0',
  }
  packageJson.config = {
    commitizen: {
      path: './node_modules/cz-customizable',
    },
    'cz-customizable': {
      config: '.cz-configrc.js',
    },
  }
  packageJson.devDependencies = Object.assign(packageJson.devDependencies, commitLintInfo)
  writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
  const commitDestDir = `${CWD}/commitlint.config.js`
  const czDestDir = `${CWD}/.cz-configrc.js`
  const commitTargetDir = path.resolve(__dirname, '../../template/commitlint.config.js')
  const czTargetDir = path.resolve(__dirname, '../../template/.cz-configrc.js')
  // eslint-disable-next-line no-unused-expressions
  !fs.existsSync(commitDestDir) ? fs.writeFileSync(commitDestDir, '') : ''
  // eslint-disable-next-line no-unused-expressions
  !fs.existsSync(czDestDir) ? fs.writeFileSync(czDestDir, '') : ''
  customCopyFile(commitTargetDir, commitDestDir)
  customCopyFile(czTargetDir, czDestDir)
  pacMan.global(['commitizen'])
  if (addType) {
    pacMan.install()
  }
  return true
}
export const addEditor = () => {
  const destDir = `${CWD}/.editorconfig`
  const targetDir = path.resolve(__dirname, '../../template/.editorconfig')
  !fs.existsSync(destDir) ? fs.writeFileSync(destDir, '') : ''
  customCopyFile(targetDir, destDir)
  return false
}
export const addPretter = (addType, options) => {
  const destDir = CWD
  const targetDir = path.resolve(__dirname, '../../template/prettier')
  packageJson.scripts = Object.assign(packageJson.scripts, {
    preFix: 'prettier --write ./',
  })
  packageJson.devDependencies = Object.assign(packageJson.devDependencies, {
    prettier: '^2.6.0',
  })
  if (haveEslint()) {
    console.log(chalk.yellow('👀  已有eslint,请记得添加eslint-config-prettier插件'))
  }
  writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
  customCopyFile(targetDir, destDir)
  if (addType) {
    pacMan.install()
  }
  return true
}
/**
 * @description 1.是否有pretter.js  2.含有pre配置，  目的使用eslint-config-pretter
 * @param options
 * @returns
 * @todo 文件存在地方好几个，这里只做了部分判断
 */
export const addEslint = async (addType, options) => {
  const destDir = CWD
  // const havePre = havePretter(options) && packageJson.prettier
  // 小程序上添加eslint 会默认添加上prettier
  if (proType === 'wxMini') {
    const eslintInfo = {
      eslint: '^7.32.0',
      'eslint-config-prettier': '^8.5.0',
      'eslint-config-standard': '^16.0.3',
      'eslint-plugin-import': '^2.25.4',
      'eslint-plugin-node': '^11.1.0',
      'eslint-plugin-prettier': '^4.0.0',
      'eslint-plugin-promise': '^5.2.0',
    }
    // @TODO  针对pretter做判断
    // let eslintContent = ''
    // if(havePre) {
    //   const prettier = 'prettier'
    //   eslintContent =  await ejs.renderFile('./common.css', {content: prettier})
    // }
    packageJson.scripts = Object.assign(packageJson.scripts, {
      esFix: 'eslint ./ --fix',
    })
    packageJson.devDependencies = Object.assign(packageJson.devDependencies, eslintInfo)
    writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
    const targetDir = path.resolve(__dirname, '../../template/eslint/wxMini')
    customCopyFile(targetDir, destDir) // 复制文件夹
    addPretter(addType, options)
    if (addType) {
      pacMan.install()
    }
  } else {
    console.log(chalk.yellow('👆 已经添加有eslint无用重复添加'))
  }
  return true
  // @description 通过脚手架配置vue和react默认都会开启eslint
}
export const addTS = (addType, options) => {
  const destDir = CWD
  if (proType === 'wxMini') {
    const eslintInfo = {
      typescript: '^4.6.2',
    }
    packageJson.devDependencies = Object.assign(packageJson.devDependencies, eslintInfo)
    writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
    const targetDir = path.resolve(__dirname, '../../template/eslint/wxMini')
    customCopyFile(targetDir, destDir)
    if (addType) {
      pacMan.install()
    }
  }
  if (proType === 'vue') {
    let PLOP_TARGET_TEMPLATE_DIR = ''
    const isVue3 = semver.gt(semver.valid(semver.coerce(packageJson.dependencies.vue)), '3.0.0')
    let tsInfo = {
      'ts-loader': '^9.2.8',
      '@types/webpack-env': '^1.16.4',
      '@vue/eslint-config-typescript': '^10.0.0',
    }
    if (isVue3) {
      PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../../template/typescript/vue/v3')
      tsInfo = Object.assign({}, tsInfo)
    } else {
      PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../../template/typescript/vue/v2')
      tsInfo = Object.assign({}, tsInfo, {
        'vue-class-component': '^7.2.6',
        'vue-property-decorator': '^9.1.2',
      })
    }
    packageJson.devDependencies = Object.assign(packageJson.devDependencies, tsInfo)
    writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
    const haveTsConfig = fs.existsSync(path.resolve(destDir, './tsconfig.json'))
    const vueConfiUrl = `${CWD}/vue.config.js`
    if (haveTsConfig) {
      console.log(chalk.blue('❎ 已配置有tsconfig.json配置'))
    } else {
      customCopyFile(PLOP_TARGET_TEMPLATE_DIR, destDir, ['vue.config.js']) // 复制文件夹
      const haveVueConfig = fs.existsSync(vueConfiUrl)
      if (haveVueConfig) {
        const configContent = fs.readFileSync(vueConfiUrl, { encoding: 'utf-8' })
        const vueDefineReg = /(?<=module.exports\s*=\s*defineConfig\s*\()([\s\S]*\))/g
        const vueNormalReg = /(?<=module.exports\s*=\s*)([\s\S]*)/g
        let matchContent = ''
        let indeedVueReg = new RegExp('')
        let hasVueDefined = false
        if (configContent.match(vueDefineReg)) {
          matchContent = configContent.match(vueDefineReg)[0]
          const lastSymbolIndex = matchContent.lastIndexOf(')')
          matchContent = matchContent.slice(0, lastSymbolIndex)
          indeedVueReg = vueDefineReg
          hasVueDefined = true
        } else if (configContent.match(vueNormalReg)) {
          matchContent = configContent.match(vueNormalReg)[0]
          indeedVueReg = vueNormalReg
        }
        // eslint-disable-next-line
        const matchContentObj = eval(`(${matchContent})`)
        const configureWebpackFun = typeof matchContentObj.configureWebpack === 'function'
        // const chainWebpackFun = typeof matchContentObj.chainWebpack === 'function'
        const funInnerReg = /(?<=\{)([\s\S]*)(?=\}$)/g
        // 对webpackchian做处理
        if (configureWebpackFun) {
          const oldConfigFun = matchContentObj.configureWebpack
          const innerFun = oldConfigFun.toString().match(funInnerReg)?.[0]
          /* eslint-disable */
          const newConfigFun = new Function(
            'config',
            `${innerFun};
            // config.module.entry = './src/main.ts';
            config.module.rules.push(
              {
                test: /\.tsx?$/,
                use:[
                  {
                    loader:'babel-loader'
                  },
                  {
                    loader: 'ts-loader',
                    options: {
                      appendTsSuffixTo: [/\.vue$/],
                      happyPackMode: false,
                      transpileOnly: true,
                    }
                  },
                ]
              }
            )
          `
          )
          /* eslint-disable */
          matchContentObj.configureWebpack = newConfigFun
        } else {
          if (!configureWebpackFun) {
            matchContentObj.configureWebpack = (config) => {
              // config.entry.app = './src/main.ts'
              config.module.rules.push({
                test: /\.tsx?$/,
                use: [
                  {
                    loader: 'babel-loader',
                  },
                  {
                    loader: 'ts-loader',
                    options: {
                      appendTsSuffixTo: [/\.vue$/],
                      happyPackMode: false,
                      transpileOnly: true,
                    },
                  },
                ],
              })
            }
          } else {
            matchContentObj.configureWebpack.module?.rules?.push({
              test: /\.tsx?$/,
              use: [
                {
                  loader: 'babel-loader',
                },
                {
                  loader: 'ts-loader',
                  options: {
                    appendTsSuffixTo: [/\.vue$/],
                    happyPackMode: false,
                    transpileOnly: true,
                  },
                },
              ],
            })
            matchContentObj.configureWebpack = Object.assign(matchContentObj.configureWebpack, {
              entry: {
                app: './src/main.ts',
              },
            })
          }
        }
        // @TODO  只对一种场景处理即可实现效果，可以不做webpackchian
        // if (chainWebpackFun) {
        //   const oldConfigFun = matchContentObj.configureWebpack
        //   const innerFun = oldConfigFun.toString().match(funInnerReg)?.[0]
        //   const newConfigFun = new Function('config', `
        //     config.module
        //       .rule('tsx')
        //       .test(/\.tsx?$/)
        //       .use('babel')
        //       .loader('babel-loader')
        //       .end()
        //       .use('ts')
        //       .loader('ts-loader')
        //       .options({
        //         appendTsSuffixTo: [/\.vue$/],
        //         happyPackMode: false,
        //         transpileOnly: true,
        //       });
        //     ${innerFun}
        //   `)
        //   matchContentObj.chainWebpack = newConfigFun
        // } else {
        //   if (!matchContentObj.chainWebpack?.module) {
        //     console.log('进到这个里面')
        //     matchContentObj.chainWebpack = {
        //       module: {
        //         rules: {
        //           test: /\.tsx?$/,
        //           use: [
        //             {
        //               loader: 'babel-loader'
        //             },
        //             {
        //               loader: 'ts-loader',
        //               options: {
        //                 appendTsSuffixTo: [/\.vue$/],
        //                 happyPackMode: false,
        //                 transpileOnly: true,
        //               }
        //             },
        //           ]
        //         }
        //       }
        //     }
        //   }
        //   else {
        //     matchContentObj.chainWebpack.module.rules = matchContentObj.chainWebpack.module?.rules ?? []
        //     console.log()
        //     matchContentObj.chainWebpack.module.rules = matchContentObj.chainWebpack.module.rules.push(
        //       {
        //         test: /\.tsx?$/,
        //         use: [
        //           {
        //             loader: 'babel-loader'
        //           },
        //           {
        //             loader: 'ts-loader',
        //             options: {
        //               appendTsSuffixTo: [/\.vue$/],
        //               happyPackMode: false,
        //               transpileOnly: true,
        //             }
        //           },
        //         ]
        //       }
        //     )
        //   }
        // }
        const prettierUrl = path.resolve(__dirname, '../../template/prettier/.prettierrc')
        prettier.resolveConfig(prettierUrl).then((options) => {
          const replaceContent = configContent.replace(indeedVueReg, hasVueDefined ? `${dumpObject(matchContentObj)})` : dumpObject(matchContentObj))
          const formatContent = prettier.format(replaceContent, options)
          fs.writeFileSync(vueConfiUrl, formatContent)
        })
      } else {
        customCopyFile(`${PLOP_TARGET_TEMPLATE_DIR}/vue.config.js`, vueConfiUrl)
      }
      if (addType) {
        pacMan.install()
      }
    }
  }
  return true
}
export default {
  addPlop,
  addCmLint,
  addEditor,
  addPretter,
  addEslint,
  addTS,
  addHusky,
}
