/*
 * @Author: hidetodong
 * @Date: 2022-07-03 10:07:36
 * @LastEditTime: 2022-07-03 10:24:34
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /node/3.async.js
 * HIDETOXIC - 版权所有
 */

// 使用高阶函数解决异步问题

const fs = require('fs') // 文件系统模块
const path = require('path') // 路径模块

// function cb(key,value){
//     obj[key] = value
//     if(Reflect.ownKeys(obj).length === 2){
//         console.log(obj)
//     }
// }

let cb = after(2,(data)=>{
    console.log(data)
})

function after(times,cb){
    let obj = {}
    return function (key,value){
        obj[key] = value
        if(--times === 0){
            cb(obj)
        }
    }
}

fs.readFile(path.resolve(__dirname,'a.txt'),{encoding: 'utf8'},(err,res)=>{

    if(err) return

    cb('a',res)
})


fs.readFile(path.resolve(__dirname,'b.txt'),{encoding: 'utf8'},(err,res)=>{

    if(err) return


    cb('b',res)
})
// 前端并发ajax 需要等待多个异步请求都完成后将结果拿到
