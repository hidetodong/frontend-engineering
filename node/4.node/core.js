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
// let r = require('./a')

// let r = function () {
//     module.exports = a 
//     return module.exports // 内部会对执行的函数包装一个函数来实现模块化
// }
debugger

require('./a')

// 1. Module._load() 加载模块
// 2. Module._resolveFileName 处理路径为绝对路径 并且添加文件后缀
// 3. 拿到文件 看一下是否加载过 加载过直接返回缓存
// 4. 如果没有缓存过 则会new Module(id,exports = {}) exports 是对应模块的导出结果 默认为空
// 5. 将创建的模块缓存
// 6. 根据文件加载模块 给 module.exports 赋值
// 7. 找到对应的文件后缀 做加载操作 Module._extension[.js](this,filename); 策略模式
// 8. 读取文件内容fs.readFileSync(filename,'utf8')
// 9. 将字符串执行 module._compile编译字符串
// 10. 包裹函数 'exports' 'require' 'module' '__filename' '__dirname'   
//. module.exports = exports
//. this = exports
// 11. Reflect.apply(this,[exports,require,module,filename,path.dirname])
// 最终返回 module.exports
console.log(r)

