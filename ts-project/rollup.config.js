import { nodeResolve } from '@rollup/plugin-node-resolve' // 按照node规则来解析
import ts from 'rollup-plugin-typescript'
import path from 'path'

export default {
    input:"./src/index.ts",
    output:{
        file:path.resolve(__dirname,'dist/main.js'),
        format:"iife",
        sourcemap:true
    },
    plugins:[
        ts(),
        nodeResolve()
    ]
}