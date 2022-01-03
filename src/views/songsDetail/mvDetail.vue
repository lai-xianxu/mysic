<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">{{mvInfo.name}}</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
          autoplay
          :src="mvUrl"
        ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img
              :src="artist.img1v1Url + '?param=70y70'"
              alt=""
            />
          </div>
          <span class="name">{{artist.name}}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{mvInfo.name}}</h2>
          <span class="date">发布：{{mvInfo.publishTime}}</span>
          <span class="number">播放：{{mvInfo.playCount | playNumFilter}}次</span>
          <p class="desc">{{mvInfo.desc}}</p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div
        class="comment-wrap"
        v-if="hotComments.length"
      >
        <p class="title">精彩评论<span class="number">({{hotComments.length}})</span></p>
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
                <span class="name">{item.beReplied[0].user.nickname}}：</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{item.time | dataFormat}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">最新评论<span class="number">({{total}})</span></p>
        <div class="comments-wrap">
          <div
            class="item"
            v-for="(item,index) in comments"
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
        :total="total"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 20, 40, 100]"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div
            class="item"
            v-for="item in simiMvList"
            :key="item.id"
          >
            <div class="img-wrap">
              <img
                :src="item.cover + '?param=180y94'"
                alt=""
              />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount}}</div>
              </div>
              <span class="time">{{item.duration | DurationFilter}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMvUrl,
  getMvSimi,
  getMvDetail,
  getArtistsInfo,
  getMvComment,
} from "@/api/detail";
export default {
  name: "mv",
  data() {
    return {
      // 总条数
      total: 0,
      // 页码
      pageSize: 10,
      pageIndex: 1,
      // 页容量
      limit: 10,
      mvUrl: "",
      simiMvList: [],
      mvInfo: {},
      artistsId: "",
      artist: {},
      hotComments: [],
      comments: [],
    };
  },
  mounted() {
    this.getMvUrl();
    this.getMvSimi();
    this.getMvDetail();
    this.getMvComment();
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 获取mv地址
    getMvUrl() {
      getMvUrl({
        id: this.$route.query.id,
      }).then((res) => {
        this.mvUrl = res.data.url;
      });
    },
    // 获取相关mv
    getMvSimi() {
      getMvSimi({
        mvid: this.$route.query.id,
      }).then((res) => {
        this.simiMvList = res.mvs;
      });
    },
    // 获取mv信息
    getMvDetail() {
      getMvDetail({
        mvid: this.$route.query.id,
      }).then((res) => {
        this.mvInfo = res.data;
        this.artistsId = res.data.artists[0].id;
        this.getArtistsInfo();
      });
    },
    // 获取歌手部分信息
    getArtistsInfo() {
      getArtistsInfo({
        id: this.artistsId,
      }).then((res) => {
        this.artist = res.artist;
      });
    },
    // 获取mv评论
    getMvComment() {
      getMvComment({
        id: this.$route.query.id,
        limit: this.pageSize,
        offset: (this.pageIndex - 1) * this.pageSize,
      }).then((res) => {
        this.total = res.total;
        this.hotComments = res.hotComments || [];
        this.comments = res.comments;
      });
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getMvComment();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMvComment();
    },
  },
};
</script>

<style></style>
