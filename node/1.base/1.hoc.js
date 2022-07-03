/*
 * @Author: hidetodong
 * @Date: 2022-07-03 09:35:01
 * @LastEditTime: 2022-07-03 09:44:46
 * @LastEditors: hidetodong
 * @Description: HOC
 * @FilePath: /node/1.hoc.js
 * HIDETOXIC - 版权所有
 */


// 什么是高阶函数 
// 1) 一个函数返回一个函数，那么这个函数就是高阶函数
// 2) 一个函数的参数是一个函数 他也是高阶函数

// 1.可以通过包装一个函数，对现有的逻辑进行扩展

function core(a,b,c){
    console.log('核心代码',a,b,c);   
}

core.before = function(cb){
    return (...args)=>{
        cb()
        this(...args)
    }
}

let newCore = core.before(function(){
    console.log('before');
})

newCore(1,2,3); // 对原来的方法进行扩展