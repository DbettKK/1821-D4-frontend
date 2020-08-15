<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
      <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;" >
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="recently">最近使用</el-menu-item>
            <el-menu-item index="2" @click="myproduction">我创建的</el-menu-item>
            <el-menu-item index="3" @click="favorite">我的收藏</el-menu-item>
            <el-menu-item index="4" @click="trashbin">回收站</el-menu-item>
          </el-menu>
          <el-card :body-style="{ padding: '0px' }" shadow="hover" class="newfile" @click.native="createFile">
            <i class="el-icon-circle-plus bt">新建文档</i>
          </el-card>
        </el-header>
<!--        <el-dialog title="是否新建私人文档" :visible.sync="dialog" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="submit()" >确 定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
        <el-main>
          <el-row v-for="(page, index) of pages" :key="index" style="margin-bottom: 40px;">
            <el-col :span="8" align="left" v-for="(item, innerindex) of page" :key="item.id" :offset="innerindex > 0 ? 2 : 0" style="margin-right: -60px;">
              <el-card :body-style="{ padding: '0px' }" shadow="hover" @dblclick.native="edit(item.file)">
                <div style="padding: 14px;">
                  <div class="top">
                    <div style="display: flex; align-items: start;">
                      <div class="docicon"><i class="el-icon-document"></i></div>
                      <span>{{item.file_name}}</span>
                    </div>
                    <el-dropdown trigger="hover" style="font-size: 1px; color: #999;" placement="bottom-start">
                      <span class="el-dropdown-link">···</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-share" v-if="item.file_privi===4" @click.native="share(item.id)">分享</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-star-on" @click.native="cancelFavor(item.file)">取消收藏</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time" style="margin-right: 15px;" >收藏时间：{{time(item.kept_time)}}</time>
                    <span style="font-size: 13px; color: #999;margin-right: 15px;">权限：{{permission[item.file_privi-1]}}</span>
                    <span style="font-size: 13px; color: #999;">该文档创建者：{{item.file_creator_name}}</span>

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
      activeIndex:'3',
      doclist: [],
      //dialog: false,
      permission: ['仅查看','可编辑','可评论','可分享']
    };
  },
  created() {
    this.getDoclist()
  },
  methods: {
    getDoclist() {
      var that = this;
      Vue.axios.get(
        'http://175.24.121.113:8000/myapp/file/favorite/get/',
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
    share(file_id){
      this.$message({
        message:"该文档的分享邀请码为："+file_id,
        duration:5000,
        showClose:true,
      })
    },
    cancelFavor(file_id){
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/cancelfavor/',
              {
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: file_id}
              }
      ).then(function (res) {
        console.log(res.data);
        that.file_id=res.data.data.file;
        console.log(that.file_id);
        that.addrecent();
        that.$message({
                  message: "成功取消收藏",
                  type: "success",
                  customClass: "c-msg",
                  duration:3000,
                  showClose: true
                });
      }).catch(function (error) {
        console.log(error.response.data);
        console.log(window.sessionStorage.getItem("token"))
      })
      this.getDoclist();
      this.reload();
    },
    createFile(){
      this.$confirm('确定新建一个私人文档吗?', '文档创建', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.submit();
      });
    },
    submit(){
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/create/pri/',
              {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        that.file_id=res.data.data.id;
        that.$message({
          message: '创建成功 请前往我的创建中查看',
          type: 'success'
        })
        that.addrecent();
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });
      //this.dialog=false;
      this.getDoclist();
      this.reload();
    },
    addrecent() {
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/browse/', {
        headers: {token: window.sessionStorage.getItem("token")},
        params:{file_id: that.file_id}
      }
      ).then(function (res) {
        console.log(res.data);
      }).catch(function (error) {
        console.log(error.response);
      });
      this.file_id='';
      this.getDoclist();
      this.reload();
    },
    edit(file_id){
      this.file_id = file_id;
      this.addrecent();
      this.$router.push('/edit/' + file_id)
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

.newfile {
  height: 30px;
  width: 120px;
  background-color: rgb(36, 36, 36);
  font-size: 11px;
  margin-top: 20px;
  margin-right: 100px;
  color: rgb(180, 180, 180);
  position: relative;
  cursor: pointer;
  .bt {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%)translateY(-50%);
  }
}
</style>