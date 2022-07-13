const http = require('http')
const path = require('path')
const fs = require('fs').promises
const url = require('url')
const os = require('os')

// - console变色
const chalk = require('chalk')

class Server {
    constructor(options = {}){
        this.port = options.port
        this.directory = options.directory
        this.start()
    }

    handleRequest = (req,res) => { // 处理客户端的请求 和 响应客户端

    }

    start(){
        const server = http.createServer(this.handleRequest)
        server.listen(this.port,()=>{
            console.log(`
            http://192.168.117:${chalk.green(this.port)}
            http://127.0.0.1:${chalk.green(this.port)}
            `)
        })
    }
}

module.exports = function createServer(userConfig){ 
    // 对userConfig进行二次处理
    return new Server(userConfig)
}