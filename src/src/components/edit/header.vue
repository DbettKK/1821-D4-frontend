<template>
    <el-row type="flex" class="row-bg">
        <!-- 居中 -->
        <el-col :span="3"><div class="grid-content bg-purple">金刚石文档</div></el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>首页</el-breadcrumb-item>
                    <el-breadcrumb-item><a href="/recently">工作台</a></el-breadcrumb-item>
                    <el-breadcrumb-item>文档编辑</el-breadcrumb-item>
                    <el-breadcrumb-item><div @click="showcomment">用户评论</div></el-breadcrumb-item>
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
            <el-button class="share-button" icon="el-icon-folder-add" type="primary" @click="Add_G"></el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="1">
          <el-button class="share-button" icon="el-icon-share" type="primary" @click="dialogVisible = true"></el-button>
          <el-dialog
            title=文档分享
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>您的文档邀请码为：{{file_id}}</span>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
        <el-col :span="2"><el-button type="primary" @click="Submit">保存</el-button></el-col>
        <el-col :span="2" v-color:><div class="grid-content2 bg-purple">正在编辑</div></el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
          <el-dropdown>
            <el-avatar> user </el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><router-link to="/changeinfo" class="a">信息修改</router-link></el-dropdown-item>
                <el-dropdown-item><div @click="exit">退出登录</div></el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
          </div>
        </el-col>
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
        },
        collect:{
          type:Boolean,
        }
    },
    data() {
      return {
        show_collect:false,
        dialogVisible:false,
        show:true
      };
    },
    created:function(){
        this.Get_file();
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
      showcomment(){
        this.$emit('event1',this.show)
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
    font-size: 15px;
    display:flex;
    justify-content:center;
    align-items:center;
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
