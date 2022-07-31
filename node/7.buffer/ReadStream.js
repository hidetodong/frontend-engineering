const fs = require('fs')
const EventEmitter = require('events')
class ReadStream extends EventEmitter {
    constructor(path, options = {}) {
        super()
        this.isPause = false
        this.path = path
        this.flags = options.flags || 'r'
        this.encoding = options.encoding || null;
        this.emitClose = options.emitClose || false;
        this.start = options.start || 0
        this.end = options.end || 0
        this.highWaterMark = options.highWaterMark || 64 * 1024
        // 默认打开
        this.open()

        // 看用户有没有绑定事件
        this.on('newListener', function (type) {
            if (type === 'data') {
                console.log('用户监听了data')
                this.read()
            }
        })
        this.offset = this.start
    }

    read() {
        // 如何保证文件打开了才去读取
        if (typeof this.fd !== 'number') {
            // 如果还没有开启 就注册一个执行一次的回调 等 到开启的时候就是执行读取
            return this.once('open', () => this.read())
        }

        const readMax = this.end ? Math.min((this.end - this.offset + 1),this.highWaterMark)  : this.highWaterMark

        let buffer = Buffer.alloc(readMax)
        fs.read(this.fd,buffer,0,buffer.length,this.offset,(err,bytesRead)=>{
            if(bytesRead){
                // console.log('buffer.toString()',buffer.toString())
                this.emit('data',buffer.slice(0,bytesRead))
                this.offset += bytesRead;
                if(!this.isPause){
                    this.read()
                }
            }else{
                this.emit('end')
                this.destroy()
            }
        })

    }

    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) return this.destroy(err)
            this.fd = fd
            this.emit('open', fd)
        })
    }

    destroy(err) {
        if (err) {
            this.emit('error', err)
        }

        if(this.fd){
            fs.close(this.fd,()=>{
                if(this.emitClose){
                    this.emit('close')
                }
            })
        }
    }

    pause(){
        this.isPause = true
    }

    resume(){
        if(this.isPause) this.isPause = false
        this.read()
    }
}

module.exports = ReadStream