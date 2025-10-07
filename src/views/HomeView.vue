<template>
  <a-layout id="components-layout-demo-top-side">
    <HeaderView />
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">

        <SiderView />
        <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
          会员人数：{{ count }}
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HeaderView from '@/components/HeaderView.vue';
import SiderView from '@/components/SiderView.vue';

import request from "@/utils/request";

const count = ref({ value: 0 });

onMounted(async () => {
  try {
    const res = await request.get('http://localhost:8000/member/member/count')
    count.value = res.data;
  } catch (error) {
    console.error("获取会员数量失败:", error);
  }
});

const selectedKeys1 = ref(['2']);
const selectedKeys2 = ref(['1']);
const openKeys = ref(['sub1']);


</script>
<style scoped>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>