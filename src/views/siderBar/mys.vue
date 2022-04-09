<template>
  <div class="discovery-container">
    <!-- 我喜欢的音乐 -->
    <div
      class="top-card"
      @click="jumpPlayDetail(creatList[0].id)"
      v-if="creatList.length"
    >
      <div class="icon-wrap">
        <img :src="creatList[0].coverImgUrl + '?param?160y160'" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">我喜欢的音乐</div>
        <div class="fsc mt20 cfff">
          <el-avatar
            slot="reference"
            :size="30"
            fit="cover"
            :src="creatList[0].creator && creatList[0].creator.avatarUrl"
            class="mr15 cpr"
          ></el-avatar>
          <i>{{ creatList[0].creator && creatList[0].creator.nickname }}</i>
          <span class="ml15"
            >创建时间：{{ creatList[0].createTime | dataFormat }}</span
          >
        </div>
        <div class="fsc mt20 cfff">
          <span>歌曲： {{ creatList[0].trackCount }}</span>
          <span>播放： {{ creatList[0].playCount | playNumFilter }}</span>
        </div>
      </div>
      <img :src="creatList[0].coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>

    <!-- 我创建的音乐 -->
    <div class="recommend mt30">
      <h3 class="title">我创建的歌单</h3>
      <div class="items">
        <div
          class="item"
          v-for="item in creatList.slice(1)"
          :key="item.id"
          @click="jumpPlayDetail(item.id)"
        >
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">创建：{{ item.createTime | dataFormat }}</span>
            </div>
            <div class="desc-wrap2 fec fs14">
              <i class="el-icon-headset mr5"></i>
              <span>{{ item.playCount | playNumFilter }}</span>
            </div>
            <img :src="item.coverImgUrl + '?param=200y200'" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">我收藏的歌单</h3>
      <div class="items">
        <div
          class="item"
          v-for="item in collList"
          :key="item.id"
          @click="jumpPlayDetail(item.id)"
        >
          <div class="fsc">
            <div class="img-wrap">
              <img :src="item.coverImgUrl + '?param=80y80'" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <div class="song-wrap">
              <div class="song-name ellipsis2">{{ item.name }}</div>
              <div class="singer">创建：{{ item.createTime | dataFormat }}</div>
            </div>
          </div>
          <div class="fsc c999 fs14">
            <i class="el-icon-headset mr5"></i>
            <span>{{ item.playCount | playNumFilter }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserPlaylist } from '@/api/use';
export default {
  name: 'mys',
  data() {
    return {
      list: [],
      creatList: [],
      collList: [],
    };
  },
  created() {
    this.getUserPlaylist();
  },
  methods: {
    //   获取用户歌单
    getUserPlaylist() {
      if (!this.$store.getters.user_info) {
        this.$notify({
          title: '未登录',
          message: '请先登录，登录后方可访问',
          type: 'warning',
          duration: 0,
        });
        return;
      }
      getUserPlaylist({ uid: this.$store.getters.user_info.userId }).then(
        (res) => {
          this.list = res.playlist;
          res.playlist.forEach((e) => {
            if (!e.subscribed) {
              this.creatList.push(e);
            } else {
              this.collList.push(e);
            }
          });
        }
      );
    },
    // 跳转歌单详情页
    jumpPlayDetail(id) {
      this.$router.push({
        path: '/playsDetail',
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped>
.discovery-container .top-card {
  padding: 20px;
  height: 200px;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  cursor: pointer;
}

.discovery-container .top-card .icon-wrap {
  margin-right: 20px;
  z-index: 1;
}

.discovery-container .top-card .icon-wrap img {
  width: 160px;
  height: 160px;
}

.discovery-container .top-card .content-wrap {
  z-index: 1;
}

.discovery-container .top-card .content-wrap .tag {
  color: #dfac67;
  border: 1px solid #dfac67;
  /* width: 100px; */
  height: 30px;
  text-align: center;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
  padding: 0 10px;
}

.discovery-container .top-card .content-wrap .title {
  color: white;
  padding-top: 10px;
}

.discovery-container .top-card .content-wrap .info {
  color: #888482;
  font-size: 14px;
  padding-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}

.discovery-container .top-card .bg {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  filter: blur(20px);
}

.discovery-container .top-card .bg-mask {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
