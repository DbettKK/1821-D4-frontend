<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
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
<!--          <el-card :body-style="{ padding: '0px' }" shadow="hover" class="newfile" @click.native="dialog=true">-->
<!--            <i class="el-icon-delete-solid bt">退出团队</i>-->
<!--          </el-card>-->
        </el-header>
<!--        <el-dialog title="是否退出团队" :visible.sync="dialog" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="submit()">确 定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
        <el-main>
            <el-card class="item" :body-style="{ padding: '0px' }">
                <el-button class="invite" type="primary" @click="dialogVisible = true">邀请成员</el-button>
            </el-card>
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
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
        </el-main>
        
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
export default {
    inject: ['reload'],
  data() {
    return {
        is_creator: false,
      file_id: null,
      team_id: null,
      id: null,
      //dialog: false,
      activeIndex:'2',
      inviteForm: {
        id: ''
      },
      dialogVisible: false
    };
  },
  created() {
        var that=this;
    this.team_id=this.$route.params.id.toString();
    this.$http.get('http://175.24.121.113:8000/myapp/team/check/creator/',
        {headers: {token: window.sessionStorage.getItem('token')},
        params: {team_id: that.team_id}}
    ).then(()=>{
        that.is_creator=true;
    }).catch(()=>{
        that.is_creator=false;
        console.log(that.is_creator);
    });
  },
  methods: {
      toTeam(){
          this.team_id = this.$route.params.id;
          this.$router.push("/TeamSpace/"+this.team_id);
      },
      Teammessage(){
          this.team_id = this.$route.params.id;
          this.$router.push("/Teammessage/"+this.team_id);
      },
      time(a) {
        this.doctime = a.toString().substr(0, 10);
        return this.doctime
      },
      exitTeam(){
        this.$confirm('确定退出团队吗', '退出团队', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.submit();
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
              //that.$router.push("/");
          }).catch(function (error) {
              that.$message.error(error.response.data.info);
          });
          //this.dialog=false;
      },
    submit(){
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/team/exit/',
          {headers: {token: window.sessionStorage.getItem("token")}, params: {team_id: that.team_id}}
      ).then(() => {
          that.$message({
              message: '成功退出团队',
              type: 'success'
          });
          that.reload();
          //that.$router.push("/");
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
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>

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
.delfile{
 height: 40px;
 width: 130px;
 margin-top: 20px;
 margin-right: 80px;
}

.item{
    height: 40%;
    width: 40%;
    .invite{
        position: absolute;
        left: 40%;
        top: 23%
    }
}

.invite_form {
    opacity: 100%;
    padding-top: 0;
    width: 100%;
    padding-left: 0;
    box-sizing: border-box;
  }
</style>