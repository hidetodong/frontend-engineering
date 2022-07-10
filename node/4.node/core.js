// node内置模块不用安装
const fs = require('fs');
const path = require('path');


// vm node 中的虚拟机模块  = new Function()

// node模块化的实现 是读取文件 让读取到的内容 执行

// eval会依赖外层的作用域 不能用做模块化的实现 模块化要求就是互不影响

// let abc = 100

// eval('console.log(abc)')

// 可以包装成一个函数
// let fn = new Function('console.log(abc)') // 创建一个顶级函数 不依赖于上下文的实现

// fn()

const vm = require('vm')

// let fn = vm.compileFunction('console.log(abc)')

// vm.runInThisContext('console.log(abc)') // 用作沙箱

// 内部会自动添加.js 和 .json来查找一遍
let r = require('./a')

console.log(r)

