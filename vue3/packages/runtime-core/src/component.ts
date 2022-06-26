/*
 * @Author: hidetodong
 * @Date: 2022-06-12 18:24:34
 * @LastEditTime: 2022-06-26 13:43:45
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /vue3/packages/runtime-core/src/component.ts
 * HIDETOXIC - 版权所有
 */

import { hasOwn, isFunction } from "@vue/shared"
import { reactive } from "@vue/reactivity"

export function createComponentInstance(vnode){
    let instance = {
        data:null,// 组件本身的数据
        vnode,// 标识实例对应的虚拟节点
        subTree:null,// 组件对应的渲染的虚拟节点
        isMounted:false,// 组件是否挂载过
        update:null,// 组件的effect.run方法
        render:null,
        propsOptions:vnode.type.props || {},
        props:{}, // 这个props代表用户接收的属性
        attrs:{} // 没有接收
    }

    // vnode.props 组建创建虚拟节点的时候提供的
    // vnode.type.props 用户写的props

    return instance
}

const publicProperties = {
    $attrs:(instance)=> instance.attrs
}

const instanceProxy = {
    get(target,key,receiver){
        const { data,props } = target

        if(data && hasOwn(data,key)){
            return data[key]
        }else if(props && hasOwn(props,key)){
            return props[key]
        }
        let getter = publicProperties[key];
        return getter(target)
    },
    set(target,key,value,receiver){
        const { data,props } = target

        if(data && hasOwn(data,key)){
             data[key] = value
        }else if(props && hasOwn(props,key)){
            console.warn("Props can't be update")
            return false
        }

        return true
    }
}

function initProps(instance,rawProps){
    const props = {};
    const attrs = {};

    const options = instance.propsOptions
    if(rawProps){
        for(let key in rawProps){
            const value = rawProps[key] // 拿到对应的值


            // 应该校验值的类型是否符合要求
            if(key in options){
                props[key] = value
            }else{
                attrs[key] = value
            }
        }
    }
    // 稍后更新props应该可以达到重新渲染的效果
    instance.props = reactive(props) // 这里方便调试 但是内部用的是浅响应 shallowReactive
    instance.attrs = attrs
}

export function setupComponent(instance){
    let { type,props,children } = instance.vnode
    let { data } = type

    initProps(instance,props)

    instance.proxy = new Proxy(instance,instanceProxy)

    if(data){
        if(isFunction(data)){
            return console.log('This data option must be a function')
        }
        instance.data = reactive(data.call({},));
    }

    instance.render = type.render
}