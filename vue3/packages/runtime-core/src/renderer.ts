import { isNumber, isString } from "@vue/shared";
import { ReactiveEffect } from '@vue/reactivity'
import { createComponentInstance, setupComponent } from "./component";
import { ShapeFlags, Text, createVNode, isSameVNode, Fragment } from "./createVNode";



function getSequence(arr) {
    let len = arr.length
    let result = [0];
    let p = new Array(len).fill(0); // p 中存的是什么目前不重要
    let lastIndex;
    let start
    let end
    let middle;
    for (let i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) { // 0在vue3中意味着新增节点，这个不计入最长递增子序列列表
            lastIndex = result[result.length - 1]; // 去到数组中的最后一项，就是最大的那个索引
            if (arr[lastIndex] < arrI) { // 说明当前这一项比结果集中最后一项大则直接将索引放入即可
                p[i] = lastIndex; // 存的是索引
                result.push(i);
                continue
            }
            // 否则的情况
            start = 0;
            end = result.length - 1; // 二分查找
            while (start < end) { // 计算有序比较都可以这样搞
                middle = Math.floor(((start + end) / 2));
                if (arr[result[middle]] < arrI) {
                    start = middle + 1;
                } else {
                    end = middle
                }
            }
            if (arrI < arr[result[end]]) {
                p[i] = result[end - 1]
                result[end] = i
            }

        }
    }
    // 倒叙追溯 先取到结果集中的最后一个 
    let i = result.length;
    let last = result[i - 1];

    while (i-- > 0) { // 当检索后停止
        result[i] = last; // 最后一项是正确的 
        last = p[last]; // 根据最后一项 向前追溯
    }
    return result
}
export function createRenderer(options) { // 用户可以调用此方法传入对应的渲染选项
    let {
        createElement: hostCreateElement,
        createTextNode: hostCreateTextNode,
        insert: hostInsert,
        remove: hostRemove,
        querySelector: hostQuerySelector,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        setText: hostSetText,
        setElementText: hostSetElementText,
        patchProp: hostPatchProp
    } = options
    // options 就是用户自己 渲染的时候可以决定有哪些方法
    function normalize(children, i) {
        if (isString(children[i]) || isNumber(children[i])) {
            // 给文本加标识 不能直接给字符串+ ， 得给对象+
            children[i] = createVNode(Text, null, children[i]); // 需要换掉以前存的内容
        }
        return children[i];
    }
    function mountChildren(children, container) {

        console.log( children)
        for (let i = 0; i < children.length; i++) {
            // 这样处理不行，处理后不会改变children的内容
            let child = normalize(children, i);
            console.log(child)
            // child 可能是文本内容，我们需要把文本也变成虚拟节点 
            // child 可能就是文本了
            patch(null, child, container); // 递归渲染子节点
        }
    }
    function patchProps(oldProps, newProps, el) {
        if (oldProps == null) oldProps = {};
        if (newProps == null) newProps = {}

        // 循环新的覆盖老的，
        for (let key in newProps) {
            hostPatchProp(el, key, oldProps[key], newProps[key])
        }
        // 老的有的新没有要删除
        for (let key in oldProps) {
            if (newProps[key] == null) {
                hostPatchProp(el, key, oldProps[key], null)
            }
        }
    }
    function mountElement(vnode, container, anchor) {
        let { type, props, children, shapeFlag } = vnode;
        // 因为我们后续需要比对虚拟节点的差异更新页面，所有需要保留对应的真实节点
        let el = vnode.el = hostCreateElement(type)

        if (props) {  // {a:1, b:2}  {c:3}
            // 更新属性
            patchProps(null, props, el);
        }

        // children不是数组 就是文本
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children)
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el);
        }
        hostInsert(el, container, anchor)
    }

    function setupRendererEffect(instance,container,anchor){

        const componentUpdate = () => {
            const { render,data } = instance;
            // 说明是初次渲染
            // render函数里的this 既可以取到props 也可以取到data 取到attr
            if(!instance.isMounted){
                // 组件最终要渲染的虚拟节点
                const subTree = render.call(data)

                patch(null,subTree,container,anchor)

                instance.subTree = subTree
                instance.isMounted = true
            } else { // 走更新逻辑
                const subTree = render.call(instance.proxy)

                patch(instance.subTree,subTree,container,anchor)

                instance.subTree = subTree
            }

        }
        const effect = new ReactiveEffect(componentUpdate)

        let update = instance.update = effect.run.bind(effect)
        update()

    }

    function mountComponent(vnode,container,anchor){
        // new Vue({component:})
        // 1) 组件挂载前 需要产生一个组件的实例 组件的状态 组件的属性 组件对应的生命周期
        const instance = vnode.component = createComponentInstance(vnode)
        // 2） 组件的插槽 处理组件的属性。给组件的实例赋值
        setupComponent(instance)
        // 3） 给组件产生一个effect，这样可以组件数据变化后重新渲染
        setupRendererEffect(instance,container,anchor);
        // 组件的优点？ 复用 逻辑拆分 方便维护 局部更新
    }

    function unmountChildren(children) {
        children.forEach(child => {
            unmount(child)
        });
    }

    function patchKeyedChildren(c1, c2, el) {

        // 比较 c1 和 c2 两个数组之间的差异 ， 再去更新el
        // On

        // 尽可能复用节点，而且找到变化的位置   优化： 原则上的diff算法很简单就是拿新的去里面找

        // 先考虑 一些顺序相同的情况，追加，或者删除 

        let i = 0;
        let e1 = c1.length - 1;
        let e2 = c2.length - 1;

        // 有任何一方比对完成后 就无需在比对了 
        // 1） sync from start
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if (isSameVNode(n1, n2)) {
                patch(n1, n2, el);
            } else {
                break;
            }
            i++;
        }
        // 下午把完整的diff算法写完，组件的渲染原理
        console.log(i, e1, e2); // i=4 e1=3 e2=5  通过这几个值如何算出 我应该是往后面追加的？

        // 我们可以确定的是 当i的值大于e1 说明，我们已经将老的全部比对完成，但是新的还有剩余 
        // i 到 e2之间的内容就是要新增的

        // 2）sync from end
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if (isSameVNode(n1, n2)) {
                patch(n1, n2, el);
            } else {
                break;
            }
            e1--;
            e2--;
        }
        //     c d e q
        // a b c d e q   // i= 0  e1 =3  e2 = 5

        // i = 0   e1 = -1  e2 = 1


        // 老的多新的少
        // a b c d e f
        // a b c d  

        // i = 4  e1 = 5  e2 =3

        // 向后追加 向前追加 + 前删除 后删除

        if (i > e1) {
            if (i <= e2) {
                while (i <= e2) {
                    // 其实就是看e2是不是末尾项时
                    const nextPos = e2 + 1;
                    // 看一下 下一项是否在数组内，如果在数组内，说明有参照物，否则就没有
                    let anchor = c2.length <= nextPos ? null : c2[nextPos].el
                    patch(null, c2[i], el, anchor); // 插入节点, 找到对应的参照物再进插入
                    i++;
                }
            }
        } else if (i > e2) { // 老的多 新的少
            if (i <= e1) {
                while (i <= e1) {
                    unmount(c1[i]);
                    i++;
                }
            }
        } else {
            // unknown sequence
            //       [5, 3, 4, 0]    => [1,2] 是不要移动的
            // a b   [c d e q ]      f g
            // a b   [e c d h]      f g  // i=>2 e1=4  e2=4
            let s1 = i; // s1 ->  e1  老的需要比对的部分
            let s2 = i; // s2 ->  e2  新的要比对的部分
            // v2中用的是新的找老的 ， vue3 是用老的找新的
            let toBePatched = e2 - s2 + 1; // 我们要操作的次数
            const keyToNewIndexMap = new Map();
            for (let i = s2; i <= e2; i++) {
                keyToNewIndexMap.set(c2[i].key, i);
            }


            const seq = new Array(toBePatched).fill(0); // [0,0,0,0]

            for (let i = s1; i <= e1; i++) {
                const oldVNode = c1[i];
                let newIndex = keyToNewIndexMap.get(oldVNode.key); // 用老的去找，看看新的里面有没有
                if (newIndex == null) {
                    unmount(oldVNode); // 新的里面找不到了，说明要移除掉
                } else {

                    // 新的老的都有，我就记录下来当前对应的索引 ， 我就可以判断出哪些元素不需要移动了 
                    // 用新的位置和老的位置做一个关联
                    seq[newIndex - s2] = i + 1; // 保证查找的索引就算是0 也 + 1 保证不会出现patch过的结果 是0 的情况

                    patch(oldVNode, c2[newIndex], el); // 如果新老都有，我们需要比较两个节点的差异，在去比较他们的儿子？
                }
            }

            let incr = getSequence(seq); // 计算出了不用动的去序列 （索引）




            // 我需要按照新的位置重新“排列”，并且还需要将“新增”元素添加上
            // 我们已知 正确的顺序，我们可以倒叙插入  appendChild

            // toBePatched = 4

            // 3 2 1 0   通过子序列优化diff算法

            // incr = [1,2]
            let j = incr.length - 1
            for (let i = toBePatched - 1; i >= 0; i--) {
                const currentIndex = s2 + i; // 找到对应的索引
                const child = c2[currentIndex]; // q
                const anchor = currentIndex + 1 < c2.length ? c2[currentIndex + 1].el : null;
                // 判断要移动还是新增  如何知道child是新增的？
                if (seq[i] === 0) {  // 如果 == 0 说明是新增的
                    patch(null, child, el, anchor)
                } else { // 这里应该尽量减少需要移动的节点： 最长递增子序列算法 来实现
                    // insertBefore 调用后会被移动
                    if(i !== incr[j]) { // 通过序列来进行比对，找到哪些需要移动
                        hostInsert(child.el, el, anchor);// 如果有el 说明以前渲染过了
                    }else{
                        j--; // 不做任何操作
                    }
                }
            }
        }
    }
    function patchChildren(n1, n2, el) {
        let c1 = n1.children;
        let c2 = n2.children;

        const prevShapeFlag = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;

        // 开始比较儿子的情况
        // 文本	数组	（删除老儿子，设置文本内容）
        // 文本	文本	（更新文本即可）
        // 文本	空	（更新文本即可) 与上面的类似
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                unmountChildren(c1);//  文本	 数组	（删除老儿子，设置文本内容）
            }
            if (c1 !== c2) {
                hostSetElementText(el, c2)
            }
        } else {
            // 最新的要么是空 要么是数组
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                // 之前是数组
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 前后都是数组
                    // diff算法       数组	数组	（diff算法）
                    patchKeyedChildren(c1, c2, el);
                } else {
                    // 空	数组	（删除所有儿子）
                    unmountChildren(c1)
                }
            } else {
                // 数组	文本	（清空文本，进行挂载）
                // 数组	空	（进行挂载） 与上面的类似
                // 空	文本	（清空文本）
                // 空	空	（无需处理）
                if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                    hostSetElementText(el, '');
                }
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 前后都是数组
                    mountChildren(c2, el);
                }
            }
        }
    }
    function patchElement(n1, n2) {

        // n1 和 n2 能复用说明dom节点就不用删除了 

        let el = n2.el = n1.el; // 1) 节点复用

        let oldProps = n1.props;
        let newProps = n2.props;
        patchProps(oldProps, newProps, el); // 2) 比较属性

        // 3） 自己比较完毕后 比较儿子
        patchChildren(n1, n2, el);


    }
    function processElement(n1, n2, container, anchor) {
        if (n1 == null) {
            mountElement(n2, container, anchor)
        } else {
            patchElement(n1, n2);
        }
    }
    function processText(n1, n2, container) {
        if (n1 == null) {
            hostInsert(n2.el = hostCreateTextNode(n2.children), container)
        }else{
            const el = n2.el = n1.el; // 复用老的节点
            let newText = n2.children
            if(newText !== n1.children){
                hostSetText(el,newText)
            }
        }
    }
    function processFragment(n1, n2, container){    
        if (n1 == null) {
            mountChildren(n2.children,container)
        }else{
            patchKeyedChildren(n1.children,n2.children,container)
        }

    }
    function processComponent(n1,n2,container,anchor){
        if(n1 === null){
            // 初始化组件
            mountComponent(n2,container,anchor)
        }else{
            // 组件更新 插槽更新 属性更新
            debugger

        }
    }



    function unmount(n1) {
        if(n1.type == Fragment){// fragment 删除所有子节点 
            return unmountChildren(n1.children)
        }
        hostRemove(n1.el);
    }
  
    function patch(n1, n2, container, anchor = null) {
        if (n1 && !isSameVNode(n1, n2)) {
            unmount(n1);
            n1 = null; // 将n1 重制为null  此时会走n2的初始化
        }
        // 判断标签名 和 对应的key 如果一样 说明是同一个节点 div  key:1

        // 看n1 如果是null 说明没有之前的虚拟节点
        // 看n1 如果有值 说明要走diff算法
        const { type, shapeFlag } = n2;
        switch (type) {
            case Text:
                processText(n1, n2, container)
                break;
            case Fragment:
                processFragment(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) { // xx | TEXT_Children  xx | ARRAY_children
                    processElement(n1, n2, container, anchor)
                }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
                    processComponent(n1,n2,container,anchor)
                }
        }
    }
    function render(vnode, container) { // 我们需要将vnode渲染到container中，并且调用options中的api
        // console.log(vnode,container)
        if (vnode == null) { // 卸载节点
            // 卸载元素
            if (container._vnode) {
                unmount(container._vnode)
            }

        } else {
            // 更新 
            patch(container._vnode || null, vnode, container)
        }
        container._vnode = vnode; // 第一次渲染的时候我们就将这个vnode保留到了容器上
    }
    return {
        render
    }
}