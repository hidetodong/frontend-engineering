# npm的特点
> 例： bootstrap -> animate.css
项目中可以直接使用，不用重新安装animate.css
如果bootstrap不用了，animate.css就没了
问题：幽灵依赖


# 拆分某块

 - runtime-dom / html上的属性操作 常用的节点操作的api
 - runtime-core / 虚拟dom（跨平台）