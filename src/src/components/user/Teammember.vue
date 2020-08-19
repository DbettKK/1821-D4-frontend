<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
      <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
        <span style="color: grey;font-size: 30px">{{teaminfo.name}}</span>
      </el-header> 
      <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between; margin-top:0px;">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1" @click.native="toTeam()">团队文档</el-menu-item>
          <el-menu-item index="2" @click="manage_member()">团队信息</el-menu-item>
        </el-menu>
        <el-button class="delteam" type="danger" @click.native="exitTeam" v-if="!is_creator">
          <i class="el-icon-delete-solid"></i><span>退出团队</span>
        </el-button>
        <el-button class="delteam" type="danger" @click.native="dismissTeam" v-else>
          <i class="el-icon-delete-solid"></i><span>解散团队</span>
        </el-button>
      </el-header>
      <el-dialog
        title="邀请用户"
        :visible.sync="invite_dialogVisible"
        width="40%">
        <div style="margin-bottom:20px">
          <!--
          <el-radio v-model="invite_mod" label="1">使用id邀请</el-radio>
          -->
          <el-radio v-model="invite_mod" label="2">使用用户名邀请</el-radio>
          <el-radio v-model="invite_mod" label="3" style="margin-left:5%">使用邮箱邀请</el-radio>
         </div>
        <div v-if="invite_mod=='1'">
          <div style="margin-bottom: 20px">
           <span>被邀请人的ID:</span>
          </div>
        <el-form ref="inviteFormRef" :model="inviteForm" label-width="0px" class="invite_form">
          <el-form-item prop="id">
            <el-input placeholder="ID:" v-model="inviteForm.id" style='width:300px'></el-input>
            <el-button style='margin-left:30px'>查找</el-button>
          </el-form-item>
        </el-form>
        </div>
        <div v-if="invite_mod=='2'">
          <div style="margin-bottom: 20px">
           <span>被邀请人的用户名:</span>
          </div>
          <el-form ref="inviteFormRef" :model="inviteForm" label-width="0px" class="invite_form">
            <el-form-item prop="name">
              <el-input placeholder="用户名:" v-model="inviteForm.name" style='width:75%' @blur="getUserformat"></el-input>
                <el-button style='margin-left:3%' @click.native='getUserformat'>查找</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="invite_mod=='3'">
          <div style="margin-bottom: 20px">
           <span>被邀请人的邮箱:</span>
          </div>
          <el-form ref="inviteFormRef" :model="inviteForm" label-width="0px" class="invite_form">
            <el-form-item prop="email">
              <el-input placeholder="邮箱:" v-model="inviteForm.email" style='width:75%' @blur="getUserformat"></el-input>
                 <el-button style='margin-left:3%' @click.native='getUserformat'>查找</el-button>
            </el-form-item>
          </el-form>
        </div>
          <el-table :data="found_user_format" height=200px style="width: 100%" :default-sort = "{prop: 'name', order: 'descending'}" :row-style="{height: '25px'}">
            <el-table-column prop="username" label="用户名" @contextmenu.prevent=""></el-table-column>
            <el-table-column prop="email" label="邮箱" width="200px"></el-table-column>
            <el-table-column prop="create_time" :formatter="dateFormat" label="创建日期" width="140px"></el-table-column>
            <el-table-column  fixed="right" width="50px" label="邀请">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="邀请" placement="bottom-end">
                  <el-button @click.native="add_click(scope.row.id)" type="text" style="color: #999" size="mini">
                    <i class="el-icon-circle-plus"></i>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
        </el-table>


        <span slot="footer" class="dialog-footer">
          <el-button @click.native="clearout">取 消</el-button>
          <el-button type="primary" @click.native="clearout">确定</el-button>
          <!--
          <el-button type="primary" @click.native="invite()">确 定</el-button>
          -->
        </span>
      </el-dialog>
      <el-main>
        <el-card class="info" :body-style="{ padding: '0px' }">
          <div>
            <el-avatar class="teampic" :size="180" :src="teaminfo.avatar" style="margin-right: 20px"></el-avatar>
            <el-button class="changeteampic" type="info" plain @click.native="changepic()">
              <i class="el-icon-edit"></i><span>修改头像</span>
            </el-button>
          </div>
          <div class="message">
            <p>团队名称：{{this.teaminfo.name}}</p>
            <p>创建者：{{this.teaminfo.creator_name}}</p>
            <p>创建日期：{{time(this.teaminfo.create_time)}}</p>
            <p>成员人数：{{this.teaminfo.members.length}}</p>
            <p>拥有文件：{{this.teaminfo.teamfiles.length}}</p>
          </div>
          <el-button class="invite" type="primary" @click.native="invite_dialogVisible = true" >
            <i class="el-icon-circle-plus-outline"></i><span>邀请成员</span>
          </el-button>
        </el-card>
        <el-card class="table" :body-style="{ padding: '0px' }">
        <el-table :data="members" class="usertable" :default-sort = "{prop: 'member_name', order: 'descending'}" :row-style="{height: '35px'}">
            <el-table-column prop="member_name" label="用户名称" @contextmenu.prevent=""></el-table-column>
            <el-table-column prop="member_phone_num" label="手机号码" width="240px"></el-table-column>
            <el-table-column prop="member_email" label="邮箱地址" width='240px'></el-table-column>
            <el-table-column prop="join_time" :formatter="dateFormat" label="加入日期" width="240px"></el-table-column>
            <el-table-column fixed="right" width="50" v-if = "this.is_creator == true">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="移除用户" placement="bottom-end">
                  <el-button @click.native="DelMember(scope.row.member,scope.row.team)" type="text" style="color: #999" size="mini">
                    <i class="el-icon-delete-solid"></i>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
        </el-table>
        </el-card>
      </el-main>
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
        teaminfo: {},
        userinfo: {
          id: "",
          username: "",
          email: "",
          phone_num: "",
        },
        is_creator:false,
        inviteForm: {
        id: '',
        name:'',
        email:''
      },
      invite_dialogVisible: false,
      invite_mod: 0,
      //1 使用id  2使用昵称  3 使用邮箱
      found_user_format:[
        {
          username:'',
          email:'',
          create_time:''
        }
      ]

      }
    },
    created() {
      var that=this;
      let str=window.atob(this.$route.params.id).substr(11);
    this.team_id=str.substr(0,str.length-2);
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
      clearout(){
        this.invite_dialogVisible=false;
        this.found_user_format = [];
        this.inviteForm = {};
      },
      toTeam(){
          this.team_id = this.$route.params.id;
          this.$router.push("/TeamSpace/"+this.team_id);
      },
    getmembers()
    {
        var that=this;
        Vue.axios.get(
            'http://175.24.121.113:8000/myapp/team/members/get/',
            {
              headers: {'token': window.sessionStorage.getItem('token')},
              params:{team_id: that.team_id}}
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
                this.teaminfo=res.data.data;
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
        if(this.invite_mod=='1')
        {
        this.$http.post('http://175.24.121.113:8000/myapp/team/invite/', this.$qs.stringify({
                team_id: that.team_id, member_id: that.inviteForm.id
              }), {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(() => {
            that.$message({
                message: '邀请信息发送成功',
                type: 'success'
            });
            //that.reload();
        }).catch(function (error) {
            that.$message.error(error.response.data.info);
        });
        }
        else if(this.invite_mod=='2')
        {
             this.$http.post('http://175.24.121.113:8000/myapp/team/invite/', this.$qs.stringify({
                team_id: that.team_id,member_name:that.inviteForm.name
              }), {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(() => {
            that.$message({
                message: '邀请信息发送成功',
                type: 'success'
            });
            //that.reload();
        }).catch(function (error) {
            that.$message.error(error.response.data.info);
        });
        }
        else if(this.invite_mod=='3')
        {
          this.$http.post('http://175.24.121.113:8000/myapp/team/invite/', this.$qs.stringify({
                team_id: that.team_id, member_email:that.inviteForm.email
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

        }
        that.dialogVisible = false;
    },
    getUserformat()
    {
      var that=this;
       if(this.invite_mod=='2')
        {
             this.$http.post('http://175.24.121.113:8000/myapp/team/find/invite/', this.$qs.stringify({
                username:that.inviteForm.name
              }), {headers: {token: window.sessionStorage.getItem("token")}}        
      ).then(function(res) {
           that.found_user_format=res.data.data;
       //     that.reload();
        }).catch(function (error) {
            that.$message.error(error.response.data.info);
        });
        }
        else if(this.invite_mod=='3')
        {
          this.$http.post('http://175.24.121.113:8000/myapp/team/find/invite/', this.$qs.stringify({
                email:that.inviteForm.email
              }), {headers: {token: window.sessionStorage.getItem("token")}}
        ).then(function(res) {
           that.found_user_format=res.data.data;
         //   that.reload();
        }).catch(function (error) {
            that.$message.error(error.response.data.info);
        });

        }
      

    },
    add_click(uid)
    { 
      var that=this;
      this.$http.post('http://175.24.121.113:8000/myapp/team/invite/', this.$qs.stringify({
                team_id: that.team_id, member_id:uid
              }), {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(() => {
            that.$message({
                message: '邀请信息发送成功',
                type: 'success'
            });
            //that.reload();
        }).catch(function (error) {
            that.$message.error(error.response.data.info);
        });
    },
    changepic() {
            var that = this;
            this.$http.get('http://175.24.121.113:8000/myapp/team/avatar/change/',
                {headers: {token: window.sessionStorage.getItem("token")}, params: {team_id: that.team_id}}
            ).then(()=>{
                that.$message({
                    message: '修改成功',
                    type: 'success'
                });
                that.reload();
            }).catch(function(error){
                console.log(error);
            })
        }

    }
  }
</script>

<style lang="less" scoped>
.info {
  height: 320px;
  width: 100%;
  position: relative;

  .teampic {
    position: absolute;
    left: 6.8%;
    top: 45px
  }
  

  .changeteampic {
    position: absolute;
    left: 9%;
    top: 250px;
  }

  .invite {
    position: absolute;
    left: 85%;
    top: 48px
  }

  .message {
    position:absolute;
    left: 28%;
    top: 54px;
    color: rgb(100, 100, 100);
  }
}

.table {
  width: 100%;
  position: relative;
  top: 20px;
  .usertable{
    width: 98%;
    height: 100%;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.delteam {
  height: 40px;
  width: 150px;
  margin-right: 40px
}
</style>