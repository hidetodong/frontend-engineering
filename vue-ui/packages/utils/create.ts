/*
 * @Author: hidetodong
 * @Date: 2022-07-05 22:22:47
 * @LastEditTime: 2022-07-05 22:42:05
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /vue-ui/packages/utils/create.ts
 * HIDETOXIC - 版权所有
 */

// 用来创建bem规范的名字

function _bem(prefixName, blockName, elementName, modifierName) {
  if (blockName) {
    prefixName += `-${blockName}`;
  }
  if (elementName) {
    prefixName += `__${elementName}`;
  }
  if (modifierName) {
    prefixName += `--${modifierName}`;
  }
  return prefixName;
}

function createBEM(prefixName: string) {
  const b = (blockName = "") => _bem(prefixName, blockName, "", "");
  const e = (elementName = "") =>
    elementName ? _bem(prefixName, "", elementName, "") : "";
  const m = (modifierName = "") =>
    modifierName ? _bem(modifierName, "", "", modifierName) : "";

  const be = (blockName = "", elementName = "") =>
    blockName && elementName
      ? _bem(prefixName, blockName, elementName, "")
      : "";
  const em = (elementName = "", modifierName = "") =>
    elementName && modifierName
      ? _bem(prefixName, "", elementName, modifierName)
      : "";
  const bm = (blockName = "", modifierName = "") =>
    blockName && modifierName
      ? _bem(prefixName, blockName, "", modifierName)
      : "";
  const bem = (blockName = "", elementName = "", modifierName = "") =>
    modifierName && elementName && modifierName
      ? _bem(prefixName, blockName, elementName, modifierName)
      : "";

  const is = (name, state) => (state ? `is-${name}` : "");

  return {
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is
  };
}

export function createNamespace(name: string) {
  const prefixName = `h-${name}`;
  return createBEM(prefixName);
}
