const name: string = "ss";

// ts安装后 内置了很多全局类型
// 解决冲突就用模块化
// 人为的h

// string 和 String区别
// 基本类型。  实例

// 元组
let tuple: [string, number] = ["abc", 1231];

tuple.push("s");

// 枚举
// 1）普通枚举
enum STATUS_CODE {
  NOT_FOUND = 404,
  NOT_ALLOWED = 405,
  ERROR = 400,
}

// 2) 异构枚举
const enum STATUS_CODE_2 {
  NOT_FOUND = 404,
  NOT_ALLOWED = "405",
}

// 8) void
// 9) never 特殊类型 never是任何类型的子类型 可以赋给其他类型  但是其他类型不能赋给他
function whileTrue(): never {
  while (true) {}
}
// never 用途
// 1） 完整性保护
// 方形圆形矩形
// ts语法 声明一个类型 字面量类型
type ISquare =  { width: number,kind: "square" }
type IRect = { width: number; height: number,kind: "rectangle" }
type ICircle = | { r: number,kind:"circle" };

function getArea(obj: ISquare|IRect|ICircle) {
    if(obj.kind === 'square'){
        return obj.width * obj.width
    }

    if(obj.kind === 'rectangle'){
        return obj.width * obj.height
    }

    if(obj.kind === 'circle'){
        return obj.r * obj.r
    }

    validate(obj)
}

function validate(obj:never){

}

function reactive(obj:object){

}

reactive(function(){
    
})



export {};