import path from 'path'
import fs from 'fs'
import {fileURLToPath} from 'url'
import prettier from 'prettier'
const __filename = fileURLToPath(import.meta.url) // 获取文件的绝对路径
const __dirname = path.dirname(__filename) // 获取文件的绝对路径
const prettierUrl = path.resolve(__dirname,'../template/prettier/.prettierrc')
const text = fs.readFileSync(path.resolve(__dirname,'./module.cjs'), "utf8");
prettier.resolveConfig(prettierUrl).then((options) => {
  const formatted = prettier.format(text, options);
  console.log(options)
  fs.writeFileSync(path.resolve(__dirname,'./pred.js'), formatted)
});