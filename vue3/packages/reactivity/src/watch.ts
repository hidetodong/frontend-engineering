import { ReactiveEffect } from "./effect";
import { isReactive } from "./baseHandler";
import { isFunction ,isObject} from "@vue/shared";

function traversal(value,set = new Set()) { // set 用来存放迭代过的对象
    // 递归

    if(!isObject(value)) {
        return value;// 终止条件
    }
    if(set.has(value)) {
        return value
    }
    set.add(value);// 此对象已经被迭代过了
    for(let key in value) {
        traversal(value[key],set)
    }

    return value;
}

export function watch(source,cb){
    let get 
    if(isReactive(source)){
        // 创建一个effect 让这个effect收集source中所有属性

        get = ()=> traversal(source)
        
    }else if (isFunction(source)){
        get = source
    }

    let oldValue
    let cleanup;
    const onCleanup =(fn)=>{  
        cleanup = fn
    }
    const job = ()=>{
        if(cleanup) cleanup(); // 如果cleanup有值 则是上一次赋予的
        // 数据变化后重新调用effect.run函数，会获取最新的值
        let newValue = effect.run()
        cb(newValue,oldValue,onCleanup)
    }

    const effect = new ReactiveEffect(get,job)
    // 默认调用run方法会执行get函数，此时source作为了第一次的老值
    oldValue = effect.run()
}