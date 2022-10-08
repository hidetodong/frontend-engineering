import hasOwnProperty from "shared/hasOwnProperty";
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'

const RESERVED_PROPS = {
    key:true,
    ref:true,
    __self:true,
    __source:true
}
function ReactElement(type,key,ref,props){
    return { // React元素 ｜ 虚拟DOM
        $$typeof:REACT_ELEMENT_TYPE,
        type, // h1 span    
        key, 
        ref,
        props
    }
}

function hasValidKey(config){
    return config.key !== undefined
}

function hasValidRef(config){
    return config.ref !== undefined
}

export function jsxDEV (type,config){
    debugger
    let propName;// 属性名
    const props = {};// 属性对象
    let key = null;// 每个虚拟DOM都有一个可选的key
    let ref = null;// 引入 后面可以通过这个取得真实dom

    if(hasValidKey(config)){
        key = config.key;
    }

    if(hasValidRef(config)){
        ref = config.ref
    }

    for(propName in config){
        // 判断是否存在以及不是保留属性
        if(Object.hasOwnProperty.call(config,propName)&&!RESERVED_PROPS.hasOwnProperty(propName)){
            props[propName] = config[propName]
        }
    }

    return ReactElement(type,key,ref,props)
}