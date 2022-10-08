/*
 * @Author: hidetodong
 * @Date: 2022-08-07 12:24:17
 * @LastEditTime: 2022-08-07 13:34:33
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /mobx-source/src/mobx/utils.jsx
 * HIDETOXIC - 版权所有
 */
export const $mobx = Symbol('mobx administration')

export function isObject(v){
    return v !== null && typeof v === 'object'
}

let mobxGuid = 0;
export function getNextId(){
    return ++mobxGuid
}


export function addHiddenProp(obj,propName,value){
    Object.defineProperty(obj,propName,{
        value,
        enumerable:false,
        writable:true,
        configurable:false
    })
}


export function getAdm(target){
    return target[$mobx]
}

export const globalState = {
    pendingReactions:[],
    trackingDerivation:null
}

