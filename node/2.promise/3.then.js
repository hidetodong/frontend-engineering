/*
 * @Author: hidetodong
 * @Date: 2022-07-03 14:06:43
 * @LastEditTime: 2022-07-03 15:31:24
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /node/2.promise/3.then.js
 * HIDETOXIC - 版权所有
 */

const fs = require("fs");
const path = require("path");
const Promise1 = require("./promise");

const { promisify } = require("util");

let promise = new Promise1((resolve, reject) => {
  setTimeout(() => {
    resolve(100);
  }, 1000);
});

let promise2 = promise.then((data) => {
  return new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve("ok")
    }, 1000);
  })
});

promise2.then(
  (data2) => {
    console.log(data2, "scucces");
  },
  (err) => {
    console.log(err, "d");
  }
);

// 为了解决then的状态可以切换 所以每次调用then后都要返回一个新的promise

// // 1) then 链式调用
// // 当then中成功和失败的回调函数返回的是一个promise 内部会解析这个promise
// // 并且将结果传递到下一个then中
// // 2) 下一次then成功还是失败 取决于当前promise的状态
// readFileAsync(path.resolve(__dirname,'../1.base/a.txt'),{encoding:'utf8'})
//     .then(res=>{
//         console.log(res)
//     })

// // 让一个promise then 变成失败有两种方式 一个是抛出异常 返回一个失败的promise
