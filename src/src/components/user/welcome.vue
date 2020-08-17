<template>

    <el-container class="Info_Container">
        <el-header>
        <el-row  class="row-bg" :gutter="10">
        <el-col :span="3"><div class="grid-content bg-purple">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="64"></el-avatar>
            </div>
        </el-col>
        <el-col :span="4">
            <br>
            <p style="text-align:center" font-size="xx-large"><strong>{{username}}</strong></p>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <p>创建<strong>{{create_files}}</strong>个文档</p>
                <p>收藏<strong>{{files_favor}}</strong>个文档</p>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <p>文档被收藏<strong>{{files_been_favor}}</strong>次</p>
                <p>文档被评论<strong>{{receive_comments}}</strong>次</p>
            </div>
        </el-col>
        </el-row>
        </el-header>
        <el-divider></el-divider>
        <el-container>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="10">
                    <div style="margin-top:5px">ID: {{id}}</div>
                </el-col>
                <el-col :span="10">
                    <div style="margin-top:5px" >角色：<el-tag type="worning">注册用户</el-tag></div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <div style="margin-top:5px">手机号：{{phone_num}}</div>
                </el-col>
                <el-col :span="10">
                    <div style="margin-top:5px">邮箱：{{email}}</div>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <div>
            自破壳以来，我已经创建了{{create_teams}}个团队，加入了{{join_teams}}个团队。对这个世界发表了{{make_comments}}条评论，收到了{{total_agree}}个赞和{{total_disagree}}个踩！
            </div>
        </el-main>
        </el-container>
    </el-container>
</template>

<script>
//import QS from "qs";
export default {
    name: "Userinfo",
    data(){
        return {
            id: '',
            username: '',
            phone_num: '',
            email: '',
            create_files:'',
            files_favor:'',
            files_been_favor:'',
            make_comments:'',
            receive_comments:'',
            create_teams:'',
            join_teams:'',
            total_agree:'',
            total_disagree:'',
        }
    },
    created: function(){
        this.token=window.sessionStorage.getItem('token');
        this.getAchieve();
        this.getInfo();
    },
    methods:{
        getInfo(){
            var that = this;
            this.$http.get('http://175.24.121.113:8000/myapp/user/info/',
                {headers:{token:this.token}}
            ).then(res=>{
                that.username=res.data.data.username;
                that.phone_num=res.data.data.phone_num;
                that.id=res.data.data.id;
                that.email=res.data.data.email;
                console.log(res.data.data);
            }).catch(function(error){
                console.log(error);
            })
        },
        getAchieve(){
            var that = this;
            this.$http.get('http://175.24.121.113:8000/myapp/user/achieve/',
                {headers:{token:this.token}}
            ).then(res=>{
                that.username=res.data.data.username;
                that.create_files=res.data.data.create_files;
                that.files_favor=res.data.data.files_favor;
                that.files_been_favor=res.data.data.files_been_favor;
                that.make_comments=res.data.data.make_comments;
                that.receive_comments=res.data.data.receive_comments;
                that.create_teams=res.data.data.create_teams;
                that.join_teams=res.data.data.join_teams;
                that.total_agree=res.data.data.total_agree;
                that.total_disagree=res.data.data.total_disagree;
                console.log(res.data.data);
            }).catch(function(error){
                console.log(error);
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .Info_Container{
        //background-color:#F2F6FC;
        text-align: left;
        height:100%;
        padding-left: 10%;
        padding-right: 10%;
    }
    
    .el-main{
        vertical-align: center;
        text-align: center;

    }
    .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
</style>