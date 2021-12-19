<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img
          :src="songInfo.coverImgUrl + '?param=230y230'"
          alt=""
        />
      </div>
      <div class="info-wrap">
        <p class="title">{{songInfo.name}}</p>
        <div class="author-wrap">
          <img
            class="avatar"
            :src="songInfo.creator && songInfo.creator.avatarUrl + '?param=35y35'"
            alt=""
          />
          <span class="name">{{songInfo.creator && songInfo.creator.nickname}}</span>
          <span class="time">{{songInfo.creator && songInfo.createTime | dataFormat}}创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li
              v-for="(item,i) in songInfo.tags"
              :key="i"
            >{{item}}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{songInfo.description}}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane
        :label="`歌曲列表(${songList.length})`"
        name="1"
      >
        <table class="el-table playlit-table">
          <thead>
            <th>#</th>
            <th>封面</th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              class="el-table__row"
              v-for="(item,index) in songList"
              :key="item.id"
              @click="getSongUrl(item.id)"
            >
              <td>{{index + 1}}</td>
              <td>
                <div class="img-wrap">
                  <img
                    :src="item.al.picUrl + '?param=70y70'"
                    alt=""
                  />
                  <span class="iconfont icon-play"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap wsnw">
                    <span>{{item.name}}</span>
                    <span class="iconfont icon-mv"></span>
                  </div>
                  <!-- 二级标题 -->
                  <span>{{item.alia[0]}}</span>
                </div>
              </td>
              <td>
                <span
                  v-for="(k,i) in item.ar"
                  :key="i"
                >
                  <span v-if="i < 4">{{k.name}}
                    <span v-if="i !== item.ar.length - 1 && i !== 3">/</span>
                  </span>
                </span>
              </td>
              <td>{{ item.al.name }}</td>
              <td>{{item.dt | DurationFilter}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane
        label="评论(66)"
        name="2"
      >
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">精彩评论<span class="number">(666)</span></p>
          <div class="comments-wrap">
            <div class="item">
              <div class="icon-wrap">
                <img
                  src="../../assets/avatar.jpg"
                  alt=""
                />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">爱斯基摩：</span>
                  <span class="comment">谁说的，长大了依旧可爱哈</span>
                </div>
                <div class="re-content">
                  <span class="name">小苹果：</span>
                  <span class="comment">还是小时候比较可爱</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">最新评论<span class="number">(666)</span></p>
          <div class="comments-wrap">
            <div class="item">
              <div class="icon-wrap">
                <img
                  src="../../assets/avatar.jpg"
                  alt=""
                />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">爱斯基摩：</span>
                  <span class="comment">谁说的，长大了依旧可爱哈</span>
                </div>
                <div class="re-content">
                  <span class="name">小苹果：</span>
                  <span class="comment">还是小时候比较可爱</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
            <div class="item">
              <div class="icon-wrap">
                <img
                  src="../../assets/avatar.jpg"
                  alt=""
                />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">爱斯基摩：</span>
                  <span class="comment">谁说的，长大了依旧可爱哈</span>
                </div>
                <div class="re-content">
                  <span class="name">小苹果：</span>
                  <span class="comment">还是小时候比较可爱</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
            <div class="item">
              <div class="icon-wrap">
                <img
                  src="../../assets/avatar.jpg"
                  alt=""
                />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">爱斯基摩：</span>
                  <span class="comment">谁说的，长大了依旧可爱哈</span>
                </div>
                <div class="re-content">
                  <span class="name">小苹果：</span>
                  <span class="comment">还是小时候比较可爱</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="5"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { detail, playlistAll } from "@/api/detail";
import { getSongUrl } from "@/api/discovery";
export default {
  name: "playlist",
  data() {
    return {
      activeIndex: "1",
      // 总条数
      total: 0,
      // 页码
      page: 1,
      songInfo: {},
      songList: [],
    };
  },
  created() {
    this.getPlayInfo();
  },
  methods: {
    // 获取歌单
    getPlayInfo() {
      const id = this.$route.query.id;
      detail({
        id,
      }).then((res) => {
        this.songInfo = res.playlist;
        this.playlistAll();
      });
    },
    // 获取歌单列表所有歌曲
    playlistAll() {
      const idList = this.songInfo.trackIds.map((x) => x.id);
      const ids = idList.join(",");
      playlistAll({
        ids,
      }).then((res) => {
        this.songList = res.songs;
      });
    },
    // 获取歌曲链接
    getSongUrl(id) {
      getSongUrl({ id }).then((res) => {
        let url = res.data[0].url;
        this.$parent.musicUrl = url;
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style scoped>
.playlit-table th {
  text-align: left !important;
  height: 30px;
}
.el-table__row {
  height: 100px;
}
</style>
