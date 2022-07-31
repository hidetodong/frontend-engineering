// 基于“文件”系统的可读流

const fs = require('fs')
const path = require('path')
const ReadStream = require('./ReadStream')


// rwxr-xr-x 
// r - 读。   4
// w - 写。   2
// x - 执行。 1
// 第一组rwx 自己的权限
// 第二组rwx 所在组的权限
// 第三组rwx 别人的权限
// chmod 改变操作权限
// chmod -R 777 最大权限

/**
 * 
 *     
 *  flags?: string | undefined;
    encoding?: BufferEncoding | undefined;
    fd?: number | promises.FileHandle | undefined;
    mode?: number | undefined;
    autoClose?: boolean | undefined;
    emitClose?: boolean | undefined;
    start?: number | undefined;
    highWaterMark?: number | undefined
 */
// let rs = fs.createReadStream(path.resolve(__dirname, 'test.txt'), {
let rs = new ReadStream(path.resolve(__dirname, 'test.txt'), {
    flags:'r', // 默认flags就是r 表示读取操作
    encoding:null,// 默认读出的数据是二进制格式
    mode: 0o666, // 读写模式 操作权限
    emitClose:false, // 读取完毕后是否触发close事件
    start:0,// 开始位置
    // end:3, // 结束为止 （包后 0-3 是4个字节
    highWaterMark: 2 // 每次读取文件字节数 默认64k （64k可能是性能最好的
})

// 文件的可读流才有open事件
rs.on('open',function(fd){
    console.log('文件开启',fd)
})


let arr = []
// 如果用户监听了data 会将数据不停的发射出来
rs.on('data',function(data){
    // rs.pause() // 这个暂停意味着不再触发data事件
    arr.push(data)
    rs.pause()
    console.log('获得数据',data)
})

rs.on('end',function(){
    console.log(Buffer.concat(arr).toString())
    console.log('读取完毕')
})


rs.on('error',function(err){
    console.log('err',err)
})

// 文件的可读流才具备close事件
rs.on('close',function(){
    console.log('文件关闭')
})


setInterval(()=>{
    rs.resume()
},1000)