/*
 * @Author: hidetodong
 * @Date: 2022-07-03 11:04:17
 * @LastEditTime: 2022-07-03 14:07:41
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /node/2.promise/1.js
 * HIDETOXIC - 版权所有
 */

// promise 是干什么的 解决什么问题
// 1) 回调地狱 嵌套逻辑不好处理
// 2) 错误处理无法统一 需要处理公共的错误逻辑
// 3) 尽量简化回调 多个异步并发的问题 Promise.all Promise.finally

const Promise = require('./promise');

const fs = require('fs')
const path = require('path')

const promise = new Promise((resolve, reject) => {

    setTimeout(()=>{
        resolve('ok')
    },1000)
})


promise.then((data)=>{
    console.log(data,'success')
},(reason)=>{
    console.log(reason,'fail')
})