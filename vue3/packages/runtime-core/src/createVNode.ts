import { isArray, isString } from "@vue/shared"

export function createVNode(type,props = null,children = null){

    // 后续判断有不同类型的虚拟节点
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0 // 标记自己是什么类型
 
    const vnode = {  // vnode要对应真实的节点
        type,
        props,
        children,
        key:props && props.key,
        el:null,
        shapeFlag
    }

    if(children){
        let temp = 0

        if(isArray(children)){ // createVNode的一定是数组或者字符串 h中会做处理
            temp = ShapeFlags.ARRAY_CHILDREN
        }else{
            children = String(children)
        }

        vnode.shapeFlag |= shapeFlag
    }

    // prop | text | string

    // shapeFlags 判断虚拟节点的儿子是数组还是元素还是文本
    console.log(vnode)
    return vnode
}

/** 权限组合 */
export const enum ShapeFlags { // vue3提供的形状标识
    ELEMENT = 1,
    FUNCTIONAL_COMPONENT = 1 << 1,
    STATEFUL_COMPONENT = 1 << 2,
    TEXT_CHILDREN = 1 << 3,
    ARRAY_CHILDREN = 1 << 4,
    SLOTS_CHILDREN = 1 << 5,
    TELEPORT = 1 << 6,
    SUSPENSE = 1 << 7,
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
    COMPONENT_KEPT_ALIVE = 1 << 9,
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}