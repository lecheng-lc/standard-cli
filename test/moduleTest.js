// import module from 'module'
import importFresh from "import-fresh";
import fs from 'fs'
import path from 'path'
import { format as prettyFormat } from 'pretty-format'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import prettier from 'prettier'
const __filename = fileURLToPath(import.meta.url) // 获取文件的绝对路径
const __dirname = path.dirname(__filename) // 获取文件的绝对路径
const vueConfiUrl = path.resolve(__dirname, './module.cjs')
try {
  fs.accessSync(vueConfiUrl, fs.constants.R_OK | fs.constants.W_OK);
  console.log('文件ok')
} catch (err) {
  // @TODO 复制创建文件
  // return
}
const configContent = fs.readFileSync(vueConfiUrl, { encoding: 'utf-8' })
const vueDefineReg = /(?<=module.exports\s*=\s*defineConfig\s*\()([\s\S]*\))/g
const vueNormalReg = /(?<=module.exports\s*=\s*)([\s\S]*)/g
let matchContent = ''
if (configContent.match(vueDefineReg)) {
  matchContent = configContent.match(vueDefineReg)[0]
  const lastSymbolIndex = matchContent.lastIndexOf(')')
  matchContent = matchContent.slice(0, lastSymbolIndex)
} else if (configContent.match(vueNormalReg)) {
  matchContent = configContent.match(vueNormalReg)[0]
}
const matchContentObj = eval(`(${matchContent})`)
const configureWebpackFun = typeof matchContentObj.configureWebpack === 'function'
const chainWebpackFun = typeof matchContentObj.chainWebpack === 'function'
const funInnerReg = /(?<=\{)([\s\S]*)(?=\}$)/g
// 对webpackchian做处理
if (configureWebpackFun) {
  const oldConfigFun = matchContentObj.configureWebpack
  const newConfigFun = (config) => {
    config.module.entry = './src/main.ts'
    const innerFun = oldConfigFun.toString().match(funInnerReg)?.[0]
    if (innerFun) {
      eval(`${innerFun}`)
    }
  }
  matchContentObj.configureWebpack = newConfigFun

} else {
  if (!configureWebpackFun) {
    matchContentObj.configureWebpack = {
      entry: {
        app: './src/main.ts'
      }
    }
  } else {
    matchContentObj.configureWebpack = Object.assign(matchContentObj.configureWebpack, {
      entry: {
        app: './src/main.ts'
      }
    })
  }
}
// 对非webpackchian做处理
if (chainWebpackFun) {
  const oldConfigFun = matchContentObj.configureWebpack
  const newConfigFun = (config) => {
    oldConfigFun(config)
    config.module
      .rule('tsx')
      .test(/\.tsx?$/)
      .use('babel')
      .loader('babel-loader')
      .end()
      .use('ts')
      .loader('ts-loader')
      .options({
        appendTsSuffixTo: [/\.vue$/],
        happyPackMode: false,
        transpileOnly: true,
      })
    const innerFun = oldConfigFun.toString().match(funInnerReg)?.[0]
    if (innerFun) {
      eval(`${innerFun}`)
    }
  }
  matchContentObj.configureWebpack = newConfigFun
} else {
  if (!matchContentObj.configureWebpack?.module) {
    matchContentObj.configureWebpack = {
      module: {
        rules: {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader'
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
      }
    }
  }
  else {
    matchContentObj.configureWebpack.module.rules = matchContentObj.configureWebpack.module?.rules ?? []
    matchContentObj.configureWebpack.module.rules = matchContentObj.configureWebpack.module.rules.push(
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader'
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
}

// var toString = Object.prototype.toString;

// function dump_object(obj) {
//     var buff,prop;
//     buff = [];
//     for (prop in obj) {
//         buff.push(dump_to_string("key", prop) + ': ' + dump_to_string("value",obj[prop]))
//     }
//     return '{' + buff.join(',') + '}';
// }

// function dump_array(arr) {
//     var buff,i,len;
//     buff = [];
//     for (i=0,len=arr.length; i<len; i++) {
//         buff.push(dump_to_string('value',arr[i]));
//     }
//     return '[' + buff.join(',') + ']';
// }

// function dump_to_string(type, obj) {
//     if (toString.call(obj) == '[object Function]') {
//         return obj.toString();
//     } else if (toString.call(obj) == '[object Array]') {
//         return dump_array(obj);
//     } else if (toString.call(obj) == '[object String]') {
//       if(type === 'key') {
//         return obj.replace('"','\\"')
//       } 
//       return '"' + obj.replace('"','\\"') + '"';
//     } else if (obj === Object(obj)) {
//         return dump_object(obj);
//     }
//     return obj.toString();
// }
// // console.log(matchContentObj)
// const text = fs.readFileSync(path.resolve(__dirname,'./module.cjs'), "utf8");
// const prettierUrl = path.resolve(__dirname,'../template/prettier/.prettierrc')
// prettier.resolveConfig(prettierUrl).then((options) => {
//   const formatted = prettier.format(text, options);
//   const result = configContent.replace(vueNormalReg,dump_object(matchContentObj)+')')
//   const resultUrl = path.resolve(__dirname, './cc.js')
//   fs.writeFileSync(resultUrl,formatted,)
// })

// fs.writeFileSync(resultUrl,result,'utf-8')
// console.log(cc.configureWebpack.module.rules.length)

