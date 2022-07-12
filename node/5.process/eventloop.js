
// 5.nextTick
process.nextTick(() => {
    console.log('nextTick') // 微任务
})
console.log('abc')
Promise.resolve().then(() => {
    console.log('promise')
})

setImmediate(() => {
    console.log('setImmediate')
})

setTimeout(() => {
    console.log('setTimeout')
})

// 这些方法 nextTick setImmediate 开发中用的不对 面试的时候会考察node中的事件环

// 输出结果
// abc 
// nextTick
// promise
// setTimeout
// setImmediate

// 同步代码先执行 执行过程中会产生异步逻辑
// 同步代码执行完毕之后立即执行process.nextTick(node官网描述这个不属于事件环的一部分)
// 在浏览器中 宏任务队列全局只有一个
// 在node中 宏任务也进行了分类（node中是自己实现的事件环libuv）
// *号是开发中比较有关的

// - （nextTick）
// - timers            存放所有定时器任务 *
// - pending callbacks 上次循环没有执行完毕的
// - idle prepare      node内部执行队列
// - poll              处理I/O回调的，在循环的过程中会在此阶段阻塞 * 会看timer 是否有到时间的回调 适当阻塞 会重新到timer阶段
// - check             setImmediate *
// - close callbacks   socket.end() 关闭回调  

// 我们关心的node中的事件环有三个队列 timers poll check
// 代码走到poll阶段会检测check中是否有回调么，
// 如果没有就在poll队列中等待 检测是否有新的i/o进来
// 或者是否有定时器到达时间 有的话回去
// 如果check中有队列 则向下执行 再回到poll中


// v8引擎 负责解析 js语法的 而且可以调用node中的api
// libuv 负责执行node api的 执行完毕后 底层是一个多线程模型
// 会开启一个单独的事件线程来处理事件
// libuv 决定调用的任务是同步还是异步的

// 微任务： 微任务在每次宏任务执行完毕一个后会清空微任务
// node中的eventLoop和浏览器中执行的结果是一致的
// node v10以前版本有一点差异  早期一个队列清空完毕才会清空微任务


// 如果在主栈中调用了timer和setImmediate执行顺序会受性能影响
// 可能在进入循环的时候 定时器没有到时间 则直接进入到check阶段


// 当把setImmediate和setTimeout 放在一起用的时候 不一定谁快谁慢

// 但有一种情况
fs.readFile('./work.md',()=>{ // poll阶段完成的
    setTimeout(()=>{
        console.log('setTimeOut')
    },0)

    setImmediate(()=>{  // poll -> check -> timers 所以setImmediate一定比setTimeout快
        console.log('setImmediate')
    })
})



