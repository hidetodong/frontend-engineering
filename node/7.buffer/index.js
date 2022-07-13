// 我们在node中要操作文件
// buffer 代表的就是缓存区域的内容 早期js没有读取文件的能力 前端都是字符串
// 在node中读取的内容都是二进制的
// buffer 有点可以将二进制和字符串相互转化 buffer代表的是内存 内存地址 是一个引用类型
// buffer 开始都是固定大小的

// 声明buffer的三种方式
const buffer = Buffer.from('珠峰')  // node中默认不支持gbk编码 utf8中一个汉字是三个字节

console.log(buffer.toString('utf8'))


const b2  = Buffer.alloc(6)

console.log(b2)

const b3 = Buffer.from([0x64,100,'abc',257])

console.log(b3) 

const b4 = Buffer.from('珠峰')
const b5 = Buffer.from('架构')
const bigBuffer = Buffer.alloc(b4.length + b5.length)


b4.copy()
console.log(bigBuffer)
