<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item active">全部</span>
      <span class="item">华语</span>
      <span class="item">欧美</span>
      <span class="item">日本</span>
      <span class="item">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr
          class="el-table__row"
          v-for="(item,index) in newSongList"
          :key="item.id"
        >
          <td>{{index}}</td>
          <td>
            <div class="img-wrap">
              <img
                :src="item.album.blurPicUrl + '?param=70y70'"
                alt=""
              />
              <span class="iconfont icon-play"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{item.name}}</span>
                <span class="iconfont icon-mv"></span>
              </div>
              <span></span>
            </div>
          </td>
          <td>{{item.artists[0].name}}</td>
          <td>{{item.album.name}}</td>
          <td>{{item.duration | DurationFilter}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getNewSong } from "@/api/discovery";
export default {
  name: "songs",
  data() {
    return {
      type: 0,
      newSongList: [],
    };
  },
  created() {
    this.getNewSong();
  },
  methods: {
    // 获取最新音乐
    getNewSong() {
      getNewSong({ type: this.type }).then((res) => {
        console.log(res, "rrrrrrrr");
        this.newSongList = res.data;
      });
    },
  },
};
</script>

<style >
</style>
