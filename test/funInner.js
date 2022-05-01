const ref = /(?<=\{)([\s\S]*)(?=\}$)/g
function a() {
    console.log(222)
}

const cc = a.toString()
const dd = cc.match(ref)

const ee = ()=>{
    eval(`${dd[0]}`)
    console.log(33)
}
ee()