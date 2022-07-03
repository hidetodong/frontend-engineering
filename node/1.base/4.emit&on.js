/*
 * @Author: hidetodong
 * @Date: 2022-07-03 10:39:10
 * @LastEditTime: 2022-07-03 10:45:28
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /node/4.emit&on.js
 * HIDETOXIC - 版权所有
 */
const fs = require('fs') // 文件系统模块
const path = require('path') // 路径模块

// 发布订阅

let events = {
    _obj:{},
    _arr:[],
    on(callback){
        this._arr.push(callback)
    },
    emit(key,value){
        this._obj[key] = value;
        this._arr.forEach(cb=>{
            cb && cb(this._obj)
        })
    }
}

events.on(()=>{
    console.log('读取完毕')
})

events.on((data)=>{
    console.log('读取完毕')
    if(Reflect.ownKeys(data).length === 2){
        console.log('数据全部读取完毕')
    }
})





fs.readFile(path.resolve(__dirname,'a.txt'),{encoding: 'utf8'},(err,res)=>{
    events.emit('msg',res)
})


fs.readFile(path.resolve(__dirname,'b.txt'),{encoding: 'utf8'},(err,res)=>{
    events.emit('age',res)
})


// 通过发布订阅来解耦