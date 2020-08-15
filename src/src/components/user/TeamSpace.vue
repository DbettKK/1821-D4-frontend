<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="toTeam()">团队文档</el-menu-item>
            <el-menu-item index="2" @click="Teammessage()">团队信息</el-menu-item>
          </el-menu>
          <el-button class="createfile" type="info" @click.native="createFile" plain>
            <i class="el-icon-circle-plus"></i><span>新建文档</span>
          </el-button>
        </el-header>
<!--        <el-dialog title="是否新建团队文档" :visible.sync="dialog" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="submit()" >确 定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
        <el-main>
          <el-row v-for="(page, index) of pages" :key="index" style="margin-bottom: 40px;">
            <el-col :span="8" align="left" v-for="(item, innerindex) of page" :key="item.id" :offset="innerindex > 0 ? 2 : 0" style="margin-right: -60px;">
              <el-card :body-style="{ padding: '0px' }" shadow="hover" @click.native="edit(item.id)">
                <div style="padding: 14px;">
                  <div class="top">
                    <div style="display: flex; align-items: start;">
                      <div class="docicon"><i class="el-icon-document"></i></div>
                      <span>{{item.file_title}}</span>
                    </div>
                    <el-dropdown trigger="hover" style="font-size: 1px; color: #999;" placement="bottom-start">
                      <span class="el-dropdown-link">···</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-star-on" @click.native="addFavorite(item.id)">收藏</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete-solid" v-if="item.creator == id" @click.native="delfile(item.id)">删除团队文档</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time" style="margin-right: 40px;">{{time(item.last_modified)}} 最后一次修改</time>
                    <span style="font-size: 13px; color: #999;">该文档创建者：</span>
                    <span style="font-size: 13px; color: #999;">{{item.creator_name}}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
        <el-dialog title="团队文档删除不可恢复，确认删除？" :visible.sync="dialog1" width="30%">
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialog1=false">取 消</el-button>
            <el-button type="primary" @click="deletefile(del)" >确 定</el-button>
          </div>
        </el-dialog>
<!--        <div class="right_pannels">&lt;!&ndash;右边按钮栏&ndash;&gt;-->
<!--            <div class="button_container">-->
<!--            <div class="button_create_team_doc">   -->
<!--                <el-button class="shenhui"  style="width:160px" icon="el-icon-edit">-->
<!--                    新建-->
<!--                </el-button>-->
<!--            </div>-->
<!--            <div class= button_putin>-->
<!--                <el-button type='info'  style="width:160px" icon="el-icon-plus"  >-->
<!--                    导入-->
<!--                </el-button>-->
<!--            </div>-->
<!--            </div>-->

<!--        </div>-->

    </el-container>
</template>

<script>
import Vue from 'vue'
export default {
    inject: ['reload'],
  data() {
    return {
      file_id: null,
      del: null,
      team_id: null,
      activeIndex:'1',
      doclist: [],
      five: 0,
      id: null,
      //dialog: false,
      dialog1: false
    };
  },
  created() {
    this.getDoclist();
    this.team_id=this.$route.params.id.toString();
  },
    watch: {//监听下个访问的东西是不是还是teamspace，是则重新获取
        '$route' (to, from) {
            if(to.name === 'Teamspace'){
                this.getDoclist();
            }
            if(from.name==='post')//纯粹为了避免unused
            {
                this.five++;
            }
        }
    },
  methods: {
    getDoclist() {
      var that = this;
      Vue.axios.get(
          'http://175.24.121.113:8000/myapp/file/team/get/', {
              headers: {'token': window.sessionStorage.getItem('token')},
              params:{team_id: that.$route.params.id.toString()}}
      ).then(function(res){
        console.log(res);
        that.doclist=res.data.data;
        that.id=window.sessionStorage.getItem('id');
      }).catch(function(error){
        console.log(error,Response);
      })
    },
    toTeam(){
      this.team_id = this.$route.params.id;
      this.$router.push("/TeamSpace/"+this.team_id);
    },
    Teammessage(){
      this.team_id = this.$route.params.id;
      this.$router.push("/Teammessage/"+this.team_id);
    },
    time(a) {
         this.doctime = a.toString().substr(0, 10)
         return this.doctime
    },
    addrecent(){
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
    },
    addFavorite(file_id){
          var that = this;
          this.$http.get('http://175.24.121.113:8000/myapp/file/favorite/',
              {
                  headers: {token: window.sessionStorage.getItem("token")},
                  params:{file_id: file_id}
              }
          ).then(function (res) {
              console.log(res.data);
              that.file_id=res.data.data.file;
              console.log(that.file_id);
              that.addrecent();
          }).catch(function (error) {
              console.log(error.response.data);
              console.log(window.sessionStorage.getItem("token"))
          });
          this.getDoclist();
          this.reload();
    },
    delfile(file_id) {
      this.del = file_id;
      this.dialog1 = true;
    },
    deletefile(file_id){
          this.$http.get('http://175.24.121.113:8000/myapp/file/realdelete/',
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
          this.dialog1 = false;
    },
    createFile(){
      this.$confirm('确定新建一个团队文档吗?', '文档创建', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.submit();
      });
    },
    submit(){
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/create/team/', {headers: {token: window.sessionStorage.getItem("token")}, params: {team_id: that.team_id}}
      ).then(function (res) {
        that.file_id=res.data.data.id;
        that.$message({
          message: '创建成功',
          type: 'success'
        })
        that.addrecent();
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });
      //this.dialog=false;
      this.getDoclist();
      this.reload();
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
    clear: both;
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
.createfile{
  height: 40px;
  width: 130px;
  margin-top: 20px;
  margin-right: 80px;
}
</style>