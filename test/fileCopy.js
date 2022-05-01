import fs, { existsSync } from 'fs'
import path from 'path'
import {fileURLToPath} from 'url';

function copyDir(srcDir, desDir) {
  try {
    fs.accessSync(desDir, fs.constants.R_OK | fs.constants.W_OK);
    console.log('can read/write')
  } catch (err) {
    console.error('no access!')
    fs.mkdirSync(desDir)
  }
  fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
    for (const file of files) {
      //判断是否为文件夹
      console.log(file,file.isDirectory(),path.resolve(srcDir, file.name))
      if (file.isDirectory()) {
        const dirS = path.resolve(srcDir, file.name);
        const dirD = path.resolve(desDir, file.name);
        //判断是否存在dirD文件夹
        if (!fs.existsSync(dirD)) {
          fs.mkdir(dirD, (err) => {
            if (err) console.log(err);
          })
        }
        copyDir(dirS, dirD);
      } else {
        const srcFile = path.resolve(srcDir, file.name);
        const desFile = path.resolve(desDir, file.name);
        fs.copyFileSync(srcFile, desFile);
        console.log(file.name + ' 拷贝成功');
      }
    }
  })
}

// const __filename = fileURLToPath(import.meta.url) // 获取文件的绝对路径
// const __dirname = path.dirname(__filename); // 获取文件的绝对路径
// const target = path.resolve(__dirname , '../template')
// console.log(target,'我是哈哈哈')
// copyDir(target,'jj')
fs.mkdir('/Users/mmbang/Desktop/code-standerd-cli/hh',(err)=>{
  console.log(err)
})
// let url = '/Users/a/s'
// let dir = url.split(/\//)
// console.log(dir)
// console.log(existsSync('/'))