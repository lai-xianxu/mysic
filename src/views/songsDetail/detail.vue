<template>
  <div class="container fsbs fs14">
    <div class="left">
      <div class="fss">
        <!-- 唱片 -->
        <div class="player_con" :class="{ playing: isplaying }">
          <img src="../../assets/player_bar.png" class="play_bar" />
          <!-- 黑胶碟片 -->
          <img src="../../assets/disc.png" class="disc autoRotate" />
          <img
            class="cover autoRotate"
            :src="song.al.picUrl"
            v-if="song.al && song.al.picUrl"
          />
        </div>
        <!-- 歌曲详情 -->
        <div class="center ml500">
          <div class="fsc">
            <div class="tag cfff">单曲</div>
            <div class="fs20 ml20">{{ song.name }}</div>
          </div>
          <p class="c999 ml60 fs14 mt5" v-if="song.alia && song.alia.length">
            {{ song.alia[0] }}
          </p>
          <p v-if="song.ar && song.ar.length" class="mt20">
            歌手：
            <span v-for="(item, index) in song.ar" :key="item.id" class="c_main"
              >{{ item.name
              }}<span v-if="index < song.ar.length - 1"> / </span></span
            >
          </p>
          <p class="mt10">
            所属专辑：<span class="c_main">{{ song.al && song.al.name }}</span>
          </p>
          <div class="fsc mt10">
            <el-button
              type="danger"
              icon="el-icon-video-play"
              size="mini"
              @click.stop="onPlay"
              >播放</el-button
            >
          </div>
          <p
            v-html="lyric"
            class="lyric_box"
            :class="{ h_300: btnLock && btnShow }"
            ref="lyricRef"
            id="aaa"
          ></p>
          <p
            class="c_main cpr"
            v-if="btnLock && btnShow"
            @click.stop="btnShow = false"
          >
            展开
          </p>
          <p
            class="c_main cpr"
            v-if="btnLock && !btnShow"
            @click.stop="btnShow = true"
          >
            收起
          </p>
        </div>
      </div>
      <!-- 评论 -->
      <div class="playlist-container">
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">
            精彩评论<span class="number">({{ hotTotal }})</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in hotComments" :key="index">
              <div class="icon-wrap">
                <img
                  :src="item.user && item.user.avatarUrl + '?param=50y50'"
                  alt=""
                />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name"
                    >{{ item.user && item.user.nickname }}：</span
                  >
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}：</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time | dataFormat }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">
            最新评论<span class="number">({{ playTotal }})</span>
          </p>
          <div class="comments-wrap">
            <div
              class="item"
              v-for="(item, index) in playComments"
              :key="index"
            >
              <div class="icon-wrap">
                <img
                  :src="item.user && item.user.avatarUrl + '?param=50y50'"
                  alt=""
                />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name"
                    >{{ item.user && item.user.nickname }}：</span
                  >
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}：</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time | dataFormat }}</div>
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
          :total="playTotal"
          :current-page="pageIndex"
          :page-size="pageSize"
          :page-sizes="[10, 20, 40, 100]"
        >
        </el-pagination>
      </div>
    </div>
    <div class="mv-container">
      <div class="mv-recommend">
        <h3 class="title">相关推荐</h3>
        <div class="mvs">
          <div class="items">
            <div
              class="item"
              v-for="item in simiSong"
              :key="item.id"
              @click.stop="changeSong(item.id)"
            >
              <div class="img-wrap">
                <img
                  v-if="item.album"
                  :src="item.album.picUrl + '?param=180y94'"
                  alt=""
                />
                <span class="iconfont icon-play"></span>
                <span class="time">{{ item.duration | DurationFilter }}</span>
              </div>
              <div class="info-wrap">
                <div class="name">{{ item.name }}</div>
                <div class="singer" v-if="item.artists && item.artists.length">
                  <span v-for="(e, i) in item.artists" :key="e.id"
                    >{{ e.name
                    }}<span v-if="i < item.artists.length - 1"> / </span></span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSongDetail,
  getlyric,
  getCommitMusic,
  getSimiSong,
} from '@/api/detail';
export default {
  name: 'detail',
  data() {
    return {
      song: {},
      ric: '',
      btnLock: false,
      btnShow: true,
      pageSize: 10,
      pageIndex: 1,
      hotComments: [],
      hotTotal: '',
      playTotal: 0,
      playComments: [],
      simiSong: [],
      songId: '',
    };
  },
  watch: {
    '$store.getters.curMusic': {
      handler(val) {
        this.songId = val.id;
        this.getSongDetail();
        this.getlyric();
        this.getCommitMusic();
        this.getSimiSong();
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    lyric() {
      return this.ric.replace(/\n/g, '<br/>');
    },
    isplaying() {
      return this.$store.getters.playing;
    },
  },
  // mounted() {
  //   this.getSongDetail();
  //   this.getlyric();
  //   this.getCommitMusic();
  //   this.getSimiSong();
  // },
  methods: {
    // 更换mv
    changeSong(id) {
      this.songId = id;
      this.$bus.emit('get-song-url', { id });
      this.getSongDetail();
      this.getlyric();
      this.getCommitMusic();
      this.getSimiSong();
    },
    // 播放
    onPlay() {
      this.$bus.emit('start-play');
    },
    //   获取歌曲详情
    getSongDetail() {
      getSongDetail({ ids: this.songId }).then((res) => {
        this.song = res.songs[0];
      });
    },
    // 获取歌曲歌词
    getlyric() {
      getlyric({ id: this.songId }).then((res) => {
        let arr = res.lrc.lyric.split('[');
        let arr2 = [];
        arr.forEach((e) => {
          if (e) {
            arr2.push(e.substring(e.indexOf(']') + 1));
          }
        });
        // this.ric = arr2.join('').replace(new RegExp(/( )/g), '');
        this.ric = arr2.join('');
        this.onWatchCardHeight();
      });
    },
    // 判断是否展开收起
    onWatchCardHeight() {
      setTimeout(() => {
        this.btnLock = this.$refs.lyricRef.scrollHeight > 300;
      }, 50);
    },
    // 获取歌曲评论
    getCommitMusic() {
      getCommitMusic({
        id: this.songId,
        limit: this.pageSize,
        offset: (this.pageIndex - 1) * this.pageSize,
      }).then((res) => {
        this.playComments = res.comments;
        this.hotComments = res.hotComments;
        this.hotTotal = res.hotComments.length;
        this.playTotal = Number(res.total);
      });
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getCommitMusic();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCommitMusic();
    },
    // 获取相似音乐
    getSimiSong() {
      getSimiSong({ id: this.songId }).then((res) => {
        this.simiSong = res.songs;
      });
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
  width: 1100px;
  padding: 0 20px;
}
.left {
  max-width: 800px;
}
.center .tag {
  background-color: #cf1717;
  font-size: 12px;
  padding: 3px 5px;
  border-radius: 4px;
}
.ml60 {
  margin-left: 54px;
}
.c_main {
  color: #e08c82;
}
.lyric_box {
  margin-top: 40px;
  line-height: 25px;
  height: auto;
}
.h_300 {
  height: 300px;
  overflow: hidden;
}
.ml500 {
  margin-left: 400px;
}

/* 唱片css */
.player_con {
  position: absolute;
  left: 40px;
  top: 12px;
  transform: scale(0.9);
}

.cover {
  position: absolute;
  left: 56px;
  top: 56px;
  width: 145px;
  height: 145px;
  border-radius: 75px;
  z-index: 8;
}
/* 旋转的动画 */

@keyframes Rotate {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(360deg);
  }
}

/* 旋转的类名 */

.autoRotate {
  animation-name: Rotate;
  animation-iteration-count: infinite;
  animation-play-state: paused;
  animation-timing-function: linear;
  animation-duration: 5s;
}

/* 是否正在播放 */

.player_con.playing .disc,
.player_con.playing .cover {
  animation-play-state: running;
}

.play_bar {
  position: absolute;
  left: 150px;
  top: -50px;
  z-index: 10;
  transform: rotate(-25deg);
  transform-origin: 12px 12px;
  transition: 1s;
}

/* 播放杆 转回去 */

.player_con.playing .play_bar {
  transform: rotate(0);
}
</style>
