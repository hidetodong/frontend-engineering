import { isFunction } from "@vue/shared";
import { activeEffect, ReactiveEffect, track, trackEffects } from "./effect";

export function computed(getterOrOptions,){
    let isGetter =  isFunction(getterOrOptions)
    let getter;
    let setter;
    const fn = ()=>{ console.warn('computed is readonly')}

    if(isGetter){
        getter = getterOrOptions
        setter = fn
    }else{
        getter = getterOrOptions.get;
        setter = getterOrOptions.set || fn
    }

    return new ComputedRefImpl(getter,setter)

}

class ComputedRefImpl {
    private _value
    private _dirty = true
    private effect;
    public deps;
    constructor(public getter,public setter){
        // 拿到effect实例 让函数执行
       this.effect =  new ReactiveEffect(getter,()=>{
           if(!this._dirty){
               this._dirty = true
           }
       })
    }

    get value(){ // 取值的时候进行依赖收集
        if(activeEffect){
            trackEffects(this.deps || (this.deps = new Set));
        }
        if(this._dirty){ // 如果是脏值, 执行函数
            this._dirty = false;
            this._value = this.effect.run(); 
        }
        return this._value; 
    }

    set value(newValue){
        this.setter(newValue)
    }
}