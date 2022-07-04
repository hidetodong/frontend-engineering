/*
 * @Author: hidetodong
 * @Date: 2022-07-03 15:51:21
 * @LastEditTime: 2022-07-03 15:58:37
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /node/2.promise/4.then.js
 * HIDETOXIC - 版权所有
 */



const Promise = require('./promise');

let promise = new Promise((resolve, reject)=> {
    // resolve('ok')
    reject('ok')

})

let promise2 = promise.then(null,(err)=>{
    console.log('失败11',err)
})

promise2.then((data)=>{
    console.log('陈宫2',data)
},(err)=>{
    console.log('shibai',err)
})