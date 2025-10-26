<template>
  <a-layout-sider width="200" style="background: #fff">

    <a-menu
        v-model:selectedKeys="selectedKeys2"
        v-model:openKeys="openKeys"
        mode="inline"
        style="height: 100%"
    >
      <a-menu-item key="/welcome">
        <router-link to="/welcome">欢迎</router-link>
      </a-menu-item>
      <a-menu-item key="/passenger">
        <router-link to="/passenger">乘车人</router-link>
      </a-menu-item>
      <a-menu-item key="3">nav 3</a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script setup lang="ts">
</script>