<template>
  <div class="songs-container">
    <div class="tab-bar fsc mt10">
      <span
        class="item"
        v-for="(item, index) in typeList"
        :key="item.id"
        @click="tabChange(item, index)"
        :class="{ active: index == activeIndex }"
        >{{ item.name }}</span
      >
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table mt15 ovh">
      <thead class="thead_box">
        <th>#</th>
        <th>封面</th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr
          class="el-table__row tr_song"
          v-for="(item, index) in newSongList"
          :key="item.id"
        >
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.blurPicUrl + '?param=70y70'" alt="" />
              <span
                class="iconfont icon-play"
                @click="getSongUrl(item.id, newSongList)"
              ></span>
            </div>
          </td>
          <td>
            <div class="song-wrap fsc">
              <div class="name-wrap">
                <span>{{ item.name }}</span>
                <span v-if="item.mvid != 0" class="iconfont icon-mv"></span>
              </div>
              <span></span>
            </div>
          </td>
          <td>{{ item.artists[0].name }}</td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration | DurationFilter }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getNewSong } from '@/api/discovery';
export default {
  name: 'songs',
  data() {
    return {
      newSongList: [],
      typeList: [
        {
          name: '全部',
          id: '0',
        },
        {
          name: '华语',
          id: '7',
        },
        {
          name: '欧美',
          id: '96',
        },
        {
          name: '日本',
          id: '8',
        },
        {
          name: '韩国',
          id: '16',
        },
      ],
      activeIndex: 0,
    };
  },
  created() {
    this.getNewSong();
  },
  methods: {
    // 获取最新音乐
    getNewSong(id) {
      const type = id || 0;
      getNewSong({ type }).then((res) => {
        console.log(res, 'rrrrrrrr');
        this.newSongList = res.data;
      });
    },
    // 点击当前标签
    tabChange(item, index) {
      this.activeIndex = index;
      this.getNewSong(item.id);
    },
    // 获取歌曲链接
    getSongUrl(id, list) {
      // getSongUrl({ id }).then((res) => {
      //   this.$notify({
      //     title: "歌曲",
      //     message: "播放成功",
      //     type: "success",
      //   });
      //   let url = res.data[0].url;
      //   this.$parent.musicUrl = url;
      // });
      const ids = list.map((x) => x.id);
      this.$bus.emit('get-song-url', { id });
      this.$bus.emit('get-song-details', { ids });
    },
  },
};
</script>

<style scoped>
.songs-container {
  padding: 0 15px;
}
.el-table.playlit-table th {
  text-align: left !important;
}
.thead_box th {
  height: 30px;
}
.tr_song {
  height: 100px;
}
.tab-bar .item {
  margin-right: 30px !important;
  color: #333;
}
</style>
