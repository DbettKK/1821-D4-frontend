<template>

    <el-container class="Info_Container">
        <el-header>
            <div class="top" :body-style="{ padding: '0px' }">
                <div class="topcard_1">
                    <el-avatar class="headpic" :size="100" :src="userdata.avatar"></el-avatar>
                    <div class="name">
                        <p class="word" style="font-size: 20px; margin-top: 3px; margin-bottom: 0px">{{userdata.username}}</p>
                        <p class="email" style="margin-top: 0px; margin-bottom: 0px; font-size: 13px; color: rgb(60,60,60);">{{userdata.email}}</p>
                    </div>
                </div>
                <el-button style="float: left" type="info" plain @click="back">
                    <i class="el-icon-left"></i><span>返回</span>
                </el-button>
            </div>
            <div class="middle">
                <div class="tips1">
                    <span style="color: rgb(100, 100, 100)"><i class="el-icon-s-order" style="color: #6dc9fd"></i> 最近使用:</span>
                    <span style="margin-left: 20px;">{{recently}}</span>
                </div>
                <div class="tips2">
                    <span style="color: rgb(100, 100, 100)"><i class="el-icon-s-opportunity" style="color: #fdd808"></i> ta创建的:</span>
                    <span style="margin-left: 20px;">{{myproduction}}</span>
                </div>
                <div class="tips3">
                    <span style="color: rgb(100, 100, 100)"><i class="el-icon-star-on" style="color: #ff8a7a"></i> ta的收藏:</span>
                    <span style="margin-left: 20px;">{{favorite}}</span>
                </div>
            </div>
            <el-card class="main">
                <div class="message">
                    <p>ID:  {{userdata.id}}</p>
                    <p>用户名:  {{userdata.username}}</p>
                    <p v-if="userdata.gender !== null">性别:  {{userdata.gender == 0 ? '男' : '女'}}</p>
                    <p v-else>性别: 未知</p>
                    <p v-if="userdata.age !== null">年龄:  {{userdata.age}}</p>
                    <p v-else>年龄: 未知</p>
                    <p>电话:  {{userdata.phone_num}}</p>
                    <p v-if="userdata.qq !== null">QQ:  {{userdata.qq}}</p>
                    <p v-else>QQ: 未知</p>
                    <p>邮箱:  {{userdata.email}}</p>
                    <p v-if="userdata.address !== null">地址:  {{userdata.address}}</p>
                    <p v-else>地址: 未知</p>
                </div>
            </el-card>
            <el-card class="side">
                <div class="block">
                    <el-carousel trigger="click" height="350px">
                        <el-carousel-item v-for="(item, index) of piclist" :key="index">
                            <el-image style="width: 909px; height: 350px" :fit="fits" :src="item.src"></el-image>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </el-card>
        </el-header>

    </el-container>
</template>

<script>
//import QS from "qs";
export default {
    name: "Userinfo",
    inject: ['reload'],
    data(){
        return {
            user_id: '',
            fits: 'fill',
            piclist: [
                {src: 'https://i.loli.net/2020/08/19/iVMEWwe8gQO1psB.jpg'},
                {src: 'https://i.loli.net/2020/08/19/7QrMj2dKXzvP8sm.jpg'},
                {src: 'https://i.loli.net/2020/08/19/3ROZAoMFIExwCiX.jpg'},
                {src: 'https://i.loli.net/2020/08/19/AWNDI8J9qLw2O7c.jpg'},
            ],
            userdata: {},
            createtime: '',
            recently: '',
            myproduction: '',
            favorite: '',
            dialog1: false,
            dialog2: false,
            dialog3: false,
            dialog4: false,
            dialog5: false,
            genderForm: {
                gender: ''
            },
            ageForm: {
                age: ''
            },
            qqForm: {
                qq: ''
            },
            addressForm: {
                address: ''
            },
            phoneForm: {
                phone: ''
            }
        }
    },
    created: function(){
        this.token=window.sessionStorage.getItem('token');
        let str = window.atob(this.$route.params.id).substr(11);
        this.user_id = str.substr(0, str.length-5);
        this.GetInfo();
    },
    methods:{
        back(){
            this.$router.go(-1);
            this.$message({
                message: '欢迎回来',
                type: 'success'
            })
        },
        GetInfo(){
            var that = this;
            this.$http.get('http://175.24.121.113:8000/myapp/user/other/info/',
                {params:{id:this.user_id}}
            ).then(res=>{
                that.userdata=res.data.data;
                that.createtime=that.time(res.data.data.create_time);
                that.recently=res.data.data.browse.length;
                that.myproduction=res.data.data.myfiles.length;
                that.favorite=res.data.data.kept.length;
                console.log(res.data.data);
                that.$message({
                    message: '欢迎来到'+res.data.data.username+'的主页',
                    type: 'success'
                });
            }).catch(function(error){
                console.log(error);
            })
        },
        time(a) {
            this.createtime = a.toString().substr(0, 10);
            return this.createtime
        },
        torecently() {
            this.$router.push('/recently')
        },
        changepic() {
            var that = this;
            this.$http.get('http://175.24.121.113:8000/myapp/user/avatar/change/',
                {headers:{token:this.token}}
            ).then(()=>{
                that.$message({
                    message: '修改成功',
                    type: 'success'
                });
                that.reload();
            }).catch(function(error){
                console.log(error);
            })
        }
    }
}
</script>

<style lang="less" scoped>
.top {
    position: relative;
    width: 1210px;
    height: 180px;
    .topcard_1 {
        width: 200px;
        height: 150px;
        z-index:1;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .headpic {
            position: absolute;
            left: 50%;
            top: 38%;
            transform: translate(-50%, -50%);
        }
        .name {
            width: 200px;
            height: 50px;
            position: absolute;
            left: 50%;
            top: 90%;
            transform: translate(-50%, -50%);
            .word {
                position: absolute;
                left: 50%;
                top: 22%;
                transform: translate(-50%, -50%);
            }
            .email {
                position: absolute;
                left: 50%;
                top: 67%;
                transform: translate(-50%, -50%);
            }
        }
    }
}

.middle {
    position: relative;
    width: 1210px;
    height: 40px;
    color: #999;
    display: flex;
    justify-content: flex-start;
    .tips1 {
        position: absolute;
        left: 35%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .tips2 {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .tips3 {
        position: absolute;
        left: 65%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}

.main {
    position: relative;
    width: 300px;
    height: 350px;
    margin-top: 20px;
    color: #999;
    .message {
        position:absolute;
        left: 40px;
        top: 15px;
    }
}

.side {
    position: relative;
    width: 909px;
    height: 350px;
    margin-top: 20px;
    left: 302px;
    top: -372px;
    .block {
        width: 909px;
        height: 350px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .el-carousel {
            width: 909px;
            height: 350px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            .el-carousel-item {
                width: 909px;
                height: 350px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
}
</style>