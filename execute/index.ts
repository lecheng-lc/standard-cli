import { URL, fileURLToPath } from 'url'
import fs, { writeFileSync } from 'fs'
import chalk from 'chalk'
import semver from 'semver'
import path from 'path'
import prettier from 'prettier'
import { customCopyFile } from '../utils/file.js'
import { dumpObject } from '../utils/index.js'
import inquirer from 'inquirer'
import * as CONSTANTS  from '../common/constant.js'
import { PackageManager } from '../utils/packageManager.js'
// import ejs from 'ejs'
const CWD = process.cwd() // 返回当前进程的工作目录
const packagePath = fileURLToPath(new URL(`${CWD}/package.json`, import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
const proType = packageJson.dependencies.react ? 'react' : packageJson.dependencies.vue ? 'vue' : 'wxMini'
const __filename = fileURLToPath(import.meta.url) // 获取文件的绝对路径
const __dirname = path.dirname(__filename) // 获取文件的绝对路径
const pacMan = new PackageManager()
export const addPlop = (addType:boolean,options:any) => {
  const plopInfo = {
    "plop": "^3.0.5",
  }
  packageJson.devDependencies = Object.assign(packageJson.devDependencies, plopInfo)
  packageJson.scripts = Object.assign(packageJson.scripts, {
    "plop": "plop"
  })
  writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
  const PLOP_DEST_TEMPLATE_DIR = `${CWD}/plop-template`
  const PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, `../template/plop/${proType}`)
  !fs.existsSync(PLOP_DEST_TEMPLATE_DIR) ? fs.mkdirSync(PLOP_DEST_TEMPLATE_DIR) : '' // 创建目录
  customCopyFile(PLOP_TARGET_TEMPLATE_DIR, PLOP_DEST_TEMPLATE_DIR, ['plopfile.js']) // 复制文件夹
  fs.copyFileSync(`${PLOP_TARGET_TEMPLATE_DIR}/plopfile.js`, `${CWD}/plopfile.js`) // 复制文件到根目录
  if(addType) {
    pacMan.install()
  }
}
/**
 * 
 * @param addType true->手动添加 false 统一执行
 */
export const addHusky = (addType:boolean,options:any) => {
  const huskyInfo = {
    "husky": '^7.0.4'
  }
  packageJson.devDependencies = Object.assign(packageJson.devDependencies, huskyInfo)
  packageJson.scripts = Object.assign(packageJson.scripts, {
    "prepare": "husky install"
  })
  writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
  const PLOP_DEST_TEMPLATE_DIR = `${CWD}/.husky`
  const PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../template/husky')
  !fs.existsSync(PLOP_DEST_TEMPLATE_DIR) ? fs.mkdirSync(PLOP_DEST_TEMPLATE_DIR) : '' // 创建目录
  customCopyFile(PLOP_TARGET_TEMPLATE_DIR, PLOP_DEST_TEMPLATE_DIR) // 复制文件夹
  if(addType) {
    pacMan.install()
  }
}

export const addCmLint = (addType:boolean,options:any) => {
  const commitLintInfo = {
    "@commitlint/cli": "^16.2.3",
    "@commitlint/config-conventional": "^16.2.1",
    "cz-customizable": "^6.3.0",
  }
  packageJson.config = {
    "commitizen": {
      "path": "./node_modules/cz-customizable"
    },
    "cz-customizable": {
      "config": ".cz-configrc.js"
    }
  }
  packageJson.devDependencies = Object.assign(packageJson.devDependencies, commitLintInfo)
  writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
  const COMMIT_DEST_TEMPLATE_FILE = `${CWD}/commitlint.config.js`
  const CZ_DEST_TEMPLATE_FILE = `${CWD}/.cz-configrc.js`
  const COMMIT_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../template/commitlint.config.js')
  const CZ_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../template/.cz-configrc.js')
  !fs.existsSync(COMMIT_DEST_TEMPLATE_FILE) ? fs.writeFileSync(COMMIT_DEST_TEMPLATE_FILE, '') : '' // 创建目录
  !fs.existsSync(CZ_DEST_TEMPLATE_FILE) ? fs.writeFileSync(CZ_DEST_TEMPLATE_FILE, '') : '' // 创建目录
  customCopyFile(COMMIT_TARGET_TEMPLATE_DIR, COMMIT_DEST_TEMPLATE_FILE) // 复制文件夹
  customCopyFile(CZ_TARGET_TEMPLATE_DIR, CZ_DEST_TEMPLATE_FILE) // 复制.cz-configrc.js文件夹
  pacMan.global(['commitizen'])
  if(addType) {
    pacMan.install()
  }
}

export const addEditor = (addType:boolean,options:any) => {
  const PLOP_DEST_TEMPLATE_FILE = `${CWD}/.editorconfig`
  const PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../template/.editorconfig')
  !fs.existsSync(PLOP_DEST_TEMPLATE_FILE) ? fs.writeFileSync(PLOP_DEST_TEMPLATE_FILE, '') : '' // 创```建目录
  customCopyFile(PLOP_TARGET_TEMPLATE_DIR, PLOP_DEST_TEMPLATE_FILE) // 复制文件夹
}

export const addPretter = (addType:boolean,options:any) => {
  const PLOP_DEST_TEMPLATE_DIR = CWD
  const PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../template/prettier')
  customCopyFile(PLOP_TARGET_TEMPLATE_DIR, PLOP_DEST_TEMPLATE_DIR) // 复制文件夹
}
/**
 * @description 1.是否有pretter.js  2.含有pre配置，  目的使用eslint-config-pretter
 * @param options 
 * @returns 
 * @todo 文件存在地方好几个，这里只做了部分判断
 */
function havePretter(options:any) {
  return options.configuration.includes(CONSTANTS.pre) || fs.existsSync(`${CWD}/.prettier.js`)
}
export const addEslint = async  (addType:boolean,options:any) => {
    const PLOP_DEST_TEMPLATE_DIR = CWD  
    // const havePre = havePretter(options)
    if (proType === 'wxMini') {
      const eslintInfo = {
        "eslint": "^7.32.0",
        "eslint-config-prettier": "^8.5.0",
        "eslint-config-standard": "^16.0.3",
        "eslint-plugin-import": "^2.25.4",
        "eslint-plugin-node": "^11.1.0",
        "eslint-plugin-prettier": "^4.0.0",
        "eslint-plugin-promise": "^5.2.0",
        "prettier": "^2.6.0"
      }
       // @TODO  针对pretter做判断
      // let eslintContent = ''
      // if(havePre) {
      //   const prettier = 'prettier'
      //   eslintContent =  await ejs.renderFile('./common.css', {content: prettier})
      // }
      packageJson.devDependencies = Object.assign(packageJson.devDependencies, eslintInfo)
      writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
      const PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../template/eslint/wxMini')
      customCopyFile(PLOP_TARGET_TEMPLATE_DIR, PLOP_DEST_TEMPLATE_DIR) // 复制文件夹
      if(addType) {
        pacMan.install()
      }
    }
}

export const addTS = (addType:boolean,options:any) => {
  const PLOP_DEST_TEMPLATE_DIR = CWD
  const buildConfig = () => {
    if (proType === 'wxMini') {
      const eslintInfo = {
        "typescript": "^4.6.2"
      }
      packageJson.devDependencies = Object.assign(packageJson.devDependencies, eslintInfo)
      writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
      const PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../template/eslint/wxMini')
      customCopyFile(PLOP_TARGET_TEMPLATE_DIR, PLOP_DEST_TEMPLATE_DIR) // 复制文件夹
      if(addType) {
        pacMan.install()
      }
    }
    if (proType === 'vue') {
      let PLOP_TARGET_TEMPLATE_DIR = ''
      const isVue3 =  semver.gt(semver.valid(semver.coerce(packageJson.dependencies.vue))!, '3.0.0') 
      let tsInfo:{[index:string]:string} = {
        "ts-loader": "^9.2.8",
        "@types/webpack-env": "^1.16.4",
        "@vue/eslint-config-typescript": "^10.0.0"
      }
      if(isVue3) {
        PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../template/typescript/vue/v3')
        tsInfo = Object.assign({},tsInfo)
      } else {
        PLOP_TARGET_TEMPLATE_DIR = path.resolve(__dirname, '../template/typescript/vue/v2')
        tsInfo = Object.assign({}, tsInfo, {
          "vue-class-component": "^7.2.6",
          "vue-property-decorator": "^9.1.2"
        })
      }
      packageJson.devDependencies = Object.assign(packageJson.devDependencies, tsInfo)
      writeFileSync(`${CWD}/package.json`, JSON.stringify(packageJson, null, 2))
      const haveTsConfig = fs.existsSync(path.resolve(PLOP_DEST_TEMPLATE_DIR, './tsconfig.json'))
      const vueConfiUrl = `${CWD}/vue.config.js`
      if (haveTsConfig) {
        console.log(chalk.blue('❎ 已配置有tsconfig.json配置'))
      } else {
        customCopyFile(PLOP_TARGET_TEMPLATE_DIR, PLOP_DEST_TEMPLATE_DIR, ['vue.config.js']) // 复制文件夹
        const haveVueConfig = fs.existsSync(vueConfiUrl)
        if (haveVueConfig) {
          const configContent = fs.readFileSync(vueConfiUrl, { encoding: 'utf-8' })
          const vueDefineReg = /(?<=module.exports\s*=\s*defineConfig\s*\()([\s\S]*\))/g
          const vueNormalReg = /(?<=module.exports\s*=\s*)([\s\S]*)/g
          let matchContent = ''
          let indeedVueReg = new RegExp('')
          let hasVueDefined:boolean =  false
          if (configContent.match(vueDefineReg)) {
            matchContent = (configContent as any).match(vueDefineReg)[0]
            const lastSymbolIndex = matchContent.lastIndexOf(')')
            matchContent = matchContent.slice(0, lastSymbolIndex)
            indeedVueReg = vueDefineReg
            hasVueDefined = true
          } else if (configContent.match(vueNormalReg)) {
            matchContent = (configContent as any).match(vueNormalReg)[0]
            indeedVueReg = vueNormalReg
          }
          const matchContentObj = eval(`(${matchContent})`)
          const configureWebpackFun = typeof matchContentObj.configureWebpack === 'function'
          // const chainWebpackFun = typeof matchContentObj.chainWebpack === 'function'
          const funInnerReg = /(?<=\{)([\s\S]*)(?=\}$)/g
          // 对webpackchian做处理
          if (configureWebpackFun) {
            const oldConfigFun = matchContentObj.configureWebpack
            const innerFun = oldConfigFun.toString().match(funInnerReg)?.[0]
            const newConfigFun = new Function('config', `${innerFun};
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
            `);
            matchContentObj.configureWebpack = newConfigFun
          } else {
            if (!configureWebpackFun) {
              matchContentObj.configureWebpack = (config:any) =>{
                //config.entry.app = './src/main.ts'
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
              }
            } else {
              matchContentObj.configureWebpack.module?.rules?.push(
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
              matchContentObj.configureWebpack = Object.assign(matchContentObj.configureWebpack, {
                entry: {
                  app: './src/main.ts'
                }
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
          const prettierUrl = path.resolve(__dirname, '../template/prettier/.prettierrc')
          prettier.resolveConfig(prettierUrl).then((options: any) => {
            const replaceContent = configContent.replace(indeedVueReg, hasVueDefined ? `${dumpObject(matchContentObj)})` : dumpObject(matchContentObj))
            const formatContent = prettier.format(replaceContent, options)
            fs.writeFileSync(vueConfiUrl, formatContent)
          })
        } else {
          customCopyFile(`${PLOP_TARGET_TEMPLATE_DIR}/vue.config.js`, vueConfiUrl)
        }
        if(addType) {
          pacMan.install()
        }
      }
    }
  }
  buildConfig()
}
export default {
  addPlop,
  addCmLint,
  addEditor,
  addPretter,
  addEslint,
  addTS,
  addHusky
}


