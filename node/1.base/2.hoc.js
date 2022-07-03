/*
 * @Author: hidetodong
 * @Date: 2022-07-03 09:47:02
 * @LastEditTime: 2022-07-03 10:07:07
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /node/2.hoc.js
 * HIDETOXIC - 版权所有
 */

// 函数参数预置，将函数参数进行保留 （闭包）
// 闭包就是函数定义的作用域和执行的作用域不是同一个，就会产生闭包

// 闭包用途
// 1. 函数柯里化
// 2. 偏函数

// 判断类型4种方法
// typeof 可以判断基本类型 但是不能判断null 因为typeof null = object
// instanceof 判断某个类型是否是谁的实例
// Object.prototype.toString 需要在对象的原型中再找到方法，所以一般用起来会做一层包装
// constructor [].constructor = Array {}.constructor = Object 递归拷贝可能用的到

// function isType(typing,value){
//     return Object.prototype.toString.call(value) === `[object ${typing}]`
// }
function isType(typing) {
  return function (value) {
    return Object.prototype.toString.call(value) === `[object ${typing}]`;
  };
}

let utils = {};

["Number", "String", "Boolean"].forEach((type) => {
  utils[`is${type}`] = isType(type);
});

// 预置参数
console.log(utils.isNumber(9));


// 高阶函数作用
// 1.拓展功能
// 2.可以对函数的参数进行预置