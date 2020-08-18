<template>
    <el-container style="height: 100%; width: 100%;">
        <el-card style="height: 100%; width: 100%;">
            <div class="top">
                <el-steps class="step" :active="3" align-center>
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
            <el-form ref="FormRef" :model="Form" label-width="0px" class="form">
                <el-form-item prop="email">
                    <el-input placeholder="请确认新邮箱" v-model="Form.email" prefix-icon="el-icon-eleme"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请确认新密码(必填)" v-model="Form.password" prefix-icon="el-icon-lock" type="password" @keyup.enter.native="ChangeInfocheck()"></el-input>
                </el-form-item>
                <el-form-item class="btns1">
                    <el-button type="primary" size="small" @click="secstep();">上一步</el-button>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" size="small" @click="ChangeInfocheck()">确认修改</el-button>
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
            Form: {
                email: '',
                password: ''
            },
            pemail: '',
            ppassword: ''
        }
    },
    created: function(){
        this.token=window.sessionStorage.getItem('token');
        this.pemail=window.sessionStorage.getItem('email');
        this.ppassword=window.sessionStorage.getItem('password');
        this.GetInfo();
    },
    methods:{
        GetInfo(){
            var that = this;
            this.$http.get('http://175.24.121.113:8000/myapp/user/info/',
                {headers:{token:this.token}}
            ).then(res=>{
                that.userdata=res.data.data;
                console.log(res.data.data);
            }).catch(function(error){
                console.log(error);
            })
        },
        ChangeInfocheck() {
            if (this.pemail !== (this.Form.email ? this.Form.email : this.userdata.email)) {
                this.$message({
                    message: '两次输入的邮箱不一致！',
                    type: 'warning'
                });
                this.reload();
            }
            if (this.ppassword !== this.Form.password) {
                this.$message({
                    message: '两次输入的密码不一致！',
                    type: 'warning'
                });
                this.reload();
            }
            if (this.pemail == (this.Form.email ? this.Form.email : this.userdata.email) && this.ppassword == this.Form.password) {
                this.ChangeInfo();
            }
        },
        ChangeInfo(){
            var that=this;
            Vue.axios.post(
                "http://175.24.121.113:8000/myapp/user/info/",this.$qs.stringify({
                    new_password:this.ppassword,
                    email:this.pemail,
                    phone_num:this.userdata.phone_num
                }), {headers: {token: this.token}}
                ).then(function(res)  {

                    console.log(res);
                    console.log('success');
                that.$message({
                        message: '修改成功，请重新登录！',
                        type: 'success'
                    });
                    window.sessionStorage.clear();
                that.$router.push('/login');
                }).catch(res => {
                    console.log(res);
                    this.$message({
                        message: res.response.data.info,
                        type: 'warning'
                    });
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
    .btns1 {
        position: absolute;
        left: 45%;
        top: 120%;
    }
    .btns {
        position: absolute;
        left: 73%;
        top: 120%;
    }
}
}
</style>