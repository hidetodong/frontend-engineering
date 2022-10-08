/*
 * @Author: hidetodong
 * @Date: 2022-08-07 12:23:43
 * @LastEditTime: 2022-08-07 13:45:31
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /mobx-source/src/mobx/observableObject.jsx
 * HIDETOXIC - 版权所有
 */

import { getNextId,addHiddenProp,$mobx,getAdm, globalState } from './utils'

function reportObserved(observableValue){
    const trackingDerivation = globalState.trackingDerivation
    if(!trackingDerivation){
        trackingDerivation.observing.push(observableValue)
    }

}

function propagateChanged(observableValue){
    const { observers } = observableValue

    observers.forEach(observer=>{
        observer.runReaction()
    })
}

class ObservableValue {
    constructor(value){
        this.value = value
        this.observers = new Set()
    }
    get(){
        reportObserved(this)
        return this.value
    }

    setNewValue(newValue){
        this.value = newValue
        propagateChanged(this)
    }
}

class ObservableObjectAdministration {
    constructor(target,values,name){
        this.target = target
        this.values = values // 存放属性信息
        this.name = name
    }

    get(key){
        return this.target[key]
    }

    set(key,value){
        if(this.values.has(key)){
            return this.setObservableValue(key,value)
        }
    }

    extend(key,descriptor){
        this.defineObservableProperty(key,descriptor.value)
    }

    getObservableValue(key){
        return this.values.get(key).value
    }

    setObservableValue(key,value){
        const observableValue = this.values.get(key)
        observableValue.setNewValue(value)
        return true
    }

    defineObservableProperty(key,value){
        const descriptor = {
            configurable: true,
            enumerable:true,
            get(){
                return this[$mobx].getObservableValue(key)
            },
            set(){
                return this[$mobx].setObservableValue(key,value)
            }
        }

        Object.defineProperty(this.target,key,descriptor)
        this.values.set(key,new ObservableValue(value))
    }
}


function asObservableObject(target){
    const name = `ObservableObject@${getNextId()}`
    const adm = new ObservableObjectAdministration(target,new Map(),name)

    addHiddenProp(target,$mobx,adm)
}

const objectProxyTraps = {
    get(target,name){
        return getAdm(target).get(name)
    },
    set(target,name,value){
        return getAdm(target).set(name,value)
    }
}

function asDynamicObservableObject(target){
    asObservableObject(target)

    const proxy = new Proxy(target,objectProxyTraps);

    return proxy
}

function extendObservable(proxyObject,properties){
    const descriptors = Object.getOwnPropertyDescriptors(properties)
    const adm = getAdm(proxyObject);
    Reflect.ownKeys(descriptors).forEach((key)=>{
        adm.extend(key,descriptors[key])
    })

    return proxyObject
}

export function object(target){
    const dynamicObservableObject = asDynamicObservableObject({})

    return extendObservable(dynamicObservableObject,target)
}