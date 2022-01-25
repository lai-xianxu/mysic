<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <!-- <el-carousel
      class=""
      :interval="4000"
      height="300px"
      @change="changeCarousel"
    >
      <el-carousel-item
        v-for="(item,index) in bannerList"
        :key="index"
      >
        <img
          :src="item.imageUrl + '?param=1100y460'"
          @click="handleBanner(item)"
          alt=""
        />
      </el-carousel-item>
    </el-carousel> -->

    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">推荐歌单</h3>
      <div class="items">
        <div
          class="item"
          v-for="item in songList"
          :key="item.id"
          @click="jumpPlayDetail(item.id)"
        >
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ item.copywriter }}</span>
            </div>
            <div class="desc-wrap2 fec fs14">
              <i class="el-icon-headset mr5"></i>
              <span>{{ item.playCount | playNumFilter }}</span>
            </div>
            <img :src="item.picUrl + '?param=200y200'" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>

    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">最新音乐</h3>
      <div class="items">
        <div
          class="item"
          v-for="item in newsongList"
          :key="item.id"
          @click="getSongUrl(item.id)"
        >
          <div class="fsc">
            <div class="img-wrap">
              <img :src="item.picUrl + '?param=80y80'" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <div class="song-wrap">
              <div class="song-name ellipsis2">{{ item.name }}</div>
              <div class="singer">{{ item.song.artists[0].name }}</div>
            </div>
          </div>
          <div class="fsc c999 fs14">
            <i class="el-icon-headset mr5"></i>
            <span>{{
              item.song &&
              item.song.bMusic &&
              item.song.bMusic.playTime | playNumFilter
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div
          class="item"
          v-for="item in songMvList"
          :key="item.id"
          @click="jumpMVDetail(item.id)"
        >
          <div class="img-wrap">
            <img :src="item.picUrl + '?param=250y140'" alt="" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ item.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBanner,
  personalized,
  newsong,
  getSongUrl,
  getSongMV,
} from "@/api/discovery";
export default {
  name: "discovery",
  data() {
    return {
      bannerList: [],
      songList: [],
      newsongList: [],
      songMvList: [],
    };
  },
  created() {
    this.getSongList();
  },
  methods: {
    // 点击banner
    handleBanner(item) {
      if (item.encodeId != 0) {
        this.getSongUrl(item.encodeId);
      } else {
        var jump = document.createElement("a");
        jump.href = item.url;
        jump.target = "_blank";
        document.body.appendChild(jump);
        jump.click();
        jump.remove();
      }
    },
    // 获取页面歌曲
    getSongList() {
      // 获取轮播图
      getBanner().then((res) => {
        this.bannerList = res.banners;
        console.log(this.bannerList);
      });
      // 获取推荐歌单
      personalized({ limit: 10 }).then((res) => {
        this.songList = res.result;
      });
      // 获取最新音乐
      newsong({ limit: 11 }).then((res) => {
        this.newsongList = res.result;
      });
      // 获取MV
      getSongMV().then((res) => {
        this.songMvList = res.result;
      });
    },
    // 获取歌曲链接
    getSongUrl(id) {
      // getSongUrl({ id }).then((res) => {
      //   this.$notify({
      //     title: "歌曲",
      //     message: "播放成功",
      //     type: "success",
      //   });
      //   let url = res.data[0].url;
      //   this.$parent.musicUrl = url;
      // });
      this.$bus.emit("get-song-url", { id });
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
    // 跳转MV详情页
    jumpMVDetail(id) {
      this.$router.push({
        path: "/mvDetail",
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style >
.song-name {
  width: 160px;
}
</style>
