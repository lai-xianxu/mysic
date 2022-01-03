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
    <el-tabs
      v-model="activeIndex"
      @tab-click="tabClick"
    >
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
        :label="`评论(${playTotal + hotTotal})`"
        name="2"
      >
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">精彩评论<span class="number">({{hotTotal}})</span></p>
          <div class="comments-wrap">
            <div
              class="item"
              v-for="(item,index) in hotComments"
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
                  <span class="name">{{item.user && item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div
                  class="re-content"
                  v-if="item.beReplied.length"
                >
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{item.time | dataFormat}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">最新评论<span class="number">({{playTotal}})</span></p>
          <div class="comments-wrap">
            <div
              class="item"
              v-for="(item,index) in playComments"
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
                  <span class="name">{{item.user && item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div
                  class="re-content"
                  v-if="item.beReplied.length"
                >
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{item.time | dataFormat}}</div>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { detail, playlistAll, hotComment, playlistComment } from "@/api/detail";
import { getSongUrl } from "@/api/discovery";
export default {
  name: "playlist",
  data() {
    return {
      activeIndex: "1",
      pageIndex: 1,
      pageSize: 10,
      // 总条数
      total: 0,
      // 页码
      page: 1,
      songInfo: {},
      songList: [],
      hotComments: [],
      hotTotal: 0,
      playTotal: 0,
      playComments: [],
    };
  },
  created() {
    this.getPlayInfo();
  },
  methods: {
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.playlistComment();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.playlistComment();
    },
    // 获取歌单
    getPlayInfo() {
      const id = this.$route.query.id;
      detail({
        id,
      }).then((res) => {
        this.songInfo = res.playlist;
        this.playlistAll();
        this.getHotComment();
        this.playlistComment();
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
        this.$notify({
          title: "歌曲",
          message: "播放成功",
          type: "success",
        });
        let url = res.data[0].url;
        this.$parent.musicUrl = url;
      });
    },
    // 获取歌曲热门评论
    getHotComment() {
      hotComment({
        id: this.$route.query.id,
        type: 2,
        limit: 10,
        offset: 0,
      }).then((res) => {
        this.hotComments = res.hotComments;
        this.hotTotal = res.total;
      });
    },
    // 获取歌单所有评论
    playlistComment() {
      playlistComment({
        id: this.$route.query.id,
        limit: this.pageSize,
        offset: (this.pageIndex - 1) * this.pageSize,
      }).then((res) => {
        this.playTotal = res.total;
        this.playComments = res.comments;
      });
    },
    // tabs标签被选中触发
    tabClick(e) {
      console.log(this.activeIndex, "this.activeIndex");
      if (this.activeIndex == 2) {
      }
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
