import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { createRenderer } from '@vue/runtime-core'

const renderOptions = { patchProp, ...nodeOps };

export default renderOptions;



export function render(vnode, container) {
  let { render } = createRenderer(renderOptions);

  render(vnode, container);

   
}

export * from "@vue/runtime-core";