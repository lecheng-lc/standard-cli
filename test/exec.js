// exec同步执行一个shell命令

// let { exec } = require('child_process')

// let path = require('path')

// // 用于使用shell执行命令, 同步方法

// let p1 = exec('node exec.js a b c', {cwd: path.join(dirname, 'childs')}, function(err, stdout, stderr) {

//  console.log(stdout)

// })


// import {execaSync,execa,execaCommand} from 'execa';
// import { CWD } from '../common/constant.js';

// const child = execa('yarn', ['global','add', 'axios'], {
//     stdio: ['inherit', 'inherit', 'pipe']
//   })
//   child.stderr.on()
//   console.log(child)

import { execa ,execaSync} from "execa";
// const child =  execa("node", ["./test/exec2.js", 'hhhh']);
// child.stdout.on('data',buffer=>{
//     let str = buffer.toString().trim()
//     console.log('nishishui', str,'wokankan')
// })

import * as fs from "fs";
const subprocess = execa("echo", ["is it me you're looking for?"]);
subprocess.stdout.pipe(fs.createWriteStream("stdout.txt"));