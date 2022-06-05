import { isArray, isObject } from "@vue/shared";
import { createVNode } from "vue";
import { isVnode } from "./createVNode";

// h方法是为让用户用的方便，实际上是虚拟节点的产生
// createVNode 还有优化 后续还要优化。比如动态节点

export function h (type,propsOrChildren,children) {
    // h方法 如果参数为两个的情况
    // 1） 元素 属性
    // 2） 元素 儿子
    const l = arguments.length;

    if(l === 2) {
        // 如果propsOrChildren是对象的话 可能是属性
        if(isObject(propsOrChildren) && !isArray(propsOrChildren)){
            // 要么是元素对象 要么是属性
            if(isVnode(propsOrChildren)){ // h(type,元素对象)
                return createVNode(type,null,[propsOrChildren])
            }

            return createVNode(type,propsOrChildren) // h(type,属性)
        }else{
            // 属性 + 儿子的情况
            return createVNode(type,null,propsOrChildren) // h(type,[儿子]) h(type,文本)
        }

    }else if( l===3 && isVnode(children)){ // h(type,属性,儿子)
        // 参数是三个
        children = [children]
    }else if( l > 3){
        children = Array.from(arguments).slice(2) // h(type,属性,儿子数组)
    }

    return createVNode(type,propsOrChildren,children) 
}