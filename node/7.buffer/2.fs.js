
// 文件读取操作 都是二进制数据 fs模块
// file system

// fs.readFileSync 同步性能好 不需要二次通知 但会阻塞主线程
// fs.readFile     异步非阻塞 
// 默认我们在做一些前置工作的时候采用同步
// 在程序运行的时候 采用异步防止阻塞

const fs = require('fs')
const path = require('path')

// 拷贝一个文件
// 写入的特点是 如果文件不存在会创建这个文件 如果文件存在会清空


// 简单的文件读取是ok的 但是文件大的不能这样
// fs.readFile(path.join(__dirname,'package.json'),function(err,data){
//     console.log(data)
//     if(err) return err;
//     fs.writeFile(path.join(__dirname,'packages1.json'),data,function(err,data){
//         console.log(data,'写入的')
//     })
// })

// 如果文件太大需要用到流 

// fs.open() fs.read() fs.write() fs.close() // 可以自己控制读写开关 也有同步的但是主要应用还是异步的

// flags 
// - r 读取 read
// - w 写入 write
// - a 追加 append
function copy() {
    const BUFFER_SIZE = 3
    const buffer = Buffer.alloc(BUFFER_SIZE)
    fs.open(path.resolve(__dirname, 'test.txt'), 'r', function (err, fd) { // file descriptor
        fs.open(path.resolve(__dirname, 'test1'), 'w', function (err, wfd) {
            let readOffset = 0
            let writeOffset = 0
            function next() {
                fs.read(fd, buffer, 0, BUFFER_SIZE, readOffset, function (err, bytesRead) { // bytesRead真正读到的个数
                    if (bytesRead == 0) {
                        console.log('copy complete')
                        fs.close(fd, function () {

                        })

                        fs.close(wfd, function () {

                        })
                        return
                    }
                    fs.write(wfd, buffer, 0, bytesRead, writeOffset, function (err, written) { // 真正写入的个数
                        console.log('written', written)

                        readOffset += written
                        writeOffset += readOffset
                        next()
                    })
                })
            }
            next()
        })
    })
}


// 问题？
// - 回调地狱 
// - 出错没法统一处理
// - 没法暂停
// - 读写不分离
// - 读写打开顺序（不应该有顺序）


// 发布订阅来解除耦合


// 64k以下的可以采用这种方式


