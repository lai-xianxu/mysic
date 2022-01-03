<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <img
          :src="highqualitySong.coverImgUrl + '?param?160y160'"
          alt=""
        />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">{{highqualitySong.name}} </div>
        <div class="info">{{highqualitySong.description}}</div>
      </div>
      <img
        :src="highqualitySong.coverImgUrl"
        alt=""
        class="bg"
      />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span
          class="item"
          :class="{'active': index == activeIndex}"
          v-for="(item,index) in tagList"
          :key="index"
          @click="handleTag(index,item)"
        >{{item}}</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div
            class="item"
            v-for="item in playList"
            :key="item.id"
            @click="jumpPlayDetail(item.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount | playNumFilter}}</span>
              </div>
              <img
                :src="item.coverImgUrl + '?param=200y200'"
                alt=""
              />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page="pageIndex"
      :page-size="pageSize"
      :page-sizes="[10, 20, 40, 100]"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getHighquality, getPlaylist } from "@/api/discovery";
export default {
  name: "recommend",
  data() {
    return {
      // 总条数
      total: 0,
      // 页码
      pageIndex: 1,
      pageSize: 10,
      highqualitySong: {},
      playList: [],
      activeIndex: 0,
      tagList: [
        "全部",
        "欧美",
        "华语",
        "流行",
        "说唱",
        "摇滚",
        "民谣",
        "电子",
        "轻音乐",
        "影视原声",
        "ACG",
        "怀旧",
        "治愈",
        "旅行",
      ],
    };
  },
  created() {
    this.getHighquality();
    this.getPlaylist();
  },
  methods: {
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getPlaylist();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPlaylist();
    },
    // 获取推荐歌单
    getHighquality() {
      // 精品推荐
      getHighquality({
        limit: 1,
        cat: "全部",
      }).then((res) => {
        this.highqualitySong = res.playlists[0];
        this.total = res.total;
      });
    },
    // 获取歌单列表
    getPlaylist(item) {
      console.log(item, "iiiiiii");
      let cat = item || "全部";
      getPlaylist({
        cat,
        limit: this.pageSize,
        offset: (this.pageIndex - 1) * this.pageSize,
      }).then((res) => {
        this.playList = res.playlists;
      });
    },
    // 点击当前标签
    handleTag(index, item) {
      this.activeIndex = index;
      this.getPlaylist(item);
    },
    // 跳转歌单详情页
    jumpPlayDetail(id) {
      this.$router.push({
        path: "/playsDetail",
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style >
</style>
