<template>
  <!-- v-loading="audio.waiting" -->
  <div class="di main-wrap fcc">
    <!-- 这里设置了ref属性后，在vue组件中，就可以用this.$refs.audio来访问该dom元素 -->
    <audio
      v-if="music.src && playLock"
      ref="audio"
      class="dn"
      autoplay
      :src="music.src"
      :preload="audio.preload"
      @play="onPlay"
      @error="onError"
      @waiting="onWaiting"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
      @ended="endPlay(music.id)"
    ></audio>

    <div class="w1100 fsbc">
      <!-- 左侧 -->
      <div class="fsc">
        <img :src="music.pic" alt="" class="music_pic" v-if="music.pic" />
        <!-- 内容 -->
        <div class="fes-c mt10">
          <div class="fsbc w300 ml15">
            <div class="c333 fs14 fsc w200 ellipsis1">
              <span v-if="music.title">{{ music.title }} -&nbsp;</span>
              <span v-if="music.artist">{{ music.artist }}</span>
            </div>
            <span class="c999 fs12"
              >{{ audio.currentTime | formatSecond }}/{{
                audio.maxTime | formatSecond
              }}</span
            >
          </div>
          <!-- 音频条 -->
          <el-slider
            v-show="!controlList.noProcess"
            v-model="sliderTime"
            :format-tooltip="formatProcessToolTip"
            @change="changeCurrentTime"
            class="slider"
          ></el-slider>
        </div>
      </div>

      <!-- 中间 -->
      <div class="fsc">
        <el-tooltip class="item" effect="dark" content="上一曲" placement="top">
          <i
            class="iconfont icon-shangyishou mr30 fs20"
            @click="prev(music.id)"
          ></i>
        </el-tooltip>

        <el-tooltip
          class="item mr30"
          effect="dark"
          :content="audio.playing | transPlayPause"
          placement="top"
        >
          <div class="fsc" @click="startPlayOrPause">
            <div v-if="!audio.playing" class="iconfont icon-bofang fs50"></div>
            <div v-else class="iconfont icon-zanting fs40"></div>
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="下一曲" placement="top">
          <i
            class="iconfont icon-xiayishou mr30 fs20"
            @click="next(music.id, curIcon)"
          ></i>
        </el-tooltip>
      </div>

      <!-- 右侧 -->
      <div class="fsc c999">
        <!-- 喜欢 -->
        <el-tooltip class="item" effect="dark" content="喜欢" placement="top">
          <i class="iconfont icon-jushoucang mr30"></i>
        </el-tooltip>
        <!-- 下载 -->
        <el-tooltip class="item" effect="dark" content="下载" placement="top">
          <a
            :href="music.src"
            v-if="!controlList.noDownload && music.src"
            target="_blank"
            class="download mr30"
            download
          >
            <i
              class="
                iconfont
                icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban
              "
            ></i>
          </a>
        </el-tooltip>
        <!-- 进度 -->
        <el-tooltip
          class="item"
          effect="dark"
          :content="audio.speed | transSpeed"
          placement="top"
        >
          <i class="iconfont icon-kuaijin mr30" @click="changeSpeed"></i>
        </el-tooltip>
        <!-- 播放顺序 -->
        <el-tooltip
          class="item"
          effect="dark"
          :content="getplayName(curIcon)"
          placement="top"
        >
          <i
            class="iconfont mr30"
            :class="playIcon[curIcon]"
            @click="setPlayIcon"
          ></i>
        </el-tooltip>
        <!-- 列表 -->
        <el-popover
          placement="top"
          width="520"
          trigger="click"
          offset="200"
          v-model="popListShow"
        >
          <el-empty
            :image-size="130"
            v-if="!musicList.length"
            description="当前任务队列为空，快快去添加吧~"
          ></el-empty>
          <table class="w100" v-else>
            <thead class="w100 mb10">
              <tr class="w100">
                <td class="fs16 c333 bold">
                  播放列表 <span class="c999 fs12">共9首</span>
                </td>
                <td></td>
                <td class="tar fec">
                  <div @click="clearList">
                    <i class="iconfont icon-shanchu mr5"></i>
                    <span>清空列表</span>
                  </div>
                  <i
                    class="iconfont icon-shanchu1 ml15"
                    @click="popListShow = false"
                  ></i>
                </td>
              </tr>
            </thead>

            <tbody class="w100 tabdy_box">
              <tr
                class="w100 th_tr"
                v-for="(item, i) in musicList"
                :class="{ th_tr_active: activeMusic == i }"
                :key="item.id"
                @click="handlePlay(item.id)"
              >
                <td class="w250 ellipsis1">
                  <i>{{ i + 1 }}</i>
                  <span class="ml5 c000">{{ item.title }}</span>
                </td>
                <td class="tac">{{ item.artist }}</td>
                <td class="tar bold dt">
                  {{ item.duration | DurationFilter }}
                </td>
                <td class="icon tar">
                  <i class="iconfont icon-jushoucang fs14 mr15"></i>
                  <i
                    class="iconfont icon-shanchu fs14 mr15"
                    @click.stop="delCurSong(item.id)"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
          <el-tooltip
            slot="reference"
            class="item"
            effect="dark"
            content="列表"
            placement="top"
          >
            <i class="iconfont icon-liebiao mr30"></i>
          </el-tooltip>
        </el-popover>

        <!-- 音量 -->
        <div class="fsc">
          <el-tooltip class="item" effect="dark" content="音量" placement="top">
            <div class="fsc" @click="startMutedOrNot">
              <i
                v-if="volume != 0 && !audio.muted"
                class="iconfont icon-yinliang"
              ></i>
              <i v-else class="iconfont icon-24gl-volumeCross"></i>
            </div>
          </el-tooltip>
          <el-slider
            v-show="!controlList.noVolume"
            v-model="volume"
            :format-tooltip="formatVolumeToolTip"
            @change="changeVolume"
            class="slider2"
          ></el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
function realFormatSecond(second) {
  var secondType = typeof second;
  if (secondType === "number" || secondType === "string") {
    second = parseInt(second);

    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;

    return (
      // hours + ":" + ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2)
      ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2)
    );
  } else {
    return "00:00";
  }
}

export default {
  name: "Aplayer",
  props: {
    theSpeeds: {
      type: Array,
      default() {
        return [1, 1.5, 2];
      },
    },
    theControlList: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      value1: 0,
      audio: {
        currentTime: 0,
        maxTime: 0,
        playing: false,
        muted: false,
        speed: 1,
        waiting: true,
        preload: "auto",
      },

      sliderTime: 0,
      volume: 100,
      speeds: this.theSpeeds,

      controlList: {
        // 不显示下载
        noDownload: false,
        // 不显示静音
        noMuted: false,
        // 不显示音量条
        noVolume: false,
        // 不显示进度条
        noProcess: false,
        // 只能播放一个
        onlyOnePlaying: false,
        // 不要快进按钮
        noSpeed: false,
      },
      music: {},
      activeMusic: 0,
      popListShow: false,
      playIcon: {
        order: "icon-hanhan-01-01", // 顺序
        random: "icon-suijibofang", // 随机
        theCirculation: "icon-24gl-repeatOnce2", // 单曲循环
        loop: "icon-24gl-repeat2", // 顺序
      },
      playLock: true,
    };
  },
  computed: {
    // 监听vuex里的数据变化
    ...mapGetters({
      theUrl: "curMusic",
      musicList: "musicList",
    }),
    ...mapState({
      curIcon: (state) => state.music.curIcon,
    }),
  },
  watch: {
    theUrl: {
      handler(nv) {
        this.music = nv;
        this.activeMusic = this.musicList.findIndex((e) => e.id == nv.id);
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // 初始化赋值
    // this.theUrl = this.$store.getters.curMusic
    //   ? this.$store.getters.curMusic
    //   : {};
    // this.musicList = this.$store.getters.musicList
    //   ? this.$store.getters.musicList
    //   : [];
    // console.log(1111111111);
    // console.log(
    //   this.$store,
    //   "this.$store.state.music.curIcon45666666666666666"
    // );
    // this.curIcon = this.$store.state.music.curIcon;
  },
  methods: {
    // 歌曲播放完毕
    endPlay(id) {
      this.next(id, this.curIcon);
    },
    // 改变播放顺序
    setPlayIcon() {
      let e = this.curIcon;
      if (e == "order") {
        e = "random";
      } else if (e == "random") {
        e = "theCirculation";
      } else if (e == "theCirculation") {
        e = "loop";
      } else if (e == "loop") {
        e = "order";
      }
      this.$store.commit("CUR_ICON", e); // MUSIC_LIST 方法名
      localStorage.setItem("curIcon", e);
    },
    // 当前播放顺序
    getplayName(e) {
      switch (e) {
        case "order":
          return "顺序";
        case "random":
          return "随机";
        case "theCirculation":
          return "单曲循环";
        case "loop":
          return "循环";
      }
    },
    // 删除当前歌曲
    delCurSong(id) {
      const i = this.musicList.findIndex((e) => e.id == id);
      this.musicList.splice(i, 1);
      // 组件存储数据到vuex
      this.$store.commit("MUSIC_LIST", this.musicList); // MUSIC_LIST 方法名
      localStorage.setItem("musicList", JSON.stringify(this.musicList));
    },
    // 播放点击歌曲
    handlePlay(id) {
      this.$bus.emit("get-song-url", { id });
    },
    // 清空任务列表
    clearList() {
      this.$store.commit("MUSIC_LIST", []); // MUSIC_LIST 方法名
      localStorage.setItem("musicList", JSON.stringify([]));
    },
    // 上一曲
    prev(id) {
      if (!this.musicList.length) {
        this.$message.warning("当前任务队列无内容，请先添加");
        return;
      }
      const i = this.musicList.findIndex((e) => e.id == id);
      if (i == 0) {
        this.$message({
          showClose: true,
          message: "当前已经是第一曲",
          type: "warning",
          duration: 0,
        });
        return;
      }

      const newId = this.musicList[i - 1].id;
      this.$bus.emit("get-song-url", { id: newId });
    },
    // 下一曲
    next(id, e) {
      if (!this.musicList.length) {
        this.$message.warning("当前任务队列无内容，请先添加");
        return;
      }
      // 判断时什么播放顺序
      let newId = "";
      // 顺序
      if (e == "order") {
        const i = this.musicList.findIndex((e) => e.id == id);
        if (i == this.musicList.length - 1) {
          this.$message({
            showClose: true,
            message: "当前已经是最后一曲",
            type: "warning",
            duration: 0,
          });
          return;
        }
        newId = this.musicList[i + 1].id;
        // 随机
      } else if (e == "random") {
        const i2 = this.musicList.findIndex((e) => e.id == id);
        const i = Math.floor(
          Math.random() * (this.musicList.length - 1 - 0 + 1) + 0
        );
        if (i2 == i) {
          newId = this.musicList[i + 1].id;
        } else {
          newId = this.musicList[i].id;
        }
        // 单曲循环
      } else if (e == "theCirculation") {
        this.playLock = false;
        this.$nextTick(() => {
          this.playLock = true;
        });
        return;
        // 循环
      } else if (e == "loop") {
        const i = this.musicList.findIndex((e) => e.id == id);
        if (i == this.musicList.length - 1) {
          newId = this.musicList[0].id;
        } else {
          newId = this.musicList[i + 1].id;
        }
      }
      this.$bus.emit("get-song-url", { id: newId });
    },
    setControlList() {
      let controlList = this.theControlList.split(" ");
      controlList.forEach((item) => {
        if (this.controlList[item] !== undefined) {
          this.controlList[item] = true;
        }
      });
    },
    // 切换进度
    changeSpeed() {
      let index = this.speeds.indexOf(this.audio.speed) + 1;
      this.audio.speed = this.speeds[index % this.speeds.length];
      this.$refs.audio.playbackRate = this.audio.speed;
    },
    // 是否静音
    startMutedOrNot() {
      this.$refs.audio.muted = !this.$refs.audio.muted;
      this.audio.muted = this.$refs.audio.muted;
    },
    // 音量条toolTip
    formatVolumeToolTip(index) {
      return "音量: " + index;
    },
    // 进度条toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt((this.audio.maxTime / 100) * index);
      return "进度: " + realFormatSecond(index);
    },
    // 音量改变
    changeVolume(index = 0) {
      this.$refs.audio.volume = index / 100;
      this.volume = index;
    },
    // 播放跳转
    changeCurrentTime(index) {
      console.log(this.$refs.audio.currentTime, "this.$refs.audio.currentTime");
      console.log(index, "5466666666");
      this.$refs.audio.currentTime = parseInt(
        (index / 100) * this.audio.maxTime
      );
    },
    startPlayOrPause() {
      return this.audio.playing ? this.pausePlay() : this.startPlay();
    },
    // 开始播放
    startPlay() {
      this.$refs.audio.play();
    },
    // 暂停
    pausePlay() {
      this.$refs.audio.pause();
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false;
    },
    // 当发生错误, 就出现loading状态
    onError() {
      this.audio.waiting = true;
    },
    // 当音频开始等待
    onWaiting(res) {
      console.log(res);
    },
    // 当音频开始播放
    onPlay(res) {
      console.log(res);
      this.audio.playing = true;
      this.audio.loading = false;

      if (!this.controlList.onlyOnePlaying) {
        return;
      }

      let target = res.target;

      let audios = document.getElementsByTagName("audio");

      [...audios].forEach((item) => {
        if (item !== target) {
          item.pause();
        }
      });
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      // console.log('timeupdate')
      // console.log(res)
      this.audio.currentTime = res.target.currentTime;
      this.sliderTime = parseInt(
        (this.audio.currentTime / this.audio.maxTime) * 100
      );
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      console.log("loadedmetadata");
      console.log(res);
      this.audio.waiting = false;
      this.audio.maxTime = parseInt(res.target.duration);
    },
  },
  filters: {
    formatSecond(second = 0) {
      return realFormatSecond(second);
    },
    transPlayPause(value) {
      return value ? "暂停" : "播放";
    },
    transMutedOrNot(value) {
      return value ? "放音" : "静音";
    },
    transSpeed(value) {
      return "快进: x" + value;
    },
  },
  created() {
    this.setControlList();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-wrap {
  padding: 0 45px;
  width: 100%;
  /* height: 80px; */
}
.slider {
  display: inline-block;
  width: 300px;
  position: relative;
  /* top: 14px; */
  margin-left: 15px;
}
.slider2 {
  display: inline-block;
  width: 50px;
  position: relative;
  /* top: 14px; */
  margin-left: 10px;
}

.di {
  display: inline-block;
}

.download {
  color: #999;
}

.dn {
  display: none;
}
.w1100 {
  position: relative;
  width: 1100px;
}
.music_pic {
  width: 60px;
  height: 60px;
}
.w300 {
  width: 300px;
}
.fs50 {
  font-size: 34px !important;
}
.fs40 {
  font-size: 30px !important;
}
</style>
<style>
.el-slider__runway {
  height: 3px !important;
}
.el-slider__bar {
  height: 3px !important;
  background-color: #e08c82 !important;
}
.el-slider__button-wrapper {
  height: 18px !important;
  width: 18px !important;
  top: -8px !important;
}
.el-slider__button {
  width: 8px !important;
  height: 8px !important;
  border: 2px solid #e08c82 !important;
}
.tac {
  text-align: center;
}
.tal {
  text-align: left;
}
.tar {
  text-align: right;
}
table {
  border-collapse: collapse;
}
.th_tr {
  height: 42px;
  cursor: pointer;
  line-height: 42px;
}
.th_tr:hover,
.th_tr_active {
  background-color: rgba(224, 140, 130, 0.3);
}
.th_tr:hover .dt {
  display: none;
}
.th_tr:hover .icon {
  display: block;
}
.icon {
  display: none;
}
.w200 {
  width: 200px;
}
.el-popper[x-placement^="top"] {
  max-height: 400px !important;
  overflow-y: scroll;
}
::-webkit-scrollbar {
  display: none;
}
.w250 {
  width: 250px;
}
</style>
