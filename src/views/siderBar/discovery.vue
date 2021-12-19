<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel
      class=""
      :interval="4000"
      type="card"
    >
      <el-carousel-item
        v-for="(item,index) in bannerList"
        :key="index"
      >
        <img
          :src="item.imageUrl + '?param=550y230'"
          alt=""
        />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">
        推荐歌单
      </h3>
      <div class="items">
        <div
          class="item"
          v-for="item in songList"
          :key="item.id"
        >
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{item.copywriter}}</span>
            </div>
            <img
              :src="item.picUrl + '?param=200y200'"
              alt=""
            />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">
        最新音乐
      </h3>
      <div class="items">
        <div
          class="item"
          v-for="item in newsongList"
          :key="item.id"
        >
          <div class="img-wrap">
            <img
              :src="item.picUrl + '?param=80y80'"
              alt=""
            />
            <span
              class="iconfont icon-play"
              @click="getSongUrl(item.id)"
            ></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{item.name}}{{item.id}}</div>
            <div class="singer">{{item.song.artists[0].name}}</div>
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
        >
          <div class="img-wrap">
            <img
              :src="item.picUrl + '?param=250y140'"
              alt=""
            />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artistName}}</div>
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
      newsong({ limit: 10 }).then((res) => {
        this.newsongList = res.result;
      });
      // 获取MV
      getSongMV().then((res) => {
        this.songMvList = res.result;
      });
    },
    // 获取歌曲链接
    getSongUrl(id) {
      getSongUrl({ id }).then((res) => {
        let url = res.data[0].url;
        this.$parent.musicUrl = url;
      });
    },
  },
};
</script>

<style >
</style>
