<template>
  <div>
    <div class="top-container">
      <div class="fsc">
        <div class="left-box">
          <div class="fcc logo mt-2" @click="clearSong">
            <img
              src="https://crm-1253803335.file.myqcloud.com/img/20220124/f958a27a5e3c64f6.png?imageView2/1/w/25/h/25"
              alt=""
            />
            <div>自娱自乐</div>
          </div>

          <div class="history-wrapper ml10">
            <span class="iconfont icon-arrow-lift" @click="go(-1)"></span>
            <span class="iconfont icon-arrow-right" @click="go(1)"></span>
          </div>
        </div>
        <div class="right-box ml20">
          <el-popover
            placement="bottom"
            width="250"
            trigger="click"
            transition="el-collapse-transition"
          >
            <!-- 关键词搜索内容 -->
            <div
              v-if="searchValue"
              v-loading="loading"
              element-loading-spinner="el-icon-loading"
            >
              <div class="c666 fs12">
                搜 <span class="cc82">{{ searchValue }}</span> 相关信息
              </div>
              <el-divider content-position="left">单曲</el-divider>
              <div v-if="!searchSongList.length" class="fs12 c999 mt10">
                暂无相关单曲~
              </div>
              <div v-else>
                <div
                  v-for="(item, index) in searchSongList"
                  :key="item.id"
                  class="tag mr10 mt10 ellipsis1"
                  @click="enterSearch(item.name)"
                >
                  <div v-if="index < 5">
                    {{ item.name }}-{{
                      item.artists && item.artists[0] && item.artists[0].name
                    }}
                  </div>
                </div>
              </div>

              <el-divider content-position="left">歌手</el-divider>
              <div v-if="!searchArtistsList.length" class="fs12 c999 mt10">
                暂无相关歌手~
              </div>
              <div v-else>
                <div
                  v-for="(item, index) in searchArtistsList"
                  :key="item.id"
                  class="tag mr10 mt10 ellipsis1"
                  @click="enterSearch(item.name)"
                >
                  <div v-if="index < 5">
                    {{ item.name }}
                  </div>
                </div>
              </div>

              <el-divider content-position="left">歌单</el-divider>
              <div v-if="!searchPlayList.length" class="fs12 c999 mt10">
                暂无相关歌单~
              </div>
              <div v-else>
                <div
                  v-for="(item, index) in searchPlayList"
                  :key="item.id"
                  class="tag mr10 mt10 ellipsis1"
                  @click="enterSearch(item.name)"
                >
                  <div v-if="index < 5">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 热门搜索 -->
            <div v-else>
              <ul>
                <li
                  v-for="(item, index) in hotList"
                  :key="index"
                  @click="enterSearch(item.searchWord)"
                >
                  <div class="hots_box fsbc fs14" v-if="index < 5">
                    <div>
                      <span>{{ index + 1 }}</span>
                      <span class="ml10">{{ item.searchWord }}</span>
                    </div>
                    <span class="c999">{{ item.score | playNumFilter }}</span>
                  </div>
                </li>
              </ul>
            </div>

            <!-- 输入框 -->
            <div
              class="el-input el-input--small el-input--prefix"
              slot="reference"
            >
              <el-input
                ref="inputF"
                slot="reference"
                placeholder="请输入歌名/歌手"
                v-model="searchValue"
                clearable
                @input="searchSong"
                @clear="clearSong"
                @keyup.enter.native="enterSearch(searchValue)"
              >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <span class="el-input__prefix">
                <i class="el-input__icon el-icon-search"></i>
              </span>
            </div>
          </el-popover>
        </div>
      </div>

      <div class="fsc fs14">
        <a
          v-if="!userInfo"
          class="mr15 login_btn"
          @click.stop="loginShow = true"
          >登录</a
        >
        <el-popover v-else placement="bottom" trigger="hover">
          <div class="cpr sign_out" @click.stop="logout">退出登录</div>
          <el-avatar
            slot="reference"
            :size="30"
            fit="cover"
            :src="userInfo.avatarUrl"
            class="mr20 cpr"
          ></el-avatar>
        </el-popover>

        <!-- 右侧悬浮控制按钮 -->
        <div class="fsc">
          <span class="c666 fs14 mr10" :class="navValue ? 'c333' : ''"
            >侧边悬浮</span
          >
          <el-switch
            v-model="navValue"
            active-color="#e08c82"
            inactive-color="#eaecf0"
            @change="changeNavSt"
          >
          </el-switch>
        </div>
        <!-- 音乐栏锁定 -->
        <div class="fsc ml15">
          <span class="c666 fs14 mr10" :class="navValue ? 'c333' : ''"
            >音乐栏锁定</span
          >
          <el-switch
            v-model="audioSwitch"
            active-color="#e08c82"
            inactive-color="#eaecf0"
            @change="changeAudioSt"
          >
          </el-switch>
        </div>
      </div>
    </div>
    <!-- 登录组件 -->
    <Login :show.sync="loginShow" />
  </div>
</template>

<script>
import { searchSuggest, searchHot } from '@/api/search';
import { logout } from '@/api/login';
import Login from '@/components/login.vue';
export default {
  name: 'top',
  components: {
    Login,
  },
  data() {
    return {
      query: '',
      searchValue: '',
      timer: null,
      searchSongList: [],
      searchArtistsList: [],
      searchPlayList: [],
      hotList: [],
      loading: true,
      navValue: true,
      audioSwitch: false,
      loginShow: false,
    };
  },
  created() {
    // 注册可被弟页面调用的方法
    this.$bus.on('change-audio-st', (e) => {
      this.changeAudioSt(e.status);
    });
  },
  mounted() {
    this.searchHot();
  },
  beforeDestroy() {
    // 页面销毁时注销
    this.$bus.off('change-audio-st', this.changeAudioSt);
  },
  computed: {
    userInfo() {
      return this.$store.getters.user_info;
    },
  },
  methods: {
    // 退出登录
    logout() {
      logout().then((res) => {
        localStorage.removeItem('user_info');
        this.$store.commit('USER_INFO', null);
      });
    },
    // 获取账号信息
    // getUserInfo() {
    //   getUserInfo().then((res) => {
    //     console.log(res, 'gggggggg');
    //   });
    // },
    // 切换底部音乐栏状态
    changeAudioSt(e) {
      if (e != null) {
        this.audioSwitch = e;
      }
      // 调用兄页面方法
      this.$bus.emit('change-audio', { status: this.audioSwitch });
    },
    // 切换左侧悬浮按钮状态
    changeNavSt() {
      // 调用兄页面方法
      this.$bus.emit('change-nav', { status: this.navValue });
    },
    // 确认搜索
    enterSearch(keywords) {
      this.$router.push({
        path: '/result',
        query: {
          keywords: keywords,
        },
      });
      this.$refs.inputF.blur();
    },
    // 热门歌曲
    searchHot() {
      searchHot().then((res) => {
        console.log(res, 'res');
        this.hotList = res.data;
      });
    },
    // 搜索歌曲
    searchSong() {
      if (this.timer) {
        return;
      }
      this.loading = true;
      this.timer = setTimeout(() => {
        searchSuggest({ keywords: this.searchValue })
          .then((res) => {
            console.log(res, 'rrrrrrr');
            this.searchSongList = (res.result && res.result.songs) || [];
            this.searchArtistsList = (res.result && res.result.artists) || [];
            this.searchPlayList = (res.result && res.result.playlists) || [];
            this.timer = false;
            this.loading = false;
          })
          .catch(() => {
            this.timer = false;
            this.loading = false;
          });
      }, 500);
    },
    clearSong() {
      this.$router.push({
        path: '/discovery',
      });
      this.$refs.inputF.blur();
    },
    // 前进后退
    go(e) {
      this.$router.go(e);
    },
  },
};
</script>

<style scoped>
.logo {
  cursor: pointer;
}
.logo img {
  width: 25px;
  height: 25px;
}
.logo div {
  font-family: KaiTi;
  background-image: -webkit-linear-gradient(
    bottom,
    rgb(245, 89, 115),
    rgb(82, 76, 74)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 26px;
}
.history-wrapper .iconfont {
  background: rgba(0, 0, 0, 0.15);
  transform: scale(0.7);
}
.mt-2 {
  margin-top: -2px;
}
.el-divider__text,
.el-link {
  font-size: 12px;
  color: #666;
}
.el-divider--horizontal {
  margin: 15px 0 5px;
}
.tag {
  max-width: 220px;
  display: inline-block;
  padding: 3px 5px;
  background: rgba(224, 140, 130, 0.15);
  border: 1px solid rgba(224, 140, 130, 0.5);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #e08c82;
  cursor: pointer;
}
.tag:active {
  background: #90bddd;
}
.w220 {
  width: 220px;
}
.hots_box {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 10px;
}
.hots_box:hover {
  background-color: rgba(224, 140, 130, 0.3);
  cursor: pointer;
}
.hots_box span:first-child {
  color: #e08c82;
}
.c333 {
  color: #333 !important;
}
.login_btn {
  color: #e08c82;
  cursor: pointer;
}
.sign_out {
  text-align: center;
}
.sign_out:hover {
  color: #e08c82;
}
/* 修改loading加载时的颜色 */
::v-deep .el-loading-spinner .path {
  stroke: #fff;
}
</style>
