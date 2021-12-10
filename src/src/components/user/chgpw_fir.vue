<template>
    <el-container style="height: 100%; width: 100%;">
        <el-card style="height: 100%; width: 100%;">
            <div class="top">
                <el-steps class="step" :active="1" align-center>
                    <el-step title="身份验证" icon="el-icon-user-solid"></el-step>
                    <el-step title="修改信息" icon="el-icon-edit"></el-step>
                    <el-step title="确认修改" icon="el-icon-success"></el-step>
                </el-steps>
            </div>
            <div class="message">
                <el-avatar class="bigpic" :size="40" :src="userdata.avatar" style="margin-right: 20px"></el-avatar>
                <p class="username">{{userdata.username}}</p>
                <p class="email">{{userdata.email}}</p>
            </div>
            <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="form">
                <el-form-item prop="password">
                    <el-input placeholder="请输入旧密码" v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" @keyup.enter.native="CheckPwd()"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" size="small" @click="CheckPwd()">下一步</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-container>
</template>

<script>
import Vue from 'vue'
export default {
    inject: ['reload'],
    data(){
        return {
            userdata: {},
            loginForm: {
                password: ''
            },
        }
    },
    created: function(){
        this.token=window.sessionStorage.getItem('token');
        this.GetInfo();
    },
    methods:{
        GetInfo(){
            var that = this;
            this.$http.get(this.$API + '/user/info/',
                {headers:{token:this.token}}
            ).then(res=>{
                that.userdata=res.data.data;
                console.log(res.data.data);
            }).catch(function(error){
                console.log(error);
            })
        },
        CheckPwd(){
            Vue.axios.post(
                this.$API + '/user/modify/',
                this.$qs.stringify({
                    old_password: this.loginForm.password
                }),
                {
                    headers: {
                        'token': this.token
                    }
                }).then(() => {
                this.$message({
                    message: '旧密码正确',
                    type: 'success'
                })
                    this.secstep();
                }).catch(res => {
                    this.$message.error(res.response.data.info)
            });
        },
        secstep() {
            this.$router.push('/newpassword')
        }
    }
}

</script>

<style lang="less" scoped>
.el-card {
    position: relative;
.top {
    width: 800px;
    position: relative;
    left: 50%;
    top: 30px;
    transform: translate(-50%, 0);
    .step {
        width: 700px;
        position: absolute;
        left: 50%;
        top: 5%;
        transform: translate(-50%, 0);
    }
}

.message {
    height: 70px;
    width: 240px;
    position: relative;
    left: 47%;
    transform: translate(-50%, 280%);
    .bigpic {
        position: absolute;
        left: 5%;
        top: 50%;
        transform: translate(0, -50%);
    }

    .username {
        position: absolute;
        left: 25%;
        top: 0%;
        font-size: 15px;
        color: rgb(100, 100, 100); 
    }

    .email {
        position: absolute;
        left: 25%;
        top: 35%;
        font-size: 12px; 
        color: rgb(100, 100, 100);
    }
}
.form {
    //background-color: #999;
    width: 300px;
    height: 100px;
    position: relative;
    left: 50%;
    transform: translate(-50%, 200%);
    .btns {
        position: absolute;
        left: 77%;
        top: 50%;
    }
}
}
</style>