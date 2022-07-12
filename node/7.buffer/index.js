console.log('global.Buffer',global.Buffer)

// Buffer中因为要大量操作文件 所以就自己弄一个buffer 代表的就是内存
// 最早的时候 浏览器是不支持文件读取的，但是node中需要操作文件 所以需要一个类型
// Buffer优点是可以和字符串相互转化