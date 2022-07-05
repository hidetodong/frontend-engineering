
// 泛型可以声明多个
// 交换元组 ts是拥有类型推导的 但是推导的结果和预期可能不一样

function swap<T,P>(tuple:[T,P]):[P,T]{ // 多个泛型 
    return [tuple[1],tuple[0]]
}


// 泛型 
// 函数重载 已知确定类型和对应的返回值
// 泛型 不知道具体类型 只有使用的时候才知道
let arr = swap([1,'a'])


// 泛型约束 传入数字 你给实现数字的相加 传入字符串就实现字符串相加

function sum<T extends string>(a:T,b:T){
    return a + b
}

type keys = keyof any

// 内置泛型 

// 1.条件为主的

interface Bird{
    kind:'bird'// 可辨识的接口类型

}

interface Fish{
    kind:'fish'
}


interface Sky{
    color:'blue'
}

interface Water{
    color:'trans'
}

// extends放在左边是约束
// extends放在右边类似于 if
type FindType<T extends Bird | Fish> = T extends Bird ? Sky : Water;

// 条件类型具备类型分发的功能
// 条件的分发 需要是裸类型的（不受其他类型控制） type FindType<T extends Bird | Fish> = [T] extends [Bird] ? Sky : Water;
// 被包了一层就不行了
type IEnv = FindType<Bird | Fish> // 这样传会把类型一个一个传入然后判断，再把类型联合在一起

// ts中内置的类型 
// Exclude 一堆类型中排除某种 
// Extract 一堆类型中获取某个
// 非空类型
type Exclude<T,U> = T extends U ? never : T
type MyExcludeType = Exclude<string | number | boolean,boolean | number>;

type Extract<T,U> = T extends U ? never : U
type MyExtractType = Extract<string|number|boolean,number>


//非空类型 非空断言

let element = document.getElementById('app')

type NonNullable<T> = T extends null | undefined ? never : T 
type MyNonNull = NonNullable<typeof element>

// 2. 循环为主的
type Size = "mini" | "large"
type Type = "primary" | "success"
interface IButtonProps {
    size:Size
    type:Type,
    a:{
        b:string
    }
}

interface IEvents{
    click:(eventName:string)=> void
}
type Compute<T> = { [K in keyof T]:T[K] } 

type ButtonType = Compute<IButtonProps & IEvents>

// type Traverse<T> = T extends Object ? Readonly<T> : T

type Readonly<T> = {
    readonly [K in keyof T]:T[K] extends Object ? Readonly<T[K]> : T[K]
} 

type Partial<T> = { [K in keyof T]?:T[K] } 


type ReadOnlyButtonTypes = Readonly<ButtonType> // + readonly

type PartialReadonly = Partial<ReadOnlyButtonTypes> // + partial

type RequiredButton = Required<PartialReadonly> // - partial











export default {} 