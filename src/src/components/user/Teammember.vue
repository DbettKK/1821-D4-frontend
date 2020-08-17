<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <!--
        <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
            <span style="color: grey;font-size: 30px">成员管理</span>
            
            <el-button class="emptytrash" type="info" @click.native="addmember" plain>
                <i class="el-icon-circle-plus-outline"></i><span>添加成员</span>
            </el-button>
                    </el-header>

                    -->
       

                <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
            <span style="color: grey;font-size: 30px">{{teaminfo.name}}</span>
          </el-header> 
          <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between; margin-top:0px;">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click.native="toTeam()">团队文档</el-menu-item>
            <el-menu-item index="2" @click="manage_member">团队信息</el-menu-item>
          </el-menu>
            <el-button class="emptytrash" type="primary" @click.native="invite_dialogVisible = true" >
                <i class="el-icon-circle-plus-outline"></i><span>邀请成员</span>
            </el-button>
         <!--     <el-button class="invite" type="primary" @click="dialogVisible = true">邀请成员</el-button>-->
          <el-button class="delfile" type="danger" @click.native="exitTeam" v-if="!is_creator">
                <i class="el-icon-delete-solid"></i><span>退出团队</span>
            </el-button>
            <el-button class="delfile" type="danger" @click.native="dismissTeam" v-else>
                <i class="el-icon-delete-solid"></i><span>解散团队</span>
            </el-button>
            <!--邀请-->
          </el-header>
                    <el-dialog
                title="提示"
                :visible.sync="invite_dialogVisible"
                width="30%">
                <div style="margin-bottom: 20px">
                    <span>被邀请人的ID:</span>
                </div>
                <el-form ref="inviteFormRef" :model="inviteForm" label-width="0px" class="invite_form">
                    <el-form-item prop="id">
                        <el-input placeholder="ID:" v-model="inviteForm.id"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click.native="invite()">确 定</el-button>
                </span>
            </el-dialog>
          <!--
          <el-header>
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="toTeam">团队文档</el-menu-item>
            <el-menu-item index="2" @click="Teammessage">团队信息</el-menu-item>
          </el-menu>
            <el-button class="delfile" type="danger" @click.native="exitTeam" v-if="!is_creator">
                <i class="el-icon-delete-solid"></i><span>退出团队</span>
            </el-button>
            <el-button class="delfile" type="danger" @click.native="dismissTeam" v-else>
                <i class="el-icon-delete-solid"></i><span>解散团队</span>
            </el-button>
                   </el-header>
                   -->

<!--          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">-->
<!--            <el-menu-item index="1" @click="recently">最近使用</el-menu-item>-->
<!--            <el-menu-item index="2" @click="myproduction">我创建的</el-menu-item>-->
<!--            <el-menu-item index="3" @click="favorite">我的收藏</el-menu-item>-->
<!--            <el-menu-item index="4" @click="trashbin">回收站</el-menu-item>-->
<!--          </el-menu>-->
<!--          <el-card :body-style="{ padding: '0px' }" shadow="hover" class="newfile" @click.native="createFile">-->
<!--            <i class="el-icon-circle-plus bt">新建文档</i>-->
<!--          </el-card>-->

<!--        <el-dialog title="是否新建私人文档" :visible.sync="dialog1" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog1=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="submit()" >确 定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
        <el-main>
        <el-table :data="members" height=666px style="width: 100%" :default-sort = "{prop: 'member_name', order: 'descending'}" :row-style="{height: '35px'}">
            <el-table-column prop="member_name" label="用户名称" @contextmenu.prevent=""></el-table-column>
            <el-table-column prop="member_phone_num" label="手机号码" width="240px"></el-table-column>
            <el-table-column prop="member_email" label="邮箱地址" width='240px'></el-table-column>
            <el-table-column prop="join_time" :formatter="dateFormat" label="加入日期" width="240px"></el-table-column>
            <el-table-column fixed="right" width="50">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="详细信息" placement="bottom-end">
                  <el-button @click.native="redoFile(scope.row.id)" type="text" style="color: #999" size="mini">
                    <i class="el-icon-thumb"></i>
                    <!--还没想好做不做这个 感觉用处不大-->
                  </el-button>
                </el-tooltip>
            </template>
            </el-table-column>
            <el-table-column v-if="is_creator" fixed="right" width="50">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="移除用户" placement="bottom-end">
                  <el-button @click.native="DelMember(scope.row.member,scope.row.team)" type="text" style="color: #999" size="mini">
                    <i class="el-icon-delete-solid"></i>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
        </el-table>

        </el-main>
<!--        <el-dialog title="确认清空回收站" :visible.sync="dialog3" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog3=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="Empty()" >确定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
<!--        <el-dialog title="确认将文档从回收站放回原处" :visible.sync="dialog" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="submitredo()" >确定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
<!--        <el-dialog title="确认将文档从回收站彻底删除" :visible.sync="dialog2" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog2=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="submitdel()" >确定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
    </el-container>
</template>

<script>
  import Vue from 'vue'
  import fecha from 'fecha'
  export default {
    inject: ['reload'],
    data() {
      return {
        activeIndex:'2',
        tableData: [],
        //dialog: false,
        //dialog1: false,
        //dialog2: false,
        //dialog3: false,
        id: '1',
        uid_todel:'',
        members:
        [
            {
                member:'',
                member_name:'',
                member_email:'',
                memeber_phone_num:'',
                member_create_time:'',
                join_time:'',
                team:''

            },
        ],
           teaminfo:
        {
            id:"",
            name:"",
            create_time:"",
            creator:"",
            members:[]

        },
               userinfo: {
                id: "",
                username: "",
                email: "",
                phone_num: "",
            },
        is_creator:false,
        inviteForm: {
        id: ''
      },
      invite_dialogVisible: false
      }
    },
    created() {
                var that=this;
    this.team_id=this.$route.params.id.toString();
     this.getUserInfo();
     this.getTeamInfo();
        this.getmembers();
    this.$http.get('http://175.24.121.113:8000/myapp/team/check/creator/',
        {headers: {token: window.sessionStorage.getItem('token')},
        params: {team_id: that.team_id}}
    ).then(()=>{
        that.is_creator=true;
    }).catch(()=>{
        that.is_creator=false;
    });

    },
        watch: {//监听下个访问的东西是不是还是teamspace，是则重新获取

        '$route' (to, from) {
            if(to.name === 'Teamsmember'){
                        var that = this;
                this.getDoclist();
                this.getUserInfo();
                 this.getTeamInfo();
                  this.$http.get('http://175.24.121.113:8000/myapp/team/check/creator/',
            {headers: {token: window.sessionStorage.getItem('token')},
            params: {team_id: that.team_id}}
        ).then(()=>{
            that.is_creator=true;
         }).catch(()=>{
             that.is_creator=false;
               });
            }
            if(from.name==='post')//纯粹为了避免unused
            {
                this.five++;
            }
        }
    },
    methods:{
             toTeam(){
          this.team_id = this.$route.params.id;
          this.$router.push("/TeamSpace/"+this.team_id);
      },
      getTabledata() {
      var that = this;
      Vue.axios.get(
        'http://175.24.121.113:8000/myapp/file/delete/get/',
        {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function(res){
        that.tableData=res.data.data;
      }).catch(function(error){
        console.log(error.response.data.info);
      })
    },
    getmembers()
    {
        var that=this;
        Vue.axios.get(
            'http://175.24.121.113:8000/myapp/team/members/get/',
            {
              headers: {'token': window.sessionStorage.getItem('token')},
              params:{team_id: that.$route.params.id.toString()}}
        ).
        then(function (res) {
            that.members=res.data.data
            console.log(res.data);
        }).catch(function (error) {
            console.log(error.response);
        });
    },
    DelMember(uid,tid)
    {
        this.$confirm('确定将此用户移出团队?', '移出用户', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
        }).then(() => {
            this.submitdelMember(uid,tid);
        });
    },
    submitdelMember(uid,tid)
    {
        var that=this;
        this.$http.post('http://175.24.121.113:8000/myapp/team/kickoff/', this.$qs.stringify({
                   team_id: tid,//that.$route.params.id.toString(),
                   member_id:uid
              }), {headers: {token: window.sessionStorage.getItem("token")}}
      ). then(function (res) {
            that.$message({
              message: "成功移除成员",//+res.data.file_id,
              type: "success",

          });
        console.log(res.data);
      }).catch(function (error) {
          console.log(uid)
          console.log(tid)
        that.$message.error(error.response.data.info);
      });
      //this.dialog2=false;
      this.getmembers();
      this.reload();

    },
    dateFormat(row, column, cellValue) {
        return cellValue ? fecha.format(new Date(cellValue), 'YYYY-MM-DD') : '';
      },
    time(a) {
      this.doctime = a.toString().substr(0, 10);
         return this.doctime;
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
    redoFile(file_id){
        this.$confirm('确定将回收站文件放回原处?', '文档恢复', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
        }).then(() => {
            this.id = file_id
            this.submitredo();
        });
    },
    submitredo(){
      var that=this
      this.$http.get('http://175.24.121.113:8000/myapp/file/isdelete/',{
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: this.id, is_delete: 'False'}
      }
      ).then(function () {
          that.$message({
              message: "恢复成功",//+res.data.file_id,
              type: "success"
          });
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });
      //this.dialog=false;
      this.getTabledata();
      this.reload();
    },
    delFile(file_id){
        this.$confirm('确定此文件彻底删除?', '文档彻底删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
        }).then(() => {
            this.id = file_id
            this.submitdel();
        });
    },
    submitdel(){
      var that=this
      this.$http.get('http://175.24.121.113:8000/myapp/file/realdelete/',{
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: this.id}
      }
      ).then(function () {
          that.$message({
              message: "成功彻底删除",//+res.data.file_id,
              type: "success",
          });
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });
      //this.dialog2=false;
      this.getTabledata();
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
    }    ,
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
      this.getTabledata();
      this.reload();
    },
    emptyTrash(){
        this.$confirm('确定清空回收站所有文件?', '清空回收站', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.Empty();
        });
    },
    Empty() {
          var that=this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/delete/all/',{
                headers: {token: window.sessionStorage.getItem("token")}
      }
      ).then(function () {
        that.$message({
            message: '已经成功清空回收站',
            type: 'success'
        });
      }).catch(function (error) {
        that.$messgae.error(error.response.data.info);
      });
      //this.dialog3=false;
      this.getTabledata();
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
      this.getTabledata();
      this.reload();
    },
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
              params:{team_id: that.$route.params.id.toString()}}
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
        manage_member()
    {
        this.team_id=this.$route.params.id;
        this.$router.push('/Teammember/'+this.team_id)
    },
       exitTeam(){
        this.$confirm('确定退出团队吗', '退出团队', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.submitexit();
        });
      },
      dismissTeam(){
          this.$confirm('确定解散团队吗', '解散团队', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.submitDismiss();
          });
      },
      submitDismiss() {
          var that = this;
          this.$http.get('http://175.24.121.113:8000/myapp/team/dismiss/',
              {headers: {token: window.sessionStorage.getItem("token")}, params: {team_id: that.team_id}}
          ).then(() => {
              that.$message({
                  message: '成功解散团队',
                  type: 'success'
              });
              that.reload();
              that.$router.push("/");
          }).catch(function (error) {
              that.$message.error(error.response.data.info);
          });
          //this.dialog=false;
      },
    submitexit(){
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/team/exit/',
          {headers: {token: window.sessionStorage.getItem("token")}, params: {team_id: that.team_id}}
      ).then(() => {
          that.$message({
              message: '成功退出团队',
              type: 'success'
          });
          that.reload();
          that.$router.push("/");
      }).catch(function (error) {
          that.$message.error(error.response.data.info);
      });
      //this.dialog=false;
    },
       invite() {
        var that = this;
        this.$http.post('http://175.24.121.113:8000/myapp/team/invite/', this.$qs.stringify({
                team_id: that.team_id, member_id: that.inviteForm.id
              }), {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(() => {
            that.$message({
                message: '邀请信息发送成功',
                type: 'success'
            });
            that.reload();
        }).catch(function (error) {
            that.$message.error(error.response.data.info);
        });
        that.dialogVisible = false;
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
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    color: rgb(180, 180, 180);
    margin-right: 0;
    margin-bottom: 0;
    width: 20%;
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
.Empty {
  height: 30px;
  width: 150px;
  background-color: rgb(180, 180, 180);
  font-size: 11px;
  margin-top: 20px;
  margin-right: 100px;
  color: rgb(36, 36, 36);
  position: relative;
  cursor: pointer;
  .bt {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%)translateY(-50%);
  }
}
.emptytrash{
    height: 40px;
    width: 130px;
    margin-top: 20px;
    position:absolute;
    margin-left:700px;
}
.delfile{
 height: 40px;
 width: 130px;
 margin-top: 20px;
 margin-right:20px;
}
</style>