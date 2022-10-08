/*
 * @Author: hidetodong
 * @Date: 2022-10-08 20:48:20
 * @LastEditTime: 2022-10-08 20:49:55
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /1.react/doc/2.newjsx.js
 * HIDETOXIC - 版权所有
 */
// 在React 17 之前 babel转换是老的写法
const babel = require('@babel/core');
const sourceCode = `
<h1>
    hello <span style={{ color:'red' }}>world</span>
</h1>
`;

const result = babel.transform(sourceCode,{
    plugins:[
        ["@babel/plugin-transform-react-jsx",{ runtime:'automatic' }]
    ]
})

console.log(result);

/**
 * 
 * 
 * 
"use strict";

var _jsxRuntime = require("react/jsx-runtime");

(0, _jsxRuntime.jsxs)("h1", {
    children: ["hello ", (0, _jsxRuntime.jsx)("span", {
      style: {
        color: 'red'
      },
      children: "world"
    })]
  });
  
*/