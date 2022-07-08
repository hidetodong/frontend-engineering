
const fs = require('fs').promises
const path = require('path')


async function read(){
    let name = await fs.readFile(path.resolve(__dirname,'name.txt'),'utf8')
    let age = await fs.readFile(path.resolve(__dirname,name),'utf8')
    return age
}


read().then((res)=>{
    console.log(res)
})