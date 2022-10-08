/*
 * @Author: hidetodong
 * @Date: 2022-10-08 20:37:57
 * @LastEditTime: 2022-10-08 21:12:23
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /1.react/vite.config.js
 * HIDETOXIC - 版权所有
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path'


export default defineConfig({
  resolve: {
    alias: {
      react: path.posix.resolve("src/react"),
      "react-dom": path.posix.resolve("src/react-dom"),
      "react-reconciler": path.posix.resolve("src/react-reconciler"),
      scheduler: path.posix.resolve("src/scheduler"),
      shared: path.posix.resolve("src/shared"),
    },
  },
  plugins: [react()],
});
