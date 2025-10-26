<script setup lang="ts">
import store from '@/store'
console.log('store    ===  ', store.state.member)


</script>

<template>
  <a-layout-header class="header">
    <div class="logo" />
    <div style="float: right; color: white;">
      您好：{{store.state.member.mobile}} &nbsp;&nbsp;
      <router-link to="/login" style="color: white;">
        退出登录
      </router-link>
    </div>

    <a-menu
      v-model:selectedKeys="selectedKeys1"
      theme="dark"
      mode="horizontal"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item key="/welcome">
        <router-link to="/welcome">欢迎</router-link>
      </a-menu-item>
      <a-menu-item key="/passenger">
        <router-link to="/passenger">乘车人</router-link>
      </a-menu-item>
      <a-menu-item key="3">nav 3</a-menu-item>
    </a-menu>

  </a-layout-header>
</template>
