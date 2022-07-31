// 我们在node中要操作文件
// buffer 代表的就是缓存区域的内容 早期js没有读取文件的能力 前端都是字符串
// 在node中读取的内容都是二进制的
// buffer 有点可以将二进制和字符串相互转化 buffer代表的是内存 内存地址 是一个引用类型
// buffer 开始都是固定大小的

// 声明buffer的三种方式
const buffer = Buffer.from('珠峰')  // node中默认不支持gbk编码 utf8中一个汉字是三个字节

console.log(buffer.toString('utf8'))

const b2 = Buffer.alloc(6)

console.log(b2)

const b3 = Buffer.from([0x64, 100, 'abc', 257])

console.log(b3)

Buffer.prototype.copy = function (target, targetStart, sourceStart = 0, sourceEnd = this.length) {
    for (let i = 0; i < sourceEnd - sourceStart; i++) {
        target[targetStart + i] = this[sourceStart + i]
    }
}


const b4 = Buffer.from('珠峰')
const b5 = Buffer.from('架构')
const bigBuffer = Buffer.alloc(b4.length + b5.length)

b4.copy(bigBuffer, 0, 0, 6)
b5.copy(bigBuffer, 6, 0, 6)

let b7 = Buffer.from([1, 2, 3, 4, 5, 6])

let b8 = b7.slice(0, 1)

b8[0] = 1

console.log(b7)
Buffer.concat = function (list, totalLength = list.reduce((memo, current) => memo += current.length, 0)) {
    console.log(list,totalLength)
    const bigBuffer = Buffer.alloc(totalLength)
    let pos = 0
    list.forEach((buf)=>{
        buf.copy(bigBuffer,pos)
        pos += buf.length
    })
    return bigBuffer
}

const b = Buffer.concat([b4, b5]) // 这个方法经常用

Buffer.prototype.split = function(sep){
    let arr = []
    sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep)

    let len = sep.length
    let offset = 0
    while(-1 !==  this.indexOf(sep,offset)){
        arr.push(this.slice(offset,idx))
        offset = idx + len
    }
    arr.push(this.slice(offset))
    return arr
}

// 如果自己分析数据 行读取器 每读取一行就打印一下 遇到关键字就处理
let buf = Buffer.from('---ssf---ffas---sdfas');
let idx = buf.split('---')
console.log('idx',idx)

// 常用方法
// Buffer.from
// Buffer.copy
// Buffer.slice  事先声明了100字节 但是只有10个有效 可以截取出来
// Buffer.alloc
// Buffer.concat
// Buffer.isBuffer 可以判断是不是Buffer类型 统一将数据处理成buffer



