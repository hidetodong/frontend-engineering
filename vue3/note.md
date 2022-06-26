- 拆分模块  
    > runtime-dom (提供一些常用的节点操作的api , setAttribute) 
    
    > runtime-core 虚拟dom diff算法（跨平台）  通过vue的runtime-core 实现自己的渲染逻辑



- vue
    - runtime-dom  - runtime-core - reactivity (用户需要编写虚拟dom)
    - compiler-dom - compiler-core
