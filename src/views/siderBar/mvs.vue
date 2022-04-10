<template>
  <div class="mvs-container">
    <div class="filter-wrap">
      <div class="seciton-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: index == areaIndex }"
              v-for="(item, index) in areaList"
              :key="index"
              @click="handleAreaTag(index, item)"
              >{{ item }}</span
            >
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: index == typeIndex }"
              v-for="(item, index) in typeList"
              :key="index"
              @click="handleTypeTag(index, item)"
              >{{ item }}</span
            >
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: index == orderIndex }"
              v-for="(item, index) in orderList"
              :key="index"
              @click="handleOrderTag(index, item)"
              >{{ item }}</span
            >
          </li>
        </ul>
      </div>
    </div>
    <!-- mv容器 -->
    <!-- 推荐MV -->
    <div class="mvs">
      <div class="items">
        <div
          class="item"
          v-for="item in mvList"
          :key="item.id"
          @click="jumpMVDetail(item.id)"
        >
          <div class="img-wrap">
            <img :src="item.cover + '?param=250y130'" alt="" />
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ item.playCount | playNumFilter }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[8, 16, 32, 64]"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getNewMv } from '@/api/discovery';
export default {
  name: 'mvs',
  data() {
    return {
      // 总条数
      total: 0,
      // 页容量
      pageSize: 16,
      pageIndex: 1,
      mvList: [],
      areaList: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      typeList: ['全部', '官方版', '原声', '现场版', '网易出品'],
      orderList: ['上升最快', '最热', '最新'],
      areaIndex: 0,
      typeIndex: 0,
      orderIndex: 0,
      area: '全部',
      type: '全部',
      order: '上升最快',
    };
  },
  created() {
    this.getNewMv();
  },
  methods: {
    toMv(id) {
      this.$router.push(`/mv?id=${id}`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageIndex = val;
      this.getNewMv();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getNewMv();
    },
    // 获取最新mv
    getNewMv() {
      getNewMv({
        limit: this.pageSize,
        area: this.area,
        type: this.type,
        order: this.order,
        offset: (this.pageIndex - 1) * this.pageSize,
      }).then((res) => {
        console.log(res, 'rrrr');
        this.mvList = res.data;
        this.total = res.count ? res.count : this.total;
      });
    },
    // 点击当前地区标签
    handleAreaTag(index, item) {
      this.areaIndex = index;
      this.area = item;
      this.getNewMv();
    },
    // 点击当前类型标签
    handleTypeTag(index, item) {
      this.typeIndex = index;
      this.type = item;
      this.getNewMv();
    },
    // 点击当前排序标签
    handleOrderTag(index, item) {
      this.orderIndex = index;
      this.order = item;
      this.getNewMv();
    },
    // 跳转MV详情页
    jumpMVDetail(id) {
      this.$router.push({
        path: '/mvDetail',
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped>
.mvs-container {
  padding: 0 0 0 20px;
}
.singer {
  font-style: italic !important;
  color: #333 !important;
}
.el-pagination {
  margin-top: 0 !important;
}
</style>
