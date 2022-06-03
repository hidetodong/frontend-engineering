import { isObject } from "@vue/shared";
import { trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

export function ref(value){
    return new RefImpl(value)
}

export function toRefs(object){
    let result = {};

    for(let key in object){
        result[key] = toRef(object,key);
    }

    return result
}

export function toRef(object,key){
    return new ObjectRefImpl(object,key)
}

export function toReactive (value) {
    return isObject(value) ? reactive(value):value
}

class ObjectRefImpl{
    constructor(public object,public key){

    }

    get value(){
        return this.object[this.key]
    }

    set value(newValue){
        this.object[this.key] = newValue
    }
}

class RefImpl {
    private _value;
    private dep = new Set()
    constructor(public rawValue) {
        // rawValue 可能是一个对象

        this._value = toReactive(rawValue)
    }

    get value(){
        // 需要取值 需要依赖收集 需要收集对应的依赖
        trackEffects(this.dep || (this.dep = new Set()))
        return this._value
    }

    set value(newValue){
        if(newValue != this.rawValue){
            this._value  = toReactive(newValue)
            this.rawValue = newValue
            triggerEffects(this.dep)
        }
    }

}