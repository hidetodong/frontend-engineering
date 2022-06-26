<template>
  <div @click="increment(5)">{{ store.count}} / {{ store.double}}</div>
</template>

<script setup>
import {useMainStore} from  './stores/main.js';
const store = useMainStore()
const {increment} = useMainStore()
console.log(store);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
