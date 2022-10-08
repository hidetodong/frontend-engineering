// 在React 17 之前 babel转换是老的写法
const babel = require('@babel/core');
const sourceCode = `
<h1>
    hello <span style={{ color:'red' }}>world</span>
</h1>
`;

const result = babel.transform(sourceCode,{
    plugins:[
        ["@babel/plugin-transform-react-jsx",{ runtime:'classic' }]
    ]
})

console.log(result);


/**
 * 
 * 
 * "use strict";

var _jsxRuntime = require("react/jsx-runtime");

(0, _jsxRuntime.jsxs)("h1", {
    children: ["hello ", (0, _jsxRuntime.jsx)("span", {
      style: {
        color: 'red'
      },
      children: "world"
    })]
  });
 * 
 */