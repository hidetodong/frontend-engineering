
// 1. Module._load() 加载模块
// 2. Module._resolveFileName 处理路径为绝对路径 并且添加文件后缀
// 3. 拿到文件 看一下是否加载过 加载过直接返回缓存
// 4. 如果没有缓存过 则会new Module(id,exports = {}) exports 是对应模块的导出结果 默认为空
// 5. 将创建的模块缓存
// 6. 根据文件加载模块 给 module.exports 赋值
// 7. 找到对应的文件后缀 做加载操作 Module._extension[.js](this,filename); 策略模式
// 8. 读取文件内容fs.readFileSync(filename,'utf8')
// 9. 将字符串执行 module._compile编译字符串
// 10. 包裹函数 'exports' 'require' 'module' '__filename' '__dirname'   
//. module.exports = exports
//. this = exports
// 11. Reflect.apply(this,[exports,require,module,filename,path.dirname])
// 最终返回 module.exports

const fs = require('fs')
const path = require('path')
const vm = require("vm")

function Module(id) {
    this.id = id 
    this.exports = {}
}

Module.prototype.load = function(){
    let ext = path.extname(this.id)
    Module._extensions[ext](this)
}
Module._extensions = {}

Module._extensions['.js'] = function (module) {
    const content = fs.readFileSync(module.id,'utf8')

    let fn = vm.compileFunction(content,[
        'exports','require','module','__filename','__dirname'
    ])

    let exports = module.exports

    let thisValue = exports

    let dirname = path.dirname(module.id)
    // 函数执行的时候会自动给module.exports赋值

    Reflect.apply(fn,thisValue,[exports,req,module,module.id,dirname])// 如果用户没有写module.exports 那么值依然为空

    console.log(fn.toString())
}

Module._extensions['.json'] = function (module) {
    const content = fs.readFileSync(module.id,'utf8')

    // json是直接将结果赋予module.exports
    module.exports = JSON.parse(content)
}

Module._resolveFilename = function(id){
    const filePath = path.resolve(id)
    if(fs.existsSync(filePath)) return filePath;

    let exts = Reflect.ownKeys(Module._extensions)

    for(let i=0;i<exts.length;i++){
        debugger
        let newFilePath = filePath + exts[i]
        if(fs.existsSync(newFilePath)) return newFilePath;
    }

    throw new Error('Cannot found module')
}

function req(id) {
    // 解析文件的绝对路径 添加后缀
    let filename = Module._resolveFilename(id)
    
    let module = new Module(filename)

    module.load();// 加载文件 给module.exports 赋值

    return module.exports
}

const r = req('./a.json')

console.log(r)