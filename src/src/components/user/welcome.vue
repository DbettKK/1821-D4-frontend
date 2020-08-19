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
                <el-button style="float: right" type="info" plain @click="invite_dialogVisible=true">
                    <i class="el-icon-right"></i><span>访问他人主页</span>
                </el-button>
            </div>
            <div class="middle">
                <div class="tips1">
                    <span style="color: rgb(100, 100, 100)"><i class="el-icon-s-order" style="color: #6dc9fd"></i> 最近使用:</span>
                    <span style="margin-left: 20px;">{{recently}}</span>
                </div>
                <div class="tips2">
                    <span style="color: rgb(100, 100, 100)"><i class="el-icon-s-opportunity" style="color: #fdd808"></i> 我创建的:</span>
                    <span style="margin-left: 20px;">{{myproduction}}</span>
                </div>
                <div class="tips3">
                    <span style="color: rgb(100, 100, 100)"><i class="el-icon-star-on" style="color: #ff8a7a"></i> 我的收藏:</span>
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
        <el-dialog
                title="访问用户主页"
                :visible.sync="invite_dialogVisible"
                width="40%">
            <div style="margin-bottom:20px">
                <!--
                <el-radio v-model="invite_mod" label="1">使用id邀请</el-radio>
                -->
                <el-radio v-model="invite_mod" label="2">使用用户名查找访问</el-radio>
                <el-radio v-model="invite_mod" label="3" style="margin-left:5%">使用邮箱查找访问</el-radio>
            </div>
            <div v-if="invite_mod=='1'">
                <div style="margin-bottom: 20px">
                    <span>被邀请人的ID:</span>
                </div>
                <el-form ref="inviteFormRef" :model="inviteForm" label-width="0px" class="invite_form">
                    <el-form-item prop="id">
                        <el-input placeholder="ID:" v-model="inviteForm.id" style='width:300px'></el-input>
                        <el-button style='margin-left:30px'>查找</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="invite_mod=='2'">
                <div style="margin-bottom: 20px">
                    <span>用户名:</span>
                </div>
                <el-form ref="inviteFormRef" :model="inviteForm" label-width="0px" class="invite_form">
                    <el-form-item prop="name">
                        <el-input placeholder="用户名:" v-model="inviteForm.name" style='width:75%' ></el-input>
                        <el-button style='margin-left:3%' @click.native='getUserformat'>查找</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="invite_mod=='3'">
                <div style="margin-bottom: 20px">
                    <span>邮箱:</span>
                </div>
                <el-form ref="inviteFormRef" :model="inviteForm" label-width="0px" class="invite_form">
                    <el-form-item prop="email">
                        <el-input placeholder="邮箱:" v-model="inviteForm.email" style='width:75%' ></el-input>
                        <el-button style='margin-left:3%' @click.native='getUserformat'>查找</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="found_user_format" height=200px style="width: 100%" :default-sort = "{prop: 'name', order: 'descending'}" :row-style="{height: '25px'}">
                <el-table-column prop="username" label="用户名" @contextmenu.prevent=""></el-table-column>
                <el-table-column prop="email" label="邮箱" width="200px"></el-table-column>
                <el-table-column prop="create_time" :formatter="dateFormat" label="创建日期" width="140px"></el-table-column>
                <el-table-column  fixed="right" width="50px" label="访问">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="访问" placement="bottom-end">
                            <el-button @click.native="toOther(scope.row.id)" type="text" style="color: #999" size="mini" v-if="heihei">
                                <i class="el-icon-right"></i>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>


            <span slot="footer" class="dialog-footer">
          <el-button @click.native="clearout">取 消</el-button>
          <el-button type="primary" @click.native="clearout">确定</el-button>
                <!--
                <el-button type="primary" @click.native="invite()">确 定</el-button>
                -->
        </span>
        </el-dialog>
    </el-container>
</template>

<script>
//import QS from "qs";
import fecha from 'fecha'
export default {
    name: "Userinfo",
    inject: ['reload'],
    data(){
        return {
            heihei: false,
            invite_dialogVisible: false,
            invite_mod: 0,
            inviteForm: {
                id: '',
                name:'',
                email:''
            },
            found_user_format:[{
                username:'',
                email:'',
                create_time:''
            }],
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
        this.GetInfo();
    },
    methods:{
        clearout(){
            this.invite_dialogVisible=false;
            this.found_user_format = [];
            this.inviteForm = {};
        },
        getUserformat() {
            var that=this;
            if(this.invite_mod=='2') {
                this.$http.post('http://175.24.121.113:8000/myapp/team/find/invite/', this.$qs.stringify({
                        username:that.inviteForm.name
                    }), {headers: {token: window.sessionStorage.getItem("token")}}
                ).then(function(res) {
                    that.found_user_format=res.data.data;
                    that.heihei=true;
                }).catch(function (error) {
                    that.$message.error(error.response.data.info);
                });
            }
            else if(this.invite_mod=='3') {
                this.$http.post('http://175.24.121.113:8000/myapp/team/find/invite/', this.$qs.stringify({
                        email:that.inviteForm.email
                    }), {headers: {token: window.sessionStorage.getItem("token")}}
                ).then(function(res) {
                    that.found_user_format=res.data.data;
                    that.heihei=true;
                }).catch(function (error) {
                    that.$message.error(error.response.data.info);
                });
            }
        },
        dateFormat(row, column, cellValue) {
            return cellValue ? fecha.format(new Date(cellValue), 'YYYY-MM-DD') : '';
        },
        toOther(uid) {
            this.$router.push('/otherInfo/' + window.btoa('hello,world'+uid+'nihao'));
        },
        GetInfo(){
            var that = this;
            this.$http.get('http://175.24.121.113:8000/myapp/user/info/',
                {headers:{token:this.token}}
            ).then(res=>{
                that.userdata=res.data.data;
                that.createtime=that.time(res.data.data.create_time);
                that.recently=res.data.data.browse.length;
                that.myproduction=res.data.data.myfiles.length;
                that.favorite=res.data.data.kept.length;
                console.log(res.data.data);
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