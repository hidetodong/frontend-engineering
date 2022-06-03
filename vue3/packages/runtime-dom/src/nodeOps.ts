export const nodeOps = {
    /** 创建元素 */
    createElement(tagName){
        return document.createElement(tagName)
    },
    /** 设置元素 */
    setElementText(element,text){
        element.textContent = text
    },
    /** 创建文本元素 */
    createTextNode(text){
        return document.createTextNode(text)
    },
    setText(element,text){
        element.nodeValue = text
    },
    /** 插入元素 */
    insert(element,container,anchor = null){
        container.insertBefore(element,anchor) // anchor = null
    },
    /** 移除元素 */
    remove(child){
        const parent = child.parentNode;
        if(parent){
            parent.removeChild(child)
        }
    },
    /** 查询元素 */
    querySelector(selectors){
        return document.querySelector(selectors)
    },
    /**  */
    parentNode(child){
        return child.parentNode
    },
    nextSibling(child){
        return child.nextSibling
    },
    

}

// 创建节点 创建文本节点 节点crud 获取父子关系 