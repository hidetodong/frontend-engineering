// node 事件环
// 浏览器中事件环和node事件环的区别

// process 进程

// 1.platform 用来区分代码执行是用什么系统的
// - 可能有一种需求 写一个脚手架 需要有配置文件
console.log(process.platform)

// 2.cwd 当前运行目录 运行的时候会找对应的配置文件 在当前目录下找到路径
console.log(process.cwd(), __dirname)

// 3.env 实现一些工具的时候 需要区分环境变量 全局环境 局部环境
// - 通过set语法设置临时的变量
// - - mac exports
// - - win set
// 使用包 cross-env 跨平台设置环境变量
// 通过env属性来控制不同情况下的参数
console.log(process.env)

// 4.argv 用户命令行交互获取用户输入的参数
// - 前两个是默认值 可执行文件node， 执行文件，后面是用户的参数
// - 解析参数 commander
console.log(process.argv)

let args = process.argv.slice(2).reduce((memo, current, index, array) => {
    if (current.startsWith('--')) {
        memo[current.slice(2)] = array[index + 1] ? array[index + 1].startsWith('--') ? true : array[index + 1] : ''
    }

    return memo
}, {})

// 5.nextTick
process.nextTick(()=>{
    console.log('nextTick')
})
