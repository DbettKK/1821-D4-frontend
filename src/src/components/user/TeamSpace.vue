<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
  <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
            <span style="color: grey;font-size: 30px">{{teaminfo.name}}</span>
          </el-header> 
        <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between; margin-top:0px;">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="toTeam()">团队文档</el-menu-item>
            <el-menu-item index="2" @click="manage_member">团队信息</el-menu-item>
          </el-menu>
          <!--创建者本人才能看到按钮-->
          <!--
          <el-button class="manage_member" type="info" @click.native="manage_member" plain v-if="userinfo.id==teaminfo.creator" >
            <i class="el-icon-setting"></i><span>成员管理</span>
          </el-button>
          -->
          <!--
          <el-button class="createfile" type="info" @click.native="createFile" plain>
            <i class="el-icon-circle-plus"></i><span>新建文档</span>
          </el-button>
          -->

          <el-dropdown v-if="true"><!--明天迭代成权限控制的添加-->
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
                          <!--可以修改就不用单独写下拉菜单-->
                        <el-dropdown-item icon="el-icon-edit-outline" @click.native="comment" v-if="item.team_permission>6">评论</el-dropdown-item>
                        <!--评论不在这里做-->
                     <!--    <el-dropdown-item icon="el-icon-edit" @click.native="edit(item.id)" v-if="item.team_permission>2">修改</el-dropdown-item>-->
                         <!--
                         <el-dropdown-item icon="el-icon-share" @click.native="share_function" v-if="item.team_permission>3">分享</el-dropdown-item>
                         -->
                         <!--当文件拥有可分享权限或用户为创建者是可以看到团队空间的下拉栏中的分享-->
                          <el-dropdown-item icon="el-icon-share" v-if="item.team_permission>=4||pri_visible(item.creator)" @click.native="shareUrl(item.id,item.file_privilege)">分享</el-dropdown-item>

                         <!--限制了只有拥有足够的权限才能够更改团队文档的权限-->
                         <el-dropdown-item icon="el-icon-setting" @click.native="click_set_pri(item.id)" v-if="pri_visible(item.creator)">设置文档权限</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-edit" @click.native="renameClick(item.id)" v-if="pri_visible(item.creator)">重命名</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-star-on" @click.native="addFavorite(item.id,item.file_privilege)">收藏</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete-solid"  @click.native="delfile(item.id)" v-if="pri_visible(item.creator)">删除团队文档</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time" style="margin-right: 20px;">{{time(item.last_modified)}} 上一次修改</time>
                    <span style="font-size: 13px; color: #999;">创建者：</span>
                    <span style="font-size: 13px; color: #999;margin-right: 20px;">{{item.creator_name}}</span>
                    <span style="font-size: 13px; color: #999;">权限：</span>
                    <span style="font-size: 13px; color: #999;">{{permission_transfer(item.team_permission)}}</span>
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
        <!--重命名dialog-->
                 <el-dialog title="重命名文档" :visible.sync="dialog_rename" width="30%">
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
              <!--团队成员权限dialog-->
                            <el-dialog
                      title="请设置团队成员对该文档的权限"
                      :visible.sync="dialog_setpri"
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
                    <el-button @click="dialog_setpri=false">取 消</el-button>
                    <el-button type="primary" @click="submit_setpri()" >确定</el-button>
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


 <!--新建文档时的两个dialog-->
       <el-dialog :inline="true" title="基于模板的文档创建" :visible.sync="dialogModel" width="30%">
            <el-form ref="modelFile" :model="modelFile" label-width="80px">
              <el-form-item label="文件名字" required>
                <el-input v-model="modelFile.file_name"></el-input>
              </el-form-item>
              <el-form-item label="文件模板" required>
                <el-select v-model="modelFile.file_mod" placeholder="请选择">
                  <el-option label="API接口模板" value="1"></el-option>
                  <el-option label="计划书模板" value="2"></el-option>
                  <el-option label="服务器操作模板" value="3"></el-option>
                  <el-option label="算法题整理模板" value="4"></el-option>
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
                  <el-radio label="团队文档" value='团队文档' ></el-radio>
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
          <!--分享时的dialog-->
            <el-dialog
          title="获得链接的人都可以查看"
          :visible.sync="sharedialogVisible"
          width="30%">
          <el-form>
            <el-form-item label="分享链接">
              {{shareURL}}
            </el-form-item>
            <el-form-item label="点击复制">
              <el-button 
                v-clipboard:copy="shareURL"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError">复制链接</el-button>
            </el-form-item>
            <el-form-item label="同时发送站内消息">
              <el-switch
                v-model="innerMessage"
                active-color="#13ce66"
                inactive-color="#909399">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="innerMessage" label="分享对象的用户名或邮箱">
              <el-input
                v-model="shareMessageTo"
                >
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sendInnerMessage" >确定</el-button>
          </div>
        </el-dialog>
    </el-container>
</template>

<script>
import Vue from 'vue'
export default {
    inject: ['reload'],
  data() {
    return {
      innerMessage: false,
      shareMessageTo:'',
      baseURL: 'http://175.24.121.113/edit/',
      shareURL: '',
       
        file_name:'',
      file_id: null,
      del: null,
      team_id: null,
      activeIndex:'1',
      doclist: [],
      five: 0,
      id: null,
      //dialog: false,
      dialog1: false,
      dialog_rename:false,
      file_id_tmp:null,
      dialog_setpri:false,
      privilege:'',
       userinfo: {
                id: "",
                username: "",
                email: "",
                phone_num: "",
            },
        teaminfo:
        {
            id:"",
            name:"",
            create_time:"",
            creator:"",
            members:[]

        },
        islogin:false ,
        dialogCustom: false,
        dialogModel:false,
      CustomFile: {
        file_name: '',
        file_type:'团队文档',
        file_privilege: '',
        team_id:'',
      },
     modelFile: {
        file_name: '',
        file_mod: '',
        team_id:'',
      },
       sharedialogVisible:false,
          };

  },
  created() {
    this.getDoclist();
     this.getUserInfo();
     this.getTeamInfo();
  },
    watch: {//监听下个访问的东西是不是还是teamspace，是则重新获取
        '$route' (to, from) {
            if(to.name === 'Teamspace'){
                this.getDoclist();
                this.getUserInfo();
                 this.getTeamInfo();
            }
            if(from.name==='post')//纯粹为了避免unused
            {
                this.five++;
            }
        }
    },
  methods: {
    sendInnerMessage() {
      var that = this
      this.$http.post('http://175.24.121.113:8000/myapp/msg/sendInnerMessage/', this.$qs.stringify({
                shareMessageTo: this.shareMessageTo,
                file_id: this.file_id_tmp
              }), {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        that.$message({
          message: "站内分享成功",//+res.data.file_id,
          type: "success",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
        console.log(res.data);
      }).catch(function (error) {
        that.$message({
          message: error.response.data.info,//+res.data.file_id,
          type: "error",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
        console.log(error.response);
      });
      this.dialog=false;
      this.reload();
    },
    getDoclist() {
        let str = window.atob(this.$route.params.id).substr(11);
        this.team_id=str.substr(0,str.length-2);
      var that = this;
      Vue.axios.get(
          'http://175.24.121.113:8000/myapp/file/team/get/', {
              headers: {'token': window.sessionStorage.getItem('token')},
              params:{team_id: that.team_id}}
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
    manage_member()
    {
        this.team_id=this.$route.params.id;
        this.$router.push('/Teammember/'+this.team_id)
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
      file_id = window.btoa('hello,world' + file_id + 's')
      this.addrecent();
      this.$router.push('/edit/' + file_id)
    },
    addFavorite(file_id,file_pri){
      console.log("pri");
      console.log(file_pri);
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
   //   this.del = file_id;
      
    //  this.dialog1 = true;
      this.$confirm('确定删除此文档吗?', '文档创建', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.deletefile(file_id);
        });
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
/*
    createFile(){
      this.$confirm('确定新建一个团队文档吗?', '文档创建', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.submit();
      });
    },
*/

    submit(){//创建默认文档
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/create/team/',
          {headers: {token: window.sessionStorage.getItem("token")}, params: {team_id: that.team_id}}
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
    },
    permission_transfer(team_permission)//用于显示团队权限
    {
        if(team_permission==1)
        return "仅查看";
        else if(team_permission==2)
        return "可编辑";
          else if(team_permission==3)
          return "可评论";
            else if(team_permission==4)
            return"可分享";
            else return "wrong"

    },
        renameClick(file_id,file_pri) {
      //      console.log(window.sessionStorage.getItem("token"));
      this.dialog_rename = true;
      this.file_id_tmp = file_id;
      console.log(file_pri)
                      console.log(this.userinfo.id);
                console.log(this.teaminfo.creator)
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
        submit_setpri() {
      var that = this
      this.$http.post('http://175.24.121.113:8000/myapp/file/privi/team/', this.$qs.stringify({
                privilege: this.privilege,
                file_id: this.file_id_tmp,
                team_id:this.team_id
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
    click_set_pri(file_id)
    {
      this.dialog_setpri= true;
      this.file_id_tmp = file_id
    },
    //获取个人信息 为了对照权限
  getUserInfo() {
            this.$http.get(
                'http://175.24.121.113:8000/myapp/user/info/',
                {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(res=>{
                this.userinfo.username=res.data.data.username;
                this.userinfo.phone_num=res.data.data.phone_num;
                this.userinfo.id=res.data.data.id;
                this.userinfo.email=res.data.data.email;
                console.log(res);
            }).catch(function(error){
                console.log(error);
            })
        },
    getTeamInfo()
    {
        var that=this;
         this.$http.get(
                  'http://175.24.121.113:8000/myapp/team/get/', {
              headers: {'token': window.sessionStorage.getItem('token')},
              params:{team_id: that.team_id}}
            ).then(res=>{
                this.teaminfo.team_id=res.data.data.id;
                this.teaminfo.name=res.data.data.name;
                this.teaminfo.creator=res.data.data.creator;
                this.teaminfo.members=res.data.data.members;
                console.log(res);

            }).catch(function(error){
                console.log(error);
            })
    },
       createFile(type) {
      if(type==='default'){
        this.$confirm('确定在此团队空间新建一个文档吗?', '文档创建', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.submit();
        });
      }else if(type==='customize'){
        this.$confirm('确定新建一个自定义文档吗?', '文档创建', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.dialogCustom=true;
          this.CustomFile.team_id=this.teaminfo.team_id;
        });
      }else if(type==='model'){
        this.$confirm('确定新建一个基于模板的文档吗?', '文档创建', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.dialogModel=true;
          this.modelFile.team_id=this.teaminfo.team_id;
        });
      }

    },
    //这两个函数还没改完
     Customize(){
      if(this.CustomFile.file_type==='团队文档') this.CustomFile.file_type='team';
      var that=this;
      this.$http.post('http://175.24.121.113:8000/myapp/file/create/customize/team/',
              this.$qs.stringify({
                file_name: that.CustomFile.file_name,
                file_type: that.CustomFile.file_type,
                file_privilege: that.CustomFile.file_privilege,
                team_id:that.CustomFile.team_id,
              }),{headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        console.log(that.CustomFile.file_privilege);
          that.$message({message: '创建成功', type: 'success'});

        that.dialogCustom=false;
        //that.getDoclist();
        that.reload();
        that.addrecent(res.data.data.id);
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
      else if(that.modelFile.file_mod !=1 && that.modelFile.file_mod !=2
              && that.modelFile.file_mod !=3 && that.modelFile.file_mod !=4)
      {
        that.$message({message: '请选择一个模板类型', type: 'error'});
      }
      else{
        this.$http
          .post('http://175.24.121.113:8000/myapp/file/create/model/team/',
              this.$qs.stringify({
                'file_name': that.modelFile.file_name,
                'model': that.modelFile.file_mod,
                'team_id':that.modelFile.team_id,
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
      if(mod != 1 && mod !=2 && mod!=3 && mod!=4)
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
    pri_visible(creator_id)
    {
      if(this.userinfo.id===this.teaminfo.creator)
      return true;
      if(this.userinfo.id===creator_id)
      return true;
      return false;
    },
     onCopy: function () {
      this.$message({
          message: "已经复制到剪贴版",//+res.data.file_id,
          type: "success",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
    },
    onError: function () {
      this.$message({
          message: "复制失败",//+res.data.file_id,
          type: "success",
          customClass: "c-msg",
          duration: 3000,
          showClose: true
        });
    },
      shareUrl(file_id){
          this.file_id_tmp = file_id;
          this.sharedialogVisible = true;
          this.shareURL = this.baseURL+window.btoa('hello, world' + file_id + 's');
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
.manage_member
{
    height:40px;
    width:130px;
    margin-top:20px;
    margin-right:0px;
}
</style>