let express = require('express')

let app = express()
app.use(express.static(__dirname))
app.get('/clock',(req,res) => {
    res.send(new Date().toLocaleString())
})
app.listen(8888);

let WebSocketServer = require('ws').Server

let server = new WebSocketServer({
    port:8888
})

server.on('connection',function(socket){
    console.log('连接成功',socket)
    socket.on('message',(message)=>{
        console.log('message',message)
        socket.send('服务器说:',message)
    })
})
