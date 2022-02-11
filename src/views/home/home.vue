<template>
  <div>
    <!-- 顶部搜索区域 -->
    <homeTop />
    <!-- 首页主体区域 -->
    <homeMain />
  </div>
</template>

<script>
import homeTop from "@/views/home/homeTop.vue";
import homeMain from "@/views/home/homeMain.vue";
export default {
  name: "home",
  components: {
    homeTop,
    homeMain,
  },
};
</script>

<style>
</style>