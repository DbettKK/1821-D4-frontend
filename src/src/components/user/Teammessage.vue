<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="toTeam()">团队文档</el-menu-item>
            <el-menu-item index="2" @click="Teammessage()">团队信息</el-menu-item>
          </el-menu>
          <el-card :body-style="{ padding: '0px' }" shadow="hover" class="newfile" @click.native="dialog=true">
            <i class="el-icon-delete-solid bt">退出团队</i>
          </el-card>
        </el-header>
        <el-dialog title="是否退出团队" :visible.sync="dialog" width="30%">
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialog=false">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
          </div>
        </el-dialog>
        <el-main>
          
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
      file_id: null,
      team_id: null,
      id: null,
      dialog: false,
      activeIndex:'2'
    };
  },
  created() {
    this.team_id=this.$route.params.id.toString();
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
         this.doctime = a.toString().substr(0, 10)
         return this.doctime
    },
    submit(){
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/team/exit/', {headers: {token: window.sessionStorage.getItem("token")}, params: {team_id: that.team_id}}
      ).then(function (res) {
        console.log(res.data);
      }).catch(function (error) {
        console.log(error.response);
      });
      this.dialog=false;
      this.$router.push("/");
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
</style>