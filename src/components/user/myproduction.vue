<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="recently">最近使用</el-menu-item>
            <el-menu-item index="2" @click="myproduction">我创建的</el-menu-item>
            <el-menu-item index="3" @click="favorite">我的收藏</el-menu-item>
            <el-menu-item index="4" @click="trashbin">回收站</el-menu-item>
          </el-menu>
        </el-header>
        <el-main>
          <el-row v-for="(page, index) of pages" :key="index" style="margin-bottom: 40px;">
            <el-col :span="8" align="left" v-for="(item, innerindex) of page" :key="item.id" :offset="innerindex > 0 ? 2 : 0" style="margin-right: -60px;">
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <div style="padding: 14px;">
                  <div class="top">
                    <div style="display: flex; align-items: start;">
                      <div class="docicon"><i class="el-icon-document"></i></div>
                      <span>{{item.file_title}}</span>
                    </div>
                    <el-dropdown trigger="click" style="font-size: 1px; color: #999;" placement="bottom-start">
                      <span class="el-dropdown-link">···</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-star-on" @click.native="addFavorite(item.id)">收藏</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-s-custom">设置文档权限</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete-solid" @click.native="toTrash(item.id)">移动到回收站</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-s-tools" v-if="item.type=='team'">设置文档为私人文档</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-s-tools" v-if="item.type=='private'">设置文档为团队文档</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time" style="margin-right: 40px;" >创建时间：{{time(item.create_time)}}</time>
                    <span style="font-size: 13px; color: #999;">类型：</span>
                    <span style="font-size: 13px; color: #999;">{{item.type}}</span>
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
  inject: ['reload'],
  data() {
    return {
      activeIndex:'2',
      doclist: []
    };
  },
  created() {
    this.getDoclist()
  },
  methods: {
    getDoclist() {
      var that = this;
      Vue.axios.get(
        'http://175.24.121.113:8000/myapp/file/create/all/get/',
        {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function(res){
        console.log(res);
        that.doclist=res.data.data;
      }).catch(function(error){
        console.log(error,Response);
      })
    },
    recently() {
            this.$router.push('/recently')
    },
    myproduction() {
        this.$router.push('/myproduction')
    },
    favorite() {
        this.$router.push('/favorite')
    },
    trashbin() {
        this.$router.push('/trashbin')
    },
    time(a) {
      this.doctime = a.toString().substr(0, 10)
         return this.doctime
    },
    addFavorite(file_id){
      this.$http.get('http://175.24.121.113:8000/myapp/file/favorite/',
              {
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: file_id}
                }
      ).then(function (res) {
        console.log(res.data);
      }).catch(function (error) {
        console.log(error.response.data);
        console.log(window.sessionStorage.getItem("token"))
      })
    },
    toTrash(file_id){
      this.$http.get('http://175.24.121.113:8000/myapp/file/isdelete/',
              {
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: file_id}
              }
      ).then(function (res) {
        console.log(res.data);

      }).catch(function (error) {
        console.log(error.response.data);
        console.log(window.sessionStorage.getItem("token"))
      });
      this.getDoclist();
      this.reload();
      //location.reload();
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

.docicon {
  margin-right: 12px;
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