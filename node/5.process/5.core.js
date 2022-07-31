 // 文件模块 自己写的模块 查找问题
 // 文件模块的查找机制

//  const r = require('./a')
// 如果有两个文件 ./a.js 和 ./a/index.js 会先找 ./a.js 
// 不同node版本会有一定差异
// 老版本 
// 如果有package.json -> main:'index.js' 以package.json 为准
// 如果./a.js不存在 则回去找a文件夹下的index.js 

// 核心模块 events （fs path vm) 不需要自己写也不用安装的 可以直接用
//
const EventEmitter = require('events') // 内置模块检测时候 会进行检测
// 发布订阅 能解决问题 异步 解决代码耦合的问题
const util = require('util')

function Human (){
    
}

// 让类继承原型方法

// ES6 extends
// Object.create
// Object.setPrototypeOf()
// Human.prototype.__proto__ = EventEmitter.prototype (浏览器不兼容)
 // 第三方模块 

util.inherits(Human,EventEmitter)

let human = new Human 

human.on('t',()=>{
    console.log('1')
})

human.on('t',()=>{
    console.log('2')
})

human.emit('t')

// 几个方法

// once 只触发一次


// 监控到用户绑定了哪些事件
human.on('newListener',()=>{
    console.log(type)
})





 // npm


