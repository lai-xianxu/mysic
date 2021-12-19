<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <span class="iconfont icon-home"></span>
        <span class="iconfont icon-sami-select"></span>
        <span class="iconfont icon-full-screen"></span>
      </div>
      <div class="history-wrapper">
        <span class="iconfont icon-arrow-lift"></span>
        <span class="iconfont icon-arrow-right"></span>
      </div>
    </div>
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <el-input
          placeholder="请输入内容"
          v-model="searchValue"
          clearable
          @change="searchSong"
        >
          <i
            slot="prefix"
            class="el-input__icon el-icon-search"
          ></i>
        </el-input>
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "top",
  data() {
    return {
      query: "",
      searchValue: "",
    };
  },
  methods: {
    // 搜索歌曲
    searchSong() {
      this.$router.push({
        path: "/result",
        query: {
          keywords: this.searchValue,
        },
      });
    },
  },
};
</script>

<style scoped></style>
