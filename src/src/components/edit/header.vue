<template>
    <el-row type="flex" class="row-bg">
        <!-- 居中 -->
        <el-col :span="3"><div class="grid-content bg-purple fonttitle">金刚石文档</div></el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <el-breadcrumb separator="/" >
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/myproduction' }">工作台</el-breadcrumb-item>
                    <el-breadcrumb-item>{{title+'.docx'}}</el-breadcrumb-item>
<!--                    <el-breadcrumb-item><div @click="showcomment" class="font_comment"><b>文档评论</b></div></el-breadcrumb-item>-->
                </el-breadcrumb>
            </div>
        </el-col>
        <el-col :span="6"></el-col>
        <el-col :span="1">
            <el-tooltip class="item" effect="light" content="用户评论" placement="bottom-end">
                <el-button type="primary" icon="el-icon-edit" @click="showcomment"></el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="1">
             <el-tooltip class="item" effect="light" content="用户收藏" placement="bottom">
              <el-button class="share-button" icon="el-icon-star-on" type="primary" v-if="show_collect" @click="Collect"></el-button>
              <el-button class="share-button" type="primary" v-else icon="el-icon-star-off" @click="Collect"></el-button>
             </el-tooltip>
        </el-col>
        <el-col :span="1">
          <el-tooltip class="item" effect="light" content="添加到团队中" placement="bottom-end">
            <el-button class="share-button" icon="el-icon-folder-add" type="primary" @click="Add_G" ></el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="1">
            <el-tooltip class="item" effect="light" content="分享" placement="bottom-end">
                <el-button class="share-button" icon="el-icon-share" type="primary" @click.native="judgeShare"></el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="2"><el-button type="primary" @click="Submit">保存</el-button></el-col>
        <el-col :span="2"><div class="grid-content2 bg-purple">{{can_edit?'正在编辑':'浏览模式'}}</div></el-col>
<!--        <el-col :span="2">-->
<!--          <div class="grid-content bg-purple">-->
<!--          <el-dropdown>-->
<!--            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="40"></el-avatar>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item><router-link to="/changeinfo" class="a">信息修改</router-link></el-dropdown-item>-->
<!--                <el-dropdown-item><div @click="exit">退出登录</div></el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--          </el-dropdown>-->
<!--          </div>-->
<!--        </el-col>-->
        <el-dialog title="请选择想要上传的团队空间" :visible.sync="dialog_G" width="30%">
          <el-form>
            <el-form-item label="团队空间" required>
              <el-select v-model="teamspace" placeholder="请选择">
                <el-option v-for="ts in teamspaces" :key="ts.id" :label="ts.name" :value="ts.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialog_G=false">取 消</el-button>
            <el-button type="primary" @click="Choose_G" >确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="获得链接的人都可以查看"
          :visible.sync="dialogVisible"
          width="40%">
          <el-form>
              <el-form-item label="站内分享链接">
                  {{shareURL}}
              </el-form-item>
              <el-form-item label="游客分享链接">
                  {{shareURLOther}}
              </el-form-item>
              <el-form-item label="点击复制站内链接">
                  <el-button
                          v-clipboard:copy="shareURL"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError">复制链接</el-button>
              </el-form-item>
              <el-form-item label="点击复制游客链接">
                  <el-button
                          v-clipboard:copy="shareURLOther"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError">复制链接</el-button>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible=false" >确定</el-button>
          </div>
        </el-dialog>
    </el-row>

</template>

<script>
  import Vue from 'vue'
  export default {
    props:{
        url:{
          type:String,
        },
        title:{
          type:String,
        },
        content:{
          type:String,
        },
        file_id:{
          type:Number,
          default:-1
        },
        collect:{
          type:Boolean,
        },
        can_share:{
            type:Boolean,
        },
        can_edit:{
          type:Boolean,
        },
        team_belong:{
          type:Boolean,
        },
    },
    data() {
      return {
        baseURL: 'https://dbettkk.top/edit/',
        shareURL: '',
          shareURLOther: '',
        show_collect:false,
        dialogVisible:false,
        dialog_G:false,
        show:true,
        teamspace:'',
        teamspaces: [],
      };
    },
    created:function(){
      this.get_G();
    },
    watch:{
      collect:function () {
        if(this.collect == true)
          this.show_collect=true;
        else
          this.show_collect=false;
      }
    },
    methods: {
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
      getdata(val){
        this.team_belong=val;
      },
      get_G(){
        this.$http.get(this.$API + '/team/all/get/',
                {headers: {token: window.sessionStorage.getItem("token")}}
        ).then(res => {
          this.teamspaces = res.data.data;
        });
      },
      showcomment(){
          this.$emit('event1',this.show)
      },
        judgeShare(){
          if(this.can_share){
              this.dialogVisible = true
              this.shareURL = this.baseURL + window.btoa('hello,world'+this.file_id+'s');
              this.shareURLOther = 'https://dbettkk.top/preview2/' + window.btoa('hello,world'+this.file_id+'s');
          }else{
              this.$message({message: '您没有这个权限哦', type: 'warning'})
          }

        },
      handleClose(){

      },
      Collect() {
        if (this.collect) {
          this.$message({
            message: '您已取消收藏',
            type: 'warning'
          });
          this.collect=false;
          this.Q_file();
        }
        else    {
            this.collect=true;
            this.$message({
              message: '您已成功收藏',
              type: 'success'
            });
            this.C_file();
        }
      },
      ToInfo(){
        this.$router.push(
            '/changeInfo'
        );
      },
      Add_G(){
        console.log("team:"+this.team_belong);
        if (!this.team_belong) {
          this.dialog_G=true
        }
        else
          this.$message({
              message: '该文件已经添加团队！',
              type: 'warning'
            });
      },
      Choose_G(){
        this.dialog_G=false;
        Vue.axios.get(this.$API + '/file/privi/change/team/',
              {
                headers: {token: window.sessionStorage.getItem("token")},
                params: {file_id: this.file_id, team_id: this.teamspace}
              }
        ).then((res)=> {
          this.$message({
            message: "成功上传到团队空间",//+res.data.file_id,
            type: "success",
          });
          this.dialog_G = false;
          console.log(res);
          this.team_belong=true;
        }).catch((error)=> {
          this.$message.error(error.response.data.info);
        });
      },
      exit(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      Submit(){
        Vue.axios.post(
                this.$API + '/mdSave/',
                this.$qs.stringify({
                    title:this.title,
                    content:this.content
                }),
                {
                    headers: {
                        'token': window.sessionStorage.getItem('token')

                    },
                    params:{
                    file_id: this.file_id,
                    }
                }).then(res => {
                    console.log(res);
                    this.$notify({
                    title: '成功',
                    message: '您已成功提交修改！',
                    type: 'success'
                  });
                    this.$router.push('/recently');
                }).catch(res => {
                    console.log(res);
            });
      },
      C_file(){
            Vue.axios.get(
                this.$API + '/file/favorite',
                {
                headers:{
                    token: window.sessionStorage.getItem('token')
                    },
                  params:{
                    file_id:this.file_id
                  }
                }
            ).then(res=>{
                console.log(res.data);
            }).catch(function(error){
                console.log(error);
            })
      },
      Q_file(){
        Vue.axios.get(
                this.$API + '/file/cancelfavor',
                {
                headers:{
                    token: window.sessionStorage.getItem('token')
                    },
                  params:{
                    file_id:this.file_id
                  }
                }
            ).then(res=>{
                console.log(res.data);
            }).catch(function(error){
                console.log(error);
            })
      },
    }
  }
</script>

<style scoped>
    .el-row {
        margin-bottom: 15px;
    }
    .el-col {
    border-radius: 4px;
    }
  .bg-purple {
    background: #F2F6FC;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .fonttitle{
    font-size: 20px;
  }
  .grid-content2{
    border-radius: 4px;
    min-height: 36px;
    font-size: 15px;
    display:flex;
    justify-content:center;
    align-items:center;
    color: #409EFF;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #F2F6FC;
  }
  .a{
    text-decoration: none;
    color:#333;
}
  .font_comment{
    color: rgb(133, 133, 235);
  }
</style>
