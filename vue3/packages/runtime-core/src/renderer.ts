import { isNumber, isString } from "@vue/shared";
import { createVNode, ShapeFlags, Text } from "./createVNode";

export function createRenderer(options) {
  // 用户可以调用此方法 传入对应的渲染选项
  // options 就是用户自己 渲染的时候可以决定有哪些方法

  let {
    /** 创建元素 */
    createElement: hostCreateElement,
    /** 设置元素 */
    setElementText: hostSetElementText,
    /** 创建文本元素 */
    createTextNode: hostCreateTextNode,
    setText: hostSetText,
    /** 插入元素 */
    insert: hostInsert,
    /** 移除元素 */
    remove: hostRemove,
    /** 查询元素 */
    querySelector: hostQuerySelector,
    /**  */
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
  } = options;

  function normalize(children, i) {
    if (isString(children[i]) || isNumber(children[i])) {
      children[i] = createVNode(Text, null, children[i]); // 需要换掉以前存的内容
    }

    return children[i];
  }

  function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
      let child = normalize(children, i);
      patch(null, child, container);
    }
  }

  function mountElement(vnode, container) {
    let { type, props, children, shapeFlag } = vnode;
    // 因为我们后续需要比对虚拟节点的差异，更新页面 所以需要保留对应的真实节点
    let el = (vnode.el = hostCreateElement(type));

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }

    mountChildren(children, el);
    hostInsert(el, container);
  }

  function processText(n1, n2, container) {
      if(n1 == null){
       hostInsert(n2.el = hostCreateTextNode(n2.children,container),container)
      }
  }

  function processElement(n1, n2, container) {   
    if(n1 == null){
        mountElement(n2,container);
    }
  }

  function patch(n1, n2, container) {
    // 看n1 如果是null 说明是初始化
    // n1如果有值要走diff算法
    const { type,shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // xx | TEXT_
          processElement(n1, n2, container);
        }
    }
  }

  function render(vnode, container) {
    // 我们需要将vnode渲染到container中

    if (vnode == null) {
    } else {
      //

      patch(container._vnode || null, vnode, container);
    }
    container._vnode = vnode; // 第一次渲染的时候我们就将这个vnode保留到了容器上
  }

  return {
    render,
  };
}
