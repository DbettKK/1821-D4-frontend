<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
      <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;" >
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="recently">最近使用</el-menu-item>
            <el-menu-item index="2" @click="myproduction">我创建的</el-menu-item>
            <el-menu-item index="3" @click="favorite">我的收藏</el-menu-item>
          </el-menu>
        <el-dropdown v-if="token">
          <el-button class="createfile" type="info"  plain>
            <i class="el-icon-circle-plus"></i><span>新建文档</span>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="createFile('default')">快速创建文档</el-dropdown-item>
            <el-dropdown-item @click.native="createFile('customize')">创建自定义文档</el-dropdown-item>
            <el-dropdown-item @click.native="createFile('model')">基于模板创建文档</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        </el-header>
        <el-main>
          <el-row v-for="(page, index) of pages" :key="index" style="margin-bottom: 40px;">
            <el-col :span="8" align="left" v-for="(item, innerindex) of page" :key="item.id" :offset="innerindex > 0 ? 2 : 0" style="margin-right: -60px;">
              <el-card :body-style="{ padding: '0px' }" shadow="hover" @dblclick.native="edit(item.id)">
                <div style="padding: 14px;">
                  <div class="top">
                    <div style="display: flex; align-items: start;">
                      <div class="docicon"><i class="el-icon-document"></i></div>
                      <span @click.stop="renameClick(item.id)">{{item.file_title}}</span>
                    </div>
                    <el-dropdown trigger="hover" style="font-size: 1px; color: #999;" placement="bottom-start">
                      <span class="el-dropdown-link">···</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-share" @click.native="file_id_tmp = item.id; dialogVisible = true; shareURL = baseURL+item.id">分享</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-star-on" @click.native="addFavorite(item.id)">收藏</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-edit" @click.native="renameClick(item.id)">重命名</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-s-custom" @click.native="selectPrivi(item.id)">设置文档权限</el-dropdown-item>

                        <el-dropdown-item icon="el-icon-delete-solid" @click.native="toTrash(item.id)">移动到回收站</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-s-tools" v-if="item.type=='team'" @click.native="change_tp_type(item.id, item.type)">更改文档为私人文档</el-dropdown-item>

                        <el-dropdown-item icon="el-icon-s-tools" v-if="item.type=='private'" @click.native="change_tp_type(item.id, item.type)">上传文档至团队空间</el-dropdown-item>

                      </el-dropdown-menu>
                    </el-dropdown>
                    <el-dialog
                      title="获得链接的人都可以查看"
                      :visible.sync="dialogVisible"
                      width="30%">
                      <el-form>
                        <el-form-item label="分享链接">
                          {{shareURL}}
                        </el-form-item>
                        <el-form-item label="权限" required>
                          <el-select v-model="privilege" placeholder="请选择">
                            <el-option label="仅查看" value="1"></el-option>
                            <el-option label="可编辑" value="2"></el-option>
                            <el-option label="可评论" value="3"></el-option>
                            <el-option label="可分享" value="4"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click=";dialogVisible=false;submit()" >确定</el-button>
                      </div>
                    </el-dialog>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time" style="margin-right: 30px;" >创建时间：{{time(item.create_time)}}</time>
                    <span style="font-size: 13px; color: #999;margin-right: 30px;">
                      权限：{{permission[item.permission-1]}}
                    </span>
                    <span style="font-size: 13px; color: #999;">类型：{{item.type}}</span>
                  </div>
                </div>
              </el-card>
              <el-dialog :inline="true" title="基于模板的文档创建" :visible.sync="dialogModel" width="30%">
                <el-form ref="modelFile" :model="modelFile" label-width="80px">
                  <el-form-item label="文件名字" required>
                    <el-input v-model="modelFile.file_name"></el-input>
                  </el-form-item>
                  <el-form-item label="文件模板" required>
                    <el-select v-model="modelFile.file_mod" placeholder="请选择">
                      <el-option label="会议模板" value="1"></el-option>
                      <el-option label="API模板" value="2"></el-option>
                      <el-option label="论文模板" value="3"></el-option>
                    </el-select>
                    <el-button type="primary" style="margin-left: 20px;" @click="preview(modelFile.file_mod)">模板预览</el-button>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogModel=false">取 消</el-button>
                  <el-button type="primary" @click="Model" >确 定</el-button>
                </div>
              </el-dialog>
              <el-dialog title="自定义文档创建" :visible.sync="dialogCustom" width="30%">
                <el-form ref="CustomFile" :model="CustomFile" label-width="80px">
                  <el-form-item label="文件名字" required>
                    <el-input v-model="CustomFile.file_name"></el-input>
                  </el-form-item>
                  <el-form-item label="文件类型" required>
                    <el-radio-group v-model="CustomFile.file_type">
                      <el-radio label="私人文档"></el-radio>
                      <el-radio label="团队文档"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="文件权限" required>
                    <el-select v-model="CustomFile.file_privilege" placeholder="请选择">
                      <el-option label="仅查看" value="1"></el-option>
                      <el-option label="可编辑" value="2"></el-option>
                      <el-option label="可评论" value="3"></el-option>
                      <el-option label="可分享" value="4"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogCustom=false">取 消</el-button>
                  <el-button type="primary" @click="Customize" >确 定</el-button>
                </div>
              </el-dialog>
              <el-dialog title="请选择想要上传的团队空间" :visible.sync="dialog3" width="30%">
                <el-form>
                  <el-form-item label="团队空间" required>
                    <el-select v-model="teamspace" placeholder="请选择">
                      <el-option v-for="ts in teamspaces" :key="ts.id" :label="ts.name" :value="ts.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialog3=false">取 消</el-button>
                  <el-button type="primary" @click="submitTypeTeam" >确 定</el-button>
                </div>
              </el-dialog>
              <el-dialog
                      title="请设置其他人对该文档的权限"
                      :visible.sync="dialog"
                      width="30%"
              >
                  <el-form>
                    <el-form-item label="权限" required>
                      <el-select v-model="privilege" placeholder="请选择">
                        <el-option label="仅查看" value="1"></el-option>
                        <el-option label="可编辑" value="2"></el-option>
                        <el-option label="可评论" value="3"></el-option>
                        <el-option label="可分享" value="4"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="dialog=false">取 消</el-button>
                    <el-button type="primary" @click="submit()" >确定</el-button>
                  </div>
              </el-dialog>
              <el-dialog title="重命名文档" :visible.sync="dialog2" width="30%">
                <el-form>
                  <el-form-item label="文档名" required>
                    <el-input v-model="file_name" placeholder="请输入文档名字"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialog2=false">取消</el-button>
                  <el-button type="primary" @click="renameFile" >确定</el-button>
                </div>
              </el-dialog>
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
      baseURL: 'http://localhost:8080/edit/',
      shareURL: '',
      dialogVisible: false,
      file_name: '',
      file_id_tmp: null,
      activeIndex:'2',
      doclist: [],
      privilege: '',
      dialog: false,
      //dialog1: false,
      dialog2: false,
      dialog3: false,
      dialogCustom: false,
      dialogModel: false,
      teamspace: '',
      teamspaces: [],
      teamspace_file_id: '',
      permission: ['仅查看','可编辑','可评论','可分享'],
      token: '',
      CustomFile: {
        file_name: '',
        file_type: '',
        file_privilege: '',
      },
      modelFile: {
        file_name: '',
        file_mod: ''
      },
    };
  },
  created() {
    this.token = window.sessionStorage.getItem('token')
    console.log(this.token);
    this.getDoclist()
  },
  methods: {
    getDoclist() {
      var that = this;
      Vue.axios.get(
              'http://175.24.121.113:8000/myapp/file/create/all/get/',
              {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        console.log(res);
        that.doclist = res.data.data;
      }).catch(function (error) {
        console.log(error, Response);
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
    shareMine(file_id) {
      this.$message({
        message: "该文档的分享邀请码为：" + file_id,
        duration: 5000,
        showClose: true,
      })
    },
    addFavorite(file_id) {
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/favorite/',
              {
                headers: {token: window.sessionStorage.getItem("token")},
                params: {file_id: file_id}
              }
      ).then(function (res) {
        that.$message({
          message: "收藏成功",//+res.data.file_id,
          type: "success",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
        console.log(res.data);
        that.file_id = res.data.data.file;
        console.log(that.file_id);
        that.addrecent();
      }).catch(function (error) {
        that.$message({
          message: error.response.data.info,//+res.data.file_id,
          type: "error",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
        console.log(error.response.data);
        console.log(window.sessionStorage.getItem("token"))
      });
      this.getDoclist();
      this.reload();
    },
    toTrash(file_id) {
      var that = this
      this.$http.get('http://175.24.121.113:8000/myapp/file/isdelete/',
              {
                headers: {token: window.sessionStorage.getItem("token")},
                params: {file_id: file_id}
              }
      ).then(function (res) {
        that.$message({
          message: "成功移到回收站",//+res.data.file_id,
          type: "success",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
        console.log(res.data);

      }).catch(function (error) {
        console.log(error.response.data);
        console.log(window.sessionStorage.getItem("token"))
      });
      this.getDoclist();
      this.reload();
      //location.reload();
    },
    selectPrivi(file_id) {
      this.dialog = true;
      this.file_id_tmp = file_id

    },
    submit() {
      var that = this
      this.$http.post('http://175.24.121.113:8000/myapp/file/privi/pri/', this.$qs.stringify({
                privilege: this.privilege,
                file_id: this.file_id_tmp
              }), {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        that.$message({
          message: "权限设置成功",//+res.data.file_id,
          type: "success",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
        console.log(res.data);
      }).catch(function (error) {
        that.$message({
          message: error.resopnse.data.info,//+res.data.file_id,
          type: "error",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
        console.log(error.response);
      });
      this.dialog = false;
      this.reload();
    },
    createFile(type) {
      if(type==='default'){
        this.$confirm('确定新建一个私人文档吗?', '文档创建', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.Default();
        });
      }else if(type==='customize'){
        this.$confirm('确定新建一个自定义文档吗?', '文档创建', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.dialogCustom=true;
        });
      }else if(type==='model'){
        this.$confirm('确定新建一个基于模板的文档吗?', '文档创建', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.dialogModel=true;
        });
      }

    },
    Default() {
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/create/pri/',
              {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        that.file_id = res.data.data.id;
        that.$message({message: '创建成功', type: 'success'});
        //that.getDoclist();
        that.reload();
        that.addrecent();
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });
    },
    Customize(){
      if(this.CustomFile.file_type==='团队文档') this.CustomFile.file_type='team';
      else this.CustomFile.file_type='private';
      var that=this;
      this.$http.post('http://175.24.121.113:8000/myapp/file/create/customize/',
              this.$qs.stringify({
                file_name: that.CustomFile.file_name,
                file_type: that.CustomFile.file_type,
                file_privilege: that.CustomFile.file_privilege,
              }),{headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        that.file_id=res.data.data.id;
        if(that.CustomFile.file_type==='team'){
          that.$message({message: '创建成功 但本团队文档不属于任何团队空间', type: 'warning'});
        }else that.$message({message: '创建成功', type: 'success'});
        that.dialogCustom=false;
        //that.getDoclist();
        that.reload();
        that.addrecent();
        console.log(res.data);
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });
    },
    Model(){
      var that=this;
      if(that.modelFile.file_name =='' || that.modelFile.file_name == null)
      {
        that.$message({message: '请输入一个文件名', type: 'error'});
      }
      else if(that.modelFile.file_mod !=1 && that.modelFile.file_mod !=2 && that.modelFile.file_mod !=3)
      {
        that.$message({message: '请选择一个模板类型', type: 'error'});
      }
      else{
        this.$http
          .post('http://175.24.121.113:8000/myapp/file/create/model/',
              this.$qs.stringify({
                'file_name': that.modelFile.file_name,
                'model': that.modelFile.file_mod,
              }),{headers: {token: window.sessionStorage.getItem("token")}})
          .then(function (res) {
            that.file_id=res.data.data.id;
            that.$message({message: '创建成功', type: 'success'});
            that.dialogMod=false;
            //that.getDoclist();
            that.reload();
            that.addrecent();
            console.log(res.data);
          })
          .catch(function (error) {
            that.$message.error(error.response.data.info);
          });
      }
    },
    preview(mod){
      if(mod != 1 && mod !=2 && mod!=3)
      {
          this.$message({message: '请选择一个模板', type: 'error'});
      }
      else{
        let routeUrl = this.$router.resolve({
          path: '/preview/'+mod,
        });
        window.open(routeUrl .href, '_blank');
      }
    },
    addrecent() {
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/browse/', {
                headers: {token: window.sessionStorage.getItem("token")},
                params: {file_id: that.file_id}
              }
      ).then(function (res) {
        console.log(res.data);
        that.file_id = '';
        that.getDoclist();
        that.reload();
      }).catch(function (error) {
        console.log(error.response);
      });
    },
    renameFile() {
      var that = this;
      this.$http.post('http://175.24.121.113:8000/myapp/file/rename/', this.$qs.stringify({
                file_id: this.file_id_tmp,
                file_name: this.file_name
              }), {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        that.$message({
          message: "成功重命名",//+res.data.file_id,
          type: "success",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
        that.dialog2 = false;
        that.getDoclist();
        that.reload();
        console.log(res.data);
      }).catch(function (error) {
        that.$message({
          message: error.resopnse.data.info,//+res.data.file_id,
          type: "error",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
        console.log(error.response);
      });

    },
    renameClick(file_id) {
      this.dialog2 = true;
      this.file_id_tmp = file_id;
    },
    edit(file_id) {
      this.file_id = file_id;
      this.addrecent();
      this.$router.push('/edit/' + file_id)

    },
    change_tp_type(file_id, file_type)//更改团队、私人类型
    {
      var that = this;
      if (file_type == 'private') {
        this.dialog3 = true;
        this.$http.get('http://175.24.121.113:8000/myapp/team/all/get/',
                {headers: {token: window.sessionStorage.getItem("token")}}
        ).then(res => {
          that.teamspaces = res.data.data;
          that.teamspace_file_id = file_id;
        });
      } else if (file_type == 'team') {
        this.$confirm('确定将文档从团队空间取出，别人将无法再和你协作编辑文档?', '文档类型改变', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.submitTypePri(file_id);
        }).catch(() => {
        });
      }
    },
    submitTypePri(file_id) {
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/privi/change/pri/',
              {
                headers: {token: window.sessionStorage.getItem("token")},
                params: {file_id: file_id}
              }
      ).then(function () {
        that.$message({
          message: "成功修改为私人文档",//+res.data.file_id,
          type: "success",
        });
        that.getDoclist();
        that.reload();
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });

    },
    submitTypeTeam() {
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/privi/change/team/',
              {
                headers: {token: window.sessionStorage.getItem("token")},
                params: {file_id: that.teamspace_file_id, team_id: that.teamspace}
              }
      ).then(function () {
        that.$message({
          message: "成功上传到团队空间",//+res.data.file_id,
          type: "success",
        });
        that.dialog3 = false;
        that.getDoclist();
        that.reload();
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });

    },
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
.createfile{
  height: 40px;
  width: 130px;
  margin-top: 20px;
  margin-right: 80px;
}
</style>