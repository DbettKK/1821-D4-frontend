<template>

    <el-container class="Info_Container">
        <el-header>
            <div style="font-size:24px;color:grey;margin:10px" ><b>个人信息查看</b></div>
<!--            <span><i class="el-icon-s-custom" style="font-size:20px"></i>&nbsp;</span>-->
        </el-header>
        <br><br><br>
        <div style="margin-bottom:20px">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="128"></el-avatar>
            <div style="font-size:24px;color:grey;margin:10px" ><b>{{username}}</b></div>
            <div style="margin-top:5px">ID: {{id}}</div>
            <div style="margin-top:5px">用户名：{{username}}</div>
            <div style="margin-top:5px" >角色：<el-tag type="worning">注册用户</el-tag></div>
            <div style="margin-top:5px">邮箱：{{email}}</div>
            <div style="margin-top:5px">手机号：{{phone_num}}</div>
        </div>
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
            email: ''
        }
    },
    created: function(){
        this.token=window.sessionStorage.getItem('token');
        this.GetInfo();
    },
    methods:{
        GetInfo(){
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
        }
    }
}
</script>

<style lang="less" scoped>
    .Info_Container{
        //background-color:#F2F6FC;
        text-align: center;
        height:100%;
        padding-left: 20%;
        padding-right: 20%;
    }
    .Inner_container{
        width: 90%;
        height: 0%;
        background-color:#FFFFFF;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        vertical-align: middle;
    }
    .Inner_aside{
        padding-top: 60%;
    }
    .el-main{
        vertical-align: middle;
        text-align: center;

    }
    .el-divider--vertical{
        display: inline-block;
        width: 1px;
        height: 400px;
        margin: 8px;
        vertical-align: middle;
        position: relative;
    }
    .el-header{
        text-align: center;
        display:flex;
        justify-content:center;
        align-items:center;
    }
    .a{
        text-decoration: none;
        background-color:rgb(255,255,255);
    }
</style>