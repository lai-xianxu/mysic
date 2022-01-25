<template>
  <div class="index-container">
    <!-- 轮播图 -->
    <div class="lb_box" v-if="currentPath == '/discovery'">
      <div class="left arrow fcc" @click="prev">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="right arrow fcc" @click="next">
        <i class="el-icon-arrow-right"></i>
      </div>
      <img
        :src="bannerList[currentIndex] && bannerList[currentIndex].imageUrl"
        alt=""
        class="img_bg"
      />
      <el-carousel
        class=""
        :interval="4000"
        @change="changeCarousel"
        type="card"
        indicator-position="outside"
        arrow="never"
        trigger="click"
        ref="carousel"
        style="width: 1100px; margin-top: 10px"
      >
        <el-carousel-item v-for="(item, index) in bannerList" :key="index">
          <img
            :src="item.imageUrl + '?param=550y260'"
            @click="handleBanner(item)"
            alt=""
          />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="fcs pr">
      <!-- 左侧悬浮导航 -->
      <div
        class="nav"
        id="nav"
        :class="
          currentPath == '/discovery'
            ? navStatus
              ? 'nav2'
              : ''
            : navStatus
            ? 'nav2 xf_box'
            : 'xf_box'
        "
        v-if="pathStatus"
      >
        <ul>
          <li>
            <el-tooltip content="发现音乐" placement="left" effect="light">
              <router-link to="/discovery">
                <span class="iconfont icon-find-music"></span>
              </router-link>
            </el-tooltip>
          </li>
          <li>
            <el-tooltip content="推荐歌单" placement="left" effect="light">
              <router-link to="/playlists">
                <span class="iconfont icon-music-list"></span>
              </router-link>
            </el-tooltip>
          </li>
          <li>
            <el-tooltip content="最新音乐" placement="left" effect="light">
              <router-link to="/songs">
                <span class="iconfont icon-music"></span>
              </router-link>
            </el-tooltip>
          </li>
          <li>
            <el-tooltip content="最新MV" placement="left" effect="light">
              <router-link to="/mvs">
                <span class="iconfont icon-mv"></span>
              </router-link>
            </el-tooltip>
          </li>
        </ul>
      </div>
      <!-- 右侧内容 -->
      <div class="main">
        <router-view></router-view>
      </div>
    </div>

    <!-- 底部播放控件 -->
    <div class="player">
      <audio :src="musicUrl" controls autoplay></audio>
    </div>
  </div>
</template>

<script>
import { getBanner, getSongUrl } from "@/api/discovery";
export default {
  name: "index",
  data() {
    return {
      musicUrl:
        "http://m7.music.126.net/20200303182550/8aa5971b1630d1527a922ccd2b97f392/ymusic/035d/0109/520e/478f86cc9f6c6539f7c8ed3e06c1bf8e.mp3",
      bannerList: [],
      currentIndex: 0,
      currentPath: "",
      pathStatus: true,
      navStatus: false,
    };
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.currentPath = val.path;
        const paths = ["/discovery", "/playlists", "/songs", "/mvs"];
        this.pathStatus = paths.includes(val.path);
        console.log(this.pathStatus, "this.pathStatus");
        console.log(val, "vvvvvvvv"); //新路由信息
        console.log(oldval); //老路由信息
      },
      // 深度观察监听
      deep: true,
    },
  },
  created() {
    this.getBanner();
    this.currentPath = this.$route.path;
    console.log(this.currentPath, this.currentPath);
  },
  mounted() {},
  methods: {
    // 切换左侧导航悬浮状态
    changeNav() {
      this.navStatus = true;
      // var nav = document.getElementById("nav");
      // nav.className = "nav2";
    },
    // 上下一个轮播图
    prev() {
      this.$refs.carousel.prev();
    },
    next() {
      this.$refs.carousel.next();
    },
    changeCarousel(i) {
      this.currentIndex = i;
    },
    // 获取轮播图
    getBanner() {
      getBanner().then((res) => {
        this.bannerList = res.banners;
        console.log(this.bannerList);
      });
    },
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
    // 获取歌曲链接
    getSongUrl(id) {
      getSongUrl({ id }).then((res) => {
        this.$notify({
          title: "歌曲",
          message: "播放成功",
          type: "success",
        });
        let url = res.data[0].url;
        this.musicUrl = url;
      });
    },
  },
};
</script>

<style scoped>
.main {
  min-height: 102vh;
}
.lb_box {
  position: relative;
  text-align: center;
  overflow: hidden;
  height: 300px;
  display: flex;
  justify-content: center;
}
.arrow {
  position: absolute;
  left: 50%;
  top: 44%;
  height: 36px;
  width: 36px;
  cursor: pointer;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  border-radius: 50%;
  background-color: rgba(31, 45, 61, 0.11);
  color: #fff;
  position: absolute;
  z-index: 10;
  text-align: center;
  font-size: 12px;
  opacity: 0;
}
.arrow:hover {
  background-color: rgba(31, 45, 61, 0.23);
  border-radius: 50%;
}
.left {
  transform: translateX(-600px);
}
.right {
  transform: translateX(565px);
}
.lb_box:hover .left {
  opacity: 1;
}
.lb_box:hover .right {
  opacity: 1;
}
.img_bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 500px;
  filter: blur(30px);
  transform: scale(10);
}
.pr {
  position: relative;
}
.nav {
  position: absolute;
  left: 50%;
  transform: translate(-100%, 0);
  margin-left: -560px;
  top: 10px;
}
.xf_box {
  top: 290px !important;
}
.nav2 {
  position: fixed !important;
  top: 370px !important;
}
</style>
