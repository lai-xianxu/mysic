<template>
  <div id="app">
    <homeTop />
    <homeMain />
  </div>
</template>

<script>
import homeTop from "@/views/home/homeTop.vue";
import homeMain from "@/views/home/homeMain.vue";
export default {
  name: "app",
  components: {
    homeTop,
    homeMain,
  },
};
</script>

<style >
@import "./style/index.css";
@import "//at.alicdn.com/t/font_2970269_z8l5vxff1vm.css";
</style>
