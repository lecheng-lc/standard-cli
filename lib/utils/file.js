import fs, { existsSync, mkdirSync, accessSync, appendFile } from 'fs'
import path from 'path'
import chalk from 'chalk'
const Log = console.log
export function writeFileBy(filePath, desDir) {
  try {
    accessSync(desDir, fs.constants.R_OK | fs.constants.W_OK)
    console.log('can read/write')
  } catch (err) {
    console.error('no access!')
    mkdirSync(desDir)
  }
  if (existsSync(filePath)) {
    console.log('该路径已存在')
  } else {
    console.log('该路径不存在')
    fsMkdir(filePath)
  }
  appendFile(filePath, '', 'utf8', function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('appendFile 成功了')
    }
  })
}
/**
 * @description 创建目录
 * @param filePath 文件夹路径
 */
export function fsMkdir(filePath) {
  const arr = filePath.split('/')
  let dir = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (!existsSync(dir)) {
      mkdirSync(dir)
    }
    dir = dir + '/' + arr[i]
  }
}
/**
 * @description 复制文件夹
 * @param srcDir
 * @param desDir
 */
export function customCopyFile(srcDir, desDir, exclude) {
  try {
    fs.accessSync(srcDir, fs.constants.R_OK | fs.constants.W_OK)
  } catch (err) {
    Log(chalk.bold.red('目标文件夹不存在'))
  }
  const stats = fs.statSync(srcDir)
  if (stats.isFile()) {
    return fs.copyFileSync(srcDir, desDir)
  }
  fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
    for (const file of files) {
      if (file.isDirectory()) {
        const dirS = path.resolve(srcDir, file.name)
        const dirD = path.resolve(desDir, file.name)
        if (!fs.existsSync(dirD)) {
          fs.mkdir(dirD, (err) => {
            if (err) console.log(err)
          })
        }
        customCopyFile(dirS, dirD, exclude)
      } else if (!exclude?.includes(file.name)) {
        const srcFile = path.resolve(srcDir, file.name)
        const desFile = path.resolve(desDir, file.name)
        fs.copyFileSync(srcFile, desFile)
      }
    }
  })
}
