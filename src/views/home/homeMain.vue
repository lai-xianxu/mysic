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
                <span class="iconfont icon-yinlechangpian1"></span>
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
      <div class="main" :class="{ min_main: pathStatus }">
        <router-view></router-view>
      </div>
    </div>

    <!-- 底部播放控件 -->
    <div class="player">
      <div class="player_item" :class="{ b0: audioSt || playAudio }">
        <!-- 锁 -->
        <div class="fcs lock c666" @click="changeAudioLock">
          <div class="iconfont icon-jiesuo fs20" v-if="audioSt"></div>
          <div class="iconfont icon-suoding fs20" v-else></div>
        </div>
        <div class="ban_round"></div>
        <!-- <audio :src="musicUrl" autoplay ></audio> -->
        <!-- <aplayer :music="musicUrl" :showLrc="true" :list="musicList"></aplayer> -->
        <player />
      </div>
    </div>

    <!-- 右侧返回顶部按钮 -->
    <el-button
      type="danger"
      icon="el-icon-caret-top"
      circle
      class="back_top"
      v-if="scrollType"
      @click="backTop"
    ></el-button>
  </div>
</template>

<script>
import {
  getBanner,
  getSongUrl,
  getSongDetail,
  getSongLyric,
} from "@/api/discovery";
import aplayer from "vue-aplayer"; // 引入播放组件
import Player from "../../components/player.vue";
export default {
  name: "index",
  components: {
    aplayer,
    Player,
  },
  data() {
    return {
      musicUrl: {
        src: "http://m701.music.126.net/20220125180754/23e2cb57185d2b57af20fd71919c7a7a/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/12783801314/6d4c/27c3/d316/32396ae3e0adf1a1d15a407b8e2269ce.mp3",
        artist: "摩登兄弟刘宇宁",
        pic: "https://p1.music.126.net/4cLKRV5pIyaMKSuCoqqntw==/109951166961144397.jpg",
        theme: "pic",
        title: "白羊",
        lrc: "[00:00.000] 作词 : 方文山\n[00:01.000] 作曲 : Bryan（孙伟）\n[00:02.000] 编曲 : 刘苏毅\n[00:03.000] 制作人 : Bryan（孙伟）\n[00:13.55]北方的北风 有谁听懂\n[00:19.43]呼啸而过又是 什么内容\n[00:24.88]厚德可载物  爱要很专注\n[00:30.55]许下一个愿  走自己的路\n[00:35.65]\n[00:36.20]镖局的镖旗 谁来护送\n[00:41.56]故事里的人物  都在途中\n[00:46.82]这天道酬勤  问谁还清醒\n[00:52.82]与义气为邻 我豪气干云\n[00:58.17]\n[00:58.79]雪融了阴霾 虎啸春来\n[01:04.07]我在天地间豪迈 谁来精采\n[01:09.71]英雄气慨 热血涌了上来\n[01:15.20]这里的故事  变成传说 存在\n[01:23.56]\n[01:23.71]北方的北风 有谁听懂\n[01:25.08]呼啸而过是 什么内容\n[01:26.55]厚德可载物  爱要很专注\n[01:28.02]许一个愿  走自己的路\n[01:29.26]\n[01:29.94]镖局的镖旗 谁来护送\n[01:30.76]故事里的人物  都在途中\n[01:32.41]这天道酬勤  问谁还清醒\n[01:33.85]与义气为邻 我豪气干云\n[01:35.07]\n[01:35.19]我横渡沧海  去过了悬崖\n[01:37.89]欣赏过最美的 繁花盛开\n[01:40.43]这陌生的险境远在  千里外\n[01:42.85]而我的悠哉  已自成一派\n[01:45.80]\n[01:46.06]镖局的镖旗 谁来护送\n[01:51.56]故事里的人物  都在途中\n[01:56.45]这天道酬勤  问谁还清醒\n[02:02.54]与义气为邻 我豪气干云\n[02:08.22]\n[02:08.42]雪融了阴霾 虎啸春来\n[02:13.88]我在天地间豪迈 谁来精采\n[02:19.37]英雄气慨 热血涌了上来\n[02:25.01]这里的故事  变成传说 存在\n[02:33.09]\n[02:33.59]雪融了阴霾 虎啸春来\n[02:38.99]我在山水间留白 停止感慨\n[02:44.57]排山倒海  迎接新的世代\n[02:53.13]等结局精彩 谁都不准 离开\n[03:02.67]\n[03:25.44]\n[03:25.622] 吉他 : 刘苏毅\n[03:26.200] 和声 : 曾婕\n[03:26.778] 二胡 : 胡宸\n[03:27.356] 笛子 : 石磊\n[03:27.934] 箫 : 石磊\n[03:28.512] 古筝 : 周桃桃\n[03:29.090] 配唱制作人 : 丁爽\n[03:29.668] 弦乐 : 国际首席爱乐乐团\n[03:30.246] 人声录音 : 王倩倩\n[03:30.824] 人声录音室 : 横店红点录音棚\n[03:31.402] 混音 : 王路遥\n[03:31.980] 母带 : 王路遥\n[03:32.558] 监制 : Bryan（孙伟）\n[03:33.136] 音乐制作 : The U.M.C\n[03:33.714] 统筹 : 高航\n[03:34.292] 音乐营销 : 奔跑怪物\n[03:34.870] （未经许可，不得翻唱或使用）\n",
      },
      musicList: [],
      url: "",
      bannerList: [],
      currentIndex: 0,
      currentPath: "",
      pathStatus: true,
      navStatus: true,
      audioSt: false,
      scrollType: false,
      playAudio: false,
      taskList: [],
    };
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.currentPath = val.path;
        const paths = ["/discovery", "/playlists", "/songs", "/mvs"];
        this.pathStatus = paths.includes(val.path); // 悬浮显示页面
      },
      // 深度观察监听
      deep: true,
      // 初始也执行
      immediate: true,
    },
  },
  created() {
    this.getBanner();
    this.currentPath = this.$route.path;
    // 注册可被弟页面调用的方法
    this.$bus.on("change-nav", (e) => {
      this.changeNav(e);
    });
    this.$bus.on("change-audio", (e) => {
      this.changeAudio(e);
    });
    this.$bus.on("get-song-url", (e) => {
      this.getSongUrl(e.id);
    });
    this.$bus.on("get-song-details", (e) => {
      this.getSongDetails(e.ids);
    });
  },
  mounted() {
    // 返回顶部
    window.addEventListener("scroll", this.handleScroll, true);
  },
  beforeDestroy() {
    // 页面销毁时注销
    this.$bus.off("change-nav", this.changeNav);
    this.$bus.off("change-audio", this.changeAudio);
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 获取歌曲任务队列
    getSongDetails(ids) {
      ids = ids.join(",");
      getSongDetail({ ids }).then((res) => {
        let taskList = [];
        res.privileges.forEach((item) => {
          taskList.push({
            id: item.id,
          });
        });
        res.songs.forEach((e, i) => {
          taskList[i].title = e.name;
          taskList[i].artist = e.ar[0] && e.ar[0].name;
          taskList[i].duration = e.dt;
        });
        // 组件存储数据到vuex
        this.$store.commit("MUSIC_LIST", taskList); // MUSIC_LIST 方法名
        localStorage.setItem("musicList", JSON.stringify(taskList));
      });
    },
    // 获取歌曲链接
    getSongUrl(id) {
      getSongUrl({ id }).then((res) => {
        this.musicUrl.src = res.data[0] && res.data[0].url;
        this.getSongDetail(id);
        // let url = res.data[0].url;
        // this.url = url;
      });
    },
    // 获取歌曲详情
    getSongDetail(id) {
      const ids = typeof id == "object" ? id.join(",") : id;
      getSongDetail({ ids }).then((res) => {
        this.musicUrl.title = res.songs[0] && res.songs[0].name;
        this.musicUrl.artist =
          res.songs[0] && res.songs[0].ar[0] && res.songs[0].ar[0].name;
        this.musicUrl.pic = res.songs[0] && res.songs[0].al.picUrl;
        this.musicUrl.theme = res.songs[0] && res.songs[0].al.picUrl;
        this.getSongLyric(id);
      });
    },
    // 获取歌曲歌词
    getSongLyric(id) {
      getSongLyric({ id }).then((res) => {
        this.musicUrl.lrc = res.lrc.lyric;
        this.musicUrl.id = id;
        // 组件存储数据到vuex
        this.$store.commit("CUR_MUSIC", this.musicUrl); // MUSIC_LIST 方法名
        const musicUrl = JSON.stringify(this.musicUrl);
        localStorage.setItem("curMusic", musicUrl);

        this.$notify({
          title: "歌曲",
          message: "播放成功",
          type: "success",
        });
        // 底部播放器弹起
        this.playAudio = true;
        setTimeout(() => {
          this.playAudio = false;
        }, 2500);
      });
    },
    // 点击返回顶部
    backTop() {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      // 实现滚动效果
      const timer = setInterval(() => {
        document.documentElement.scrollTop =
          document.body.scrollTop =
          top -=
            50;
        if (top <= 0) {
          clearInterval(timer);
        }
      }, 10);
    },
    // 监听高度
    handleScroll() {
      const top =
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.pageXOffset;
      this.scrollType = top > 600;
    },
    // 切换底部音乐栏状态
    changeAudio(e) {
      this.audioSt = e.status;
    },
    // 切换底部音乐栏状态
    changeAudioLock() {
      this.audioSt = !this.audioSt;
      this.$bus.emit("change-audio-st", { status: this.audioSt });
    },
    // 切换左侧导航悬浮状态
    changeNav(e) {
      this.navStatus = e.status;
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
  },
};
</script>

<style scoped>
.min_main {
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
  z-index: 1;
}
.player {
  z-index: 11;
}
.player_item {
  position: fixed;
  width: 100%;
  min-height: 60px;
  background: #f1f3f4;
  box-shadow: 0px -2px 5px 0px #ccc;
  transform: translateY(99%);
  bottom: 0;
  transition: all 0.5s ease;
  z-index: 11;
}
.player:hover .player_item {
  transform: translateY(0%);
}
.b0 {
  transform: translateY(0%);
}
.lock {
  position: fixed;
  bottom: 40px;
  right: 300px;
  width: 50px;
  height: 60px;
  border-radius: 50%;
  background-color: #f1f3f4;
  padding-top: 8px;
  box-shadow: 0px -2px 5px 0px #ccc;
}
.ban_round {
  position: fixed;
  bottom: 32px;
  right: 295px;
  width: 60px;
  height: 35px;
  background-color: #f1f3f4;
}
.back_top {
  position: fixed;
  left: 50%;
  transform: translateX(570px);
  bottom: 180px;
  z-index: 1;
}
</style>
