# node 是什么 能做什么

node不是一个语言 是一个运行时
js组成部分 ECMAScript BOM DOM
node中只有ECMAScript 还有一些内置模块

# 单线程 多线程
- 多线程 每次请求到来 都需要单独开启一个线程处理 好处 多个请求可以同时处理 适合cpu密集型 （压缩 计算 加密）后面的逻辑不需要前面的处理 多线程的缺陷 浪费内存 采用线程池
多个线程同时操作一个资源 会产生线程锁的概念
- 单线程 第一个请求到来时 主线程处理 第二个需要等待第一个处理完毕 比较适合i/o web引用中


node中主线程是单线程的 但是底层libuv 基于的是多线程模型（eventLoop）
node也支持多进程

异步非阻塞基于事件


## node 未来
- 工具：gulp webpack rollup vite （node实现 学的容易 为前端工程化服务
- 服务端渲染 ssr vue / react seo优化 node天生支持js 所以可以用node来解析 vue和react达到服务端渲染的目的
- bff中间层 用它来做服务器 为前端提供服务端后端 解决跨域问题

## 需要掌握node中的模块机制

- 为什么有模块 命名冲突 方便维护 高内聚低耦合 前端解决模块问题 1.单例模式 2.自执行函数 3.requirejs seajs esModule(import export)
jsonp回调 systemjs

- node中的模块处理 commonjs规范
 - let Promise = require('./promise') // 同步引入
 - 任何一个js文件都是一个模块
 - module.exports = xxx 我想让别人用我自己

## 先掌握一些内置模块

- fs filesystem 操作文件都需要用这个
- path 路径处理
- vm 运行代码
- 

## 取用这些api实现一个commonjs
