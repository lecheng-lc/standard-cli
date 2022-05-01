import fs from 'fs'
import path from 'path'
import { basename, dirname } from 'path';
// const dirCache={};
// writeFileByUser('./data/17/1017.md');

// function writeFileByUser(filePath){
//     if (fs.existsSync(filePath)) {
//         console.log('该路径已存在');
//     }else{
//         console.log('该路径不存在');
//         mkdir(filePath);
//     }

//     var data = '\n hello world';  
//     fs.appendFile(filePath,data,'utf8',function(err){  
//         if(err)  {  
//             console.log(err);  
//         } else {
//             console.log('appendFile 成功了')
//         }
//     })
// }

// function mkdir(filePath) {
//     const arr=filePath.split('/');
//     console.log()
//     let dir=arr[0];
//     for(let i=1;i<arr.length;i++){
//         if(!dirCache[dir]&&!fs.existsSync(dir)){
//             dirCache[dir]=true;
//             console.log(dir,'我在创建dir')
//             fs.mkdirSync(dir);
//         }
//         dir=dir+'/'+arr[i];
//     }
//     fs.writeFileSync(filePath, '')
// }
console.log(__filename)
const PLOP_DEST_TEMPLATE_DIR = 'plop-template/page'
const PLOP_TARGET_TEMPLATE_DIR = 'template/plop'
// const isTemplateExit = fs.access(PLOP_TARGET_TEMPLATE_DIR,(err)=>{
//   console.log(err)
// })

fs.readdir(PLOP_TARGET_TEMPLATE_DIR, (err,files)=>{
  files.forEach(fileItem=>{
    // const fileItem
    const fileParh = path.resolve(path.dirname(''),fileItem)
    console.log(fileParh)
    // fs.copyFileSync(fileParh, ')
  })
})
// console.log(isTemplateExit)
