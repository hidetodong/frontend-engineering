/*
 * @Author: hidetodong
 * @Date: 2022-07-03 14:06:43
 * @LastEditTime: 2022-07-03 14:41:11
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /node/2.promise/2.js
 * HIDETOXIC - 版权所有
 */

const fs = require('fs');
const path = require('path');

const { promisify} = require('util')


/** 
function promisify(fn){
    return function (...args){
        let promise = new Promise((resolve,reject)=>{ // 可以将node中的异步api转换成promise的形式
            fn(...args,function(err,data){
                if(err) return reject(err)
                resolve(data)
            })
        })
        return promise
    }  
}
*/

let readFileAsync = promisify(fs.readFile)




// 1) then 链式调用 
// 当then中成功和失败的回调函数返回的是一个promise 内部会解析这个promise 
// 并且将结果传递到下一个then中
// 2) 下一次then成功还是失败 取决于当前promise的状态
readFileAsync(path.resolve(__dirname,'../1.base/a.txt'),{encoding:'utf8'})
    .then(res=>{
        console.log(res)
    })

// 让一个promise then 变成失败有两种方式 一个是抛出异常 返回一个失败的promise


