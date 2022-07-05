/*
 * @Author: hidetodong
 * @Date: 2022-07-05 22:03:32
 * @LastEditTime: 2022-07-05 22:03:33
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /vue-ui/typing/vue-shime.d.ts
 * HIDETOXIC - 版权所有
 */
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
  }

  // 这个目的就是编写引入.vue文件的时候 能识别出组件的类型