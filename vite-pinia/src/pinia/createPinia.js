/*
 * @Author: hidetodong
 * @Date: 2022-06-26 21:30:48
 * @LastEditTime: 2022-06-28 22:42:09
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /vite-pinia/src/pinia/createPinia.js
 * HIDETOXIC - 版权所有
 */

import { effectScope ,ref} from "vue";
import { symbolPinia } from './consts'
export function createPinia (){
    const scope = effectScope();
    const state = scope.run(()=> ref({}))
    const _p = [] // 所有的插件
    const pinia = {
        install(app){
            app.provide(symbolPinia,pinia)
        },
        use(plugin){
            _p.push(plugin)
            return this
        },
        state,
        _s:new Map(),
        _e:scope,
        _p,
        scope
    }

    return pinia
}