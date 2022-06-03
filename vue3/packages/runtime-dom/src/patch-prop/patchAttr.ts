/*
 * @Author: hidetodong
 * @Date: 2022-06-03 21:28:42
 * @LastEditTime: 2022-06-03 21:28:42
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /vue3/packages/runtime-dom/src/patch-prop/patchAttr.ts
 * HIDETOXIC - 版权所有
 */

export function patchAttr(el,key,nextValue){
    if(nextValue === null){
        el.removeAttribute(key)
    }else{
        el.setAttribute(key,nextValue)
    }
}
