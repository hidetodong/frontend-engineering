<!--
 * @Author: hidetodong
 * @Date: 2022-06-28 23:11:13
 * @LastEditTime: 2022-06-30 23:48:59
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /vite-router/src/views/Home.vue
 * HIDETOXIC - 版权所有
-->
<template>
    <div>
        <router-link to="/a"> yemi </router-link>
        <router-link to="/c"> yemi </router-link>
        <router-view/>
    </div>
</template>

<script>
export default {
    beforeRouteEnter(to, from, next) {
        console.log('进入前')
    },
    beforeRouteUpdate(to, from, next) {
        console.log('更新前')
    },
    beforeRouteLeave(to, from, next) {
        console.log('离开前')
    }
}
</script>

<style  scoped>

</style>