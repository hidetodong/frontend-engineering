import { isObject } from "@vue/shared";
import  { ReactiveFlags,baseHandler } from "./baseHandler";

const reactiveMap = new WeakMap();// key必须是对象，弱引用
// v8的垃圾回收机制  标记删除  引用计数

export function reactive(target){
    if(!isObject(target)){
        return target
    }
    // es6 中的proxy 
    if(target[ReactiveFlags.IS_REACTIVE]){
        return target
    }
    const existing = reactiveMap.get(target);
    if(existing){
        return existing
    }
    const proxy = new Proxy(target,baseHandler);
    reactiveMap.set(target,proxy)
    return proxy;
}


// 一个对象已经被代理过了 ，就不要再次被代理了
// 使用proxy 要搭配Reflect来使用  obj -> proxy
// 下次你传入的是proxy了，我去这个对象上取值可以命中proxy的get方法

/*
let person = {
    name:'zf',
    get aliasName(){ // 属性访问器
        return this.name + 'jg'
    }
}
// proxy 一般搭配Reflect来食欲
const proxy = new Proxy(person,{
    get(target,key,receiver){
        console.log('这里可以记录这个属性使用了哪个effect')
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        console.log('这里可以通知effect重新执行')
        return Reflect.set(target,key,value,receiver);
    }
});
// 原因是因为我去proxy上取aliasName,这个时候回执行get方法
// 但是aliasName 是基于name属性 原则上应该去name上取值
// 然而this.name 并没有触发proxy的get，也就意味着稍后我们修改name属性的时候
// 就不会导致页面重新渲染
proxy.aliasName
*/