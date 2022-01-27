<template>
  <!-- v-loading="audio.waiting" -->
  <div class="di main-wrap fcc">
    <!-- 这里设置了ref属性后，在vue组件中，就可以用this.$refs.audio来访问该dom元素 -->
    <audio
      ref="audio"
      class="dn"
      autoplay
      :src="url"
      :preload="audio.preload"
      @play="onPlay"
      @error="onError"
      @waiting="onWaiting"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
    ></audio>

    <div class="w1100 fsbc">
      <!-- 左侧 -->
      <div class="fsc">
        <img :src="music.pic" alt="" class="music_pic" />
        <!-- 内容 -->
        <div class="fes-c mt10">
          <div class="fsbc w300 ml15">
            <div class="c333 fs14 fsc">
              <span>{{ music.title }} -&nbsp;</span>
              <span>{{ music.artist }}</span>
            </div>
            <span class="c999 fs12">{{
              audio.currentTime | formatSecond
            }}</span>
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
          <i class="iconfont icon-shangyishou mr30 fs20"></i>
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
          <i class="iconfont icon-xiayishou mr30 fs20"></i>
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
            :href="url"
            v-show="!controlList.noDownload"
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
        <!-- 列表 -->
        <el-popover
          placement="top"
          title="标题"
          width="520"
          trigger="click"
          offset="200"
        >
          <table class="w100">
            <thead class="w100 mb10">
              <tr class="w100">
                <td class="fs15 c333 bold">
                  播放列表 <span class="c999 fs12">共9首</span>
                </td>
                <td></td>
                <td class="tar">
                  <i class="iconfont icon-shanchu mr5"></i>
                  <span>清空列表</span>
                  <i class="iconfont icon-shanchu1 ml15"></i>
                </td>
              </tr>
            </thead>
            <tbody class="w100">
              <tr class="w100 th_tr">
                <td>
                  <i>1</i>
                  <span class="ml5 c000">雇佣者</span>
                </td>
                <td class="tac">陈奕迅</td>
                <td class="tar bold dt">04:06</td>
                <td class="icon tar">
                  <i class="iconfont icon-jushoucang fs14 mr15"></i>
                  <i
                    class="
                      iconfont
                      fs14
                      icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban
                      mr15
                    "
                  ></i>
                  <i class="iconfont icon-shanchu fs14 mr15"></i>
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
  props: {
    theUrl: {
      type: Object,
      required: true,
    },
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
  name: "VueAudio",
  data() {
    return {
      value1: 0,
      url: "",
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
    };
  },
  watch: {
    theUrl: {
      handler(nv) {
        this.url = nv.src;
        this.music = nv;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
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
.el-popper[x-placement^="top"] {
  top: 270px !important;
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
.th_tr:hover {
  background: #f7f7f7;
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
</style>
