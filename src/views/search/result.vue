<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{$route.query.keywords}}</h2>
      <span class="sub-title">找到{{total}}个结果</span>
    </div>
    <el-tabs
      v-model="activeIndex"
      @tab-click="changeTab"
    >
      <el-tab-pane
        label="歌曲"
        name="1"
      >
        <table class="el-table">
          <thead>
            <th></th>
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
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span
                      v-if="item.mvid != 0"
                      class="iconfont icon-mv"
                    ></span>
                  </div>
                  <!-- 二级标题 -->
                  <span v-if="item.alias.length">{{item.alias[0]}}</span>
                </div>
              </td>
              <td>{{item.artists[0].name}}</td>
              <td>{{item.album.name}}</td>
              <td>{{item.duration | DurationFilter}}</td>
            </tr>

          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane
        label="歌单"
        name="1000"
      >
        <div class="items">
          <div
            class="item"
            v-for="item in playlistsList"
            :key="item.id"
            @click="jumpPlayDetail(item.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount | playNumFilter}}</span>
              </div>
              <img
                :src="item.coverImgUrl + '?param=200y200'"
                alt=""
              />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="MV"
        name="1004"
      >
        <div class="items mv">
          <div
            class="item"
            v-for="item in mvList"
            :key="item.id"
            @click="jumpMVDetail(item.id)"
          >
            <div class="img-wrap">
              <img
                :src="item.cover + '?param=250y130'"
                alt=""
              />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount | playNumFilter}}</div>
              </div>
              <span class="time">{{item.duration | DurationFilter}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page="pageIndex"
      :page-size="pageSize"
      :page-sizes="pages"
    >
    </el-pagination>
  </div>
</template>

<script>
import { search } from "@/api/search";
import { getSongUrl } from "@/api/discovery";
export default {
  name: "result",
  data() {
    return {
      activeIndex: "1",
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      songList: [],
      playlistsList: [],
      mvList: [],
      pages: [10, 20, 40, 100],
    };
  },
  created() {
    this.getSearchSong();
  },
  methods: {
    changeTab() {
      this.pageIndex = 1;
      if (this.activeIndex == 1) {
        this.pageSize = 10;
      } else if (this.activeIndex == 1000) {
        this.pageSize = 10;
      } else if (this.activeIndex == 1004) {
        this.pageSize = 8;
      }
      this.getSearchSong();
    },
    // 获取搜索歌曲
    getSearchSong() {
      search({
        keywords: this.$route.query.keywords,
        limit: this.pageSize,
        type: this.activeIndex,
        offset: (this.pageIndex - 1) * this.pageSize,
      }).then((res) => {
        if (this.activeIndex == 1) {
          this.total = res.result.songCount;
          this.songList = res.result.songs;
          this.pages = [10, 20, 40, 100];
        } else if (this.activeIndex == 1000) {
          this.playlistsList = res.result.playlists;
          this.total = res.result.playlistCount;
          this.pages = [10, 20, 40, 100];
        } else if (this.activeIndex == 1004) {
          this.mvList = res.result.mvs;
          this.total = res.result.mvCount;
          this.pages = [8, 16, 32, 64];
        }
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
      this.pageIndex = val;
      this.getSearchSong();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getSearchSong();
    },
    // 跳转歌单详情页
    jumpPlayDetail(id) {
      this.$router.push({
        path: "/playsDetail",
        query: {
          id,
        },
      });
    },
    // 跳转MV详情页
    jumpMVDetail(id) {
      this.$router.push({
        path: "/mvDetail",
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped>
.el-table tbody tr,
.el-table thead th {
  height: 40px;
}
.el-table thead th {
  text-align: left;
}
.el-pagination {
  margin-top: 20px !important;
}
</style>
