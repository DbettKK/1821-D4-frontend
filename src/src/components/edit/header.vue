<template>
    <el-row type="flex" class="row-bg">
        <!-- 居中 -->
        <el-col :span="3"><div class="grid-content bg-purple fonttitle">金刚石文档</div></el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <el-breadcrumb separator="/" >
                    <el-breadcrumb-item @click.native="home">首页</el-breadcrumb-item>
                    <el-breadcrumb-item @click.native="recently">工作台</el-breadcrumb-item>
                    <el-breadcrumb-item>文档编辑</el-breadcrumb-item>
                    <el-breadcrumb-item ><div @click="showcomment" >用户评论</div></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-col>
        <el-col :span="7"></el-col>
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
                <el-button class="share-button" icon="el-icon-share" type="primary" @click.native="dialogVisible = true; shareURL = baseURL+file_id"></el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="2"><el-button type="primary" @click="Submit">保存</el-button></el-col>
        <el-col :span="2"><div class="grid-content2 bg-purple">{{can_edit?'正在编辑':'浏览模式'}}</div></el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
          <el-dropdown>
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="40"></el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><router-link to="/changeinfo" class="a">信息修改</router-link></el-dropdown-item>
                <el-dropdown-item><div @click="exit">退出登录</div></el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
          </div>
        </el-col>
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
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click=";dialogVisible=false;" >确定</el-button>
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
        }
    },
    data() {
      return {
        baseURL: 'http://localhost:8080/edit/',
        shareURL: '',
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
      recently() {
            this.$router.push('/recently')
      },
      getdata(val){
        this.team_belong=val;
      },
      home(){
        this.$router.push('/')
      },
      get_G(){
        this.$http.get('http://175.24.121.113:8000/myapp/team/all/get/',
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
          }else{
              this.$message({message: '您没有这个权限哦', type: 'warning'})
          }

        },
      handleClose(){

      },
      Collect() {
        if(this.collect == true){
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
        if(this.team_belong == false){
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
        Vue.axios.get('http://175.24.121.113:8000/myapp/file/privi/change/team/',
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
                'http://175.24.121.113:8000/myapp/mdSave/',
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
                }).catch(res => {
                    console.log(res);
            });
      },
      C_file(){
            Vue.axios.get(
                'http://175.24.121.113:8000/myapp/file/favorite',
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
                'http://175.24.121.113:8000/myapp/file/cancelfavor',
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
      }
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
    background: #e7eff8;
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
    background-color: #e7eff8;
  }
  .a{
    text-decoration: none;
    color:#333;
}
</style>
