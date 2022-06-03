import { isObject } from '@vue/shared'
import {track,trigger} from './effect'
import { reactive } from './reactive'
// v8垃圾回收
export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive"
}

export function isReactive (value) {
    return value && value[ReactiveFlags.IS_REACTIVE]
}

export const baseHandler = {
    get(target,key,receiver){
        if(key === ReactiveFlags.IS_REACTIVE) {
            return true
        }

        track(target,key)
        
        let res = Reflect.get(target,key,receiver)

        if(isObject(res)){
            return reactive(res)
        }

        return res
    },
    set(target,key,value,receiver){
        let oldValue = target[key]
        let result = true
        if(oldValue !== value){
            result = Reflect.set(target,key,value,receiver)
            trigger(target,key,value)
            return result
        }

    }
}