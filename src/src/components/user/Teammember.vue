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
      <el-main>
        <el-card class="info" :body-style="{ padding: '0px' }">
          <div>
            <div class="avatar_box">
              <img src="../../assets/logo.png" alt="">
            </div>
            <el-button class="changeteampic" type="info" plain>
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
        <el-table :data="members" height="300px" class="usertable" :default-sort = "{prop: 'member_name', order: 'descending'}" :row-style="{height: '35px'}">
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
.info {
  height: 50%;
  width: 100%;
  position: relative;
  .avatar_box { 
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 0px #ddd;
    position: absolute;
    left: 5%;
    top: 10%;
    opacity: 90%;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .changeteampic {
    position: absolute;
    left: 8.7%;
    top: 80%;
  }

  .invite {
    position: absolute;
    left: 85%;
    top: 15%
  }

  .message {
    position:absolute;
    left: 30%;
    top: 10%;
    color: rgb(100, 100, 100);
  }
}

.table {
  height: 45%;
  width: 100%;
  position: relative;
  top: 5%;
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