<template>
  <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px">
            <span class="title">最近使用</span>
            <el-divider></el-divider>
        </el-header>
        <el-main>
          <el-row v-for="(page, index) of pages" :key="index" style="margin-bottom: 40px;">
            <el-col :span="8" align="left" v-for="(item, innerindex) of page" :key="item.id" :offset="innerindex > 0 ? 2 : 0" style="margin-right: -60px;">
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <div style="padding: 14px;">
                  <div class="top">
                    <span>{{item.file_name}}</span>
                    <el-dropdown trigger="click" style="font-size: 1px; color: #999;" placement="bottom-start">
                      <span class="el-dropdown-link">···</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-star-on">收藏</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete-solid">从列表中删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time" style="margin-right: 40px;" >{{item.last_modified}}</time>
                    <span style="font-size: 13px; color: #999;">最近浏览：</span>
                    <span style="font-size: 13px; color: #999;">{{item.person_name}}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
  </el-container>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      doclist: [{
            "id": 7,
            "file_name": "无标题",
            "person_name": "lisi",
            "last_modified": "2020-08-12T10:16:02.383497",
            "file": 6,
            "person": 10
        },
        {
            "id": 6,
            "file_name": "无标题",
            "person_name": "lisi",
            "last_modified": "2020-08-12T10:09:39.770432",
            "file": 8,
            "person": 10
        },
        {
            "id": 1,
            "file_name": "tt",
            "person_name": "lisi",
            "last_modified": "2020-08-11T08:28:00.898769",
            "file": 2,
            "person": 10
        }]
    };
  },
  created() {
    //this.getDoclist()
  },
  methods: {
    getDoclist() {
      Vue.axios.get(
        'http://175.24.121.113:8000/myapp/file/browse/get'
      ).then(function(res){
        this.doclist=res.data;
      }).catch(function(error){
        console.log(error,Response);
      })
    }
  },
  computed: {
    pages () {
      const pages = []
      this.doclist.forEach((item, index) => {
        const page = Math.floor(index / 2)
        if (!pages[page]) {
          pages[page] = []
        }
        pages[page].push(item)
      })
      return pages
    }
  }
}
</script>

<style lang="less" scoped>
.title {
    color: #333;
    margin-bottom: -20px;
    font-size: 20px;
    line-height: 1.7;
    display: flex;
    align-items: center;
    font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}
.time {
  font-size: 13px;
  color: #999;
}

.top {
  display: flex;
  justify-content: space-between;
}
  
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.el-dropdown-link {
  cursor: pointer;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
  
.clearfix:after {
    clear: both
}
</style>