import babel from '@rollup/plugin-babel';

export default {
    input:'./src/main.js',
    output:{
        file:'dist/bundle.cjs.js', // 输出文件的路径和名称
        format:'es',// amd / es / iife / umd /cjs
        name:'bundleName'
    },
    plugins:[
        babel({
            exclude:/node_modules/
        })
    ]
}

/** 
 * 插件有两种
 * 1.rollup-plugin-babel  社区的
 * 2.@rollup/plugin-babel 官方的
 */