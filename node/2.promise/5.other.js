/*
 * @Author: hidetodong
 * @Date: 2022-07-03 16:17:01
 * @LastEditTime: 2022-07-03 16:43:46
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /node/2.promise/5.other.js
 * HIDETOXIC - 版权所有
 */
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
const { setTimeout } = require('timers');

const Promise = require('./promise');

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


let readFile = promisify(fs.readFile)


// 1) catch的实现
readFile(path.resolve(__dirname,'../1.base/a.txt'),{encoding:'utf8'})
    .then(data=>{
        readFile(data,'utf8')
    })
    .catch(err=>{
        console.log(err)
    })

// 2) Promise.resolve Promise.reject

// 1.resolve一个promise 会等待执行完毕
// 2.reject 一个promise 会直接失败 不在解析了

Promise.reject(new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(100)
    },1000)
})).then(data=>{
    console.log('成功的promise',data)
})

// 3) Promise.all Promise.race

Promise.all = function (values) {
    let results = []
    let count = 0
    return new Promise((resolve,reject)=>{ // 并发是循环 串行是递归

        function processData(i,data){
            results[i] = data
            if(++count === values.length){
                resolve(results)
            }
        }
        
        for(let i = 0;i<values.length;i++){
            let cur = values[i]
            Promise.resolve(cur).then(data=>{
                processData(i,data)
            },reject)
        }
    })
}

Promise.all([
    readFile(path.resolve(__dirname,'../1.base/a.txt'),{encoding:'utf8'}),
    readFile(path.resolve(__dirname,'../1.base/b.txt'),{encoding:'utf8'})
]).then(res=>{
    console.log(res)
})
