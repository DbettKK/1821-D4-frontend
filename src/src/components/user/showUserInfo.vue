<template>

    <el-container class="Info_Container">
        <el-header>
            <el-card class="top" :body-style="{ padding: '0px' }">

                <div class="background">
                    <img src="../../assets/toppic.jpg" width="100%" height="100%" alt="" />
                </div>

                <div class="topcard_1">
                    <el-avatar :size="50" :src="userdata.avatar" style="margin-right: 20px"></el-avatar>
                    <div>
                        <p style="font-size: 20px; margin-top: 3px; margin-bottom: 0px">{{userdata.username}}</p>
                        <p style="margin-top: 0px; margin-bottom: 0px; font-size: 13px; color: #999;">{{createtime}}</p>
                    </div>
                </div>
            </el-card>
            <el-card class="middle">
                <div class="tips1">
                    <span style="color: rgb(100, 100, 100)"><i class="el-icon-s-order" style="color: #6dc9fd"></i> 最近使用:</span>
                    <span style="margin-left: 20px; margin-right: 60px">{{recently}}</span>
                </div>
                <div class="tips2">
                    <span style="color: rgb(100, 100, 100)"><i class="el-icon-s-opportunity" style="color: #fdd808"></i> 我创建的:</span>
                    <span style="margin-left: 20px; margin-right: 60px">{{myproduction}}</span>
                </div>
                <div class="tips3">
                    <span style="color: rgb(100, 100, 100)"><i class="el-icon-star-on" style="color: #ff8a7a"></i> 我的收藏:</span>
                    <span style="margin-left: 20px; margin-right: 60px">{{favorite}}</span>
                </div>
            </el-card>
            <el-card class="main">
                <div>
                    <el-avatar class="bigpic" :size="200" :src="userdata.avatar" style="margin-right: 20px"></el-avatar>
                    <el-button @click.native="changepic()" class="changepic" type="info" plain>
                        <i class="el-icon-edit"></i><span>修改头像</span>
                    </el-button>
                </div>
                <div class="message">
                    <p>ID:  {{userdata.id}}</p>
                    <p>用户名:  {{userdata.username}}</p>
                    <p v-if="userdata.gender !== null">性别:  {{userdata.gender == 0 ? '男' : '女'}} <el-link @click.native="dialog1 = true" type="primary" icon="el-icon-edit" style="margin-bottom: 2.8px"></el-link></p>
                    <p v-else>性别:  <el-link @click.native="dialog1 = true" type="primary" icon="el-icon-edit" style="margin-bottom: 2.8px">马上填写</el-link>您的性别，让更多的人了解你</p>
                    <p v-if="userdata.age !== null">年龄:  {{userdata.age}} <el-link @click.native="dialog2 = true" type="primary" icon="el-icon-edit" style="margin-bottom: 2.8px"></el-link></p>
                    <p v-else>年龄:  <el-link @click.native="dialog2 = true" type="primary" icon="el-icon-edit" style="margin-bottom: 2.8px">马上填写</el-link>您的年龄，让更多的人了解你</p>
                    <p>电话:  {{userdata.phone_num}} <el-link @click.native="dialog5 = true" type="primary" icon="el-icon-edit" style="margin-bottom: 2.8px"></el-link></p>
                    <p v-if="userdata.qq !== null">QQ:  {{userdata.qq}} <el-link @click.native="dialog3 = true" type="primary" icon="el-icon-edit" style="margin-bottom: 2.8px"></el-link></p>
                    <p v-else>QQ:  <el-link @click.native="dialog3 = true" type="primary" icon="el-icon-edit" style="margin-bottom: 2.8px">马上填写</el-link>您的QQ，让更多的人了解你</p>
                    <p>邮箱:  {{userdata.email}}</p>
                    <p v-if="userdata.address !== null">地址:  {{userdata.address}} <el-link @click.native="dialog4 = true" type="primary" icon="el-icon-edit" style="margin-bottom: 2.8px"></el-link></p>
                    <p v-else>地址:  <el-link @click.native="dialog4 = true" type="primary" icon="el-icon-edit" style="margin-bottom: 2.8px">马上填写</el-link>您的地址，让更多的人了解你</p>
                </div>
            </el-card>
            <el-card class="side">
                <el-link @click.native="torecently()" class="createcenter" type="primary" icon="el-icon-s-opportunity" style="margin-bottom: 2.8px; font-size: 24px">创作中心 ></el-link>
                <p class="createtips">进入工作台 创造您的专属文档</p>
            </el-card>
            <el-card class="side_base">
                <p style="margin-left: 115px; font-size: 20px; color: rgb(100, 100, 100)">每日一句</p>
                <p style="position: absolute; left: 50%; transform: translate(-50%, 0);">只要我们能梦想的，我们就能实现。</p>
            </el-card>
        </el-header>
        <el-dialog title="提示" :visible.sync="dialog1" width="30%">
            <div style="margin-bottom: 20px">
                <span>您的性别:</span>
            </div>
            <el-form ref="genderFormRef" :model="genderForm" label-width="0px" class="gender_form">
                <el-form-item prop="gender">
                    <el-input placeholder="gender:" v-model="genderForm.gender"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog1 = false">取 消</el-button>
                <el-button type="primary" @click.native="gender()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialog2" width="30%">
            <div style="margin-bottom: 20px">
                <span>您的年龄:</span>
            </div>
            <el-form ref="ageFormRef" :model="ageForm" label-width="0px" class="age_form">
                <el-form-item prop="age">
                    <el-input placeholder="age:" v-model="ageForm.age"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog2 = false">取 消</el-button>
                <el-button type="primary" @click.native="age()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialog3" width="30%">
            <div style="margin-bottom: 20px">
                <span>您的QQ:</span>
            </div>
            <el-form ref="qqFormRef" :model="qqForm" label-width="0px" class="qq_form">
                <el-form-item prop="qq">
                    <el-input placeholder="qq:" v-model="qqForm.qq"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog3 = false">取 消</el-button>
                <el-button type="primary" @click.native="qq()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialog4" width="30%">
            <div style="margin-bottom: 20px">
                <span>您的地址:</span>
            </div>
            <el-form ref="addressFormRef" :model="addressForm" label-width="0px" class="address_form">
                <el-form-item prop="address">
                    <el-input placeholder="address:" v-model="addressForm.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog4 = false">取 消</el-button>
                <el-button type="primary" @click.native="address()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialog5" width="30%">
            <div style="margin-bottom: 20px">
                <span>您的电话:</span>
            </div>
            <el-form ref="phoneFormRef" :model="phoneForm" label-width="0px" class="phone_form">
                <el-form-item prop="phone">
                    <el-input placeholder="phone_num:" v-model="phoneForm.phone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog5 = false">取 消</el-button>
                <el-button type="primary" @click.native="phonenum()">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
//import QS from "qs";
export default {
    name: "Userinfo",
    inject: ['reload'],
    data(){
        return {
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
        GetInfo(){
            var that = this;
            this.$http.get(this.$API + '/user/info/',
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
        gender() {
            var that = this;
            this.$http.post(this.$API + '/user/info/finish/', this.$qs.stringify({
                    gender: that.genderForm.gender == '男' ? 0:1
                }), {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(() => {
                that.$message({
                    message: '性别提交成功',
                    type: 'success'
                });
                that.reload();
            }).catch(function (error) {
                that.$message.error(error.response.data.info);
            });
            that.dialog1 = false;
        },
        age() {
            var that = this;
            this.$http.post(this.$API + '/user/info/finish/', this.$qs.stringify({
                    age: that.ageForm.age
                }), {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(() => {
                that.$message({
                    message: '年龄提交成功',
                    type: 'success'
                });
                that.reload();
            }).catch(function (error) {
                that.$message.error(error.response.data.info);
            });
            that.dialog2 = false;
        },
        qq() {
            var that = this;
            this.$http.post(this.$API + '/user/info/finish/', this.$qs.stringify({
                    qq: that.qqForm.qq
                }), {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(() => {
                that.$message({
                    message: 'QQ提交成功',
                    type: 'success'
                });
                that.reload();
            }).catch(function (error) {
                that.$message.error(error.response.data.info);
            });
            that.dialog3 = false;
        },
        address() {
            var that = this;
            this.$http.post(this.$API + '/user/info/finish/', this.$qs.stringify({
                    address: that.addressForm.address
                }), {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(() => {
                that.$message({
                    message: '地址提交成功',
                    type: 'success'
                });
                that.reload();
            }).catch(function (error) {
                that.$message.error(error.response.data.info);
            });
            that.dialog4 = false;
        },
        phonenum() {
            var that = this;
            this.$http.post(this.$API + '/user/info/finish/', this.$qs.stringify({
                    phone_num: that.phoneForm.phone
                }), {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(() => {
                that.$message({
                    message: '电话提交成功',
                    type: 'success'
                });
                that.reload();
            }).catch(function (error) {
                that.$message.error(error.response.data.info);
            });
            that.dialog5 = false;
        },
        torecently() {
            this.$router.push('/recently')
        },
        changepic() {
            var that = this;
            this.$http.get(this.$API + '/user/avatar/change/',
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
    height: 180px;
    .background{
        width:100%;
        height:100%;  /**宽高100%是为了图片铺满屏幕 */
        //z-index:-1;
        position: absolute;
    }
    .topcard_1 {
        display: flex;
        justify-content: flex-start;
        z-index:1;
        position: relative;
        top: 120px;
        left: 30px;
    }
}

.middle {
    position: relative;

    height: 40px;
    color: #999;
    display: flex;
    justify-content: flex-start;
    .tips1 {
        position: absolute;
        left: 30px;
        top: 9px
    }
    .tips2 {
        position: absolute;
        left: 230px;
        top: 9px
    }
    .tips3 {
        position: absolute;
        left: 430px;
        top: 9px
    }
}

.main {
    position: relative;
    height: 350px;
    margin-top: 20px;
    color: #999;
    .bigpic {
        position:absolute;
        left: 100px;
        top: 50px
    }
    .changepic {
        position:absolute;
        left: 142px;
        top: 270px
    }
    .message {
        position:absolute;
        left: 420px;
        top: 15px;
    }
}

.side {
    position: relative;
    width: 350px;
    height: 174px;
    margin-top: 20px;
    color: #999;
    left: calc(100% - 350px);
    top: -372px;
    .createcenter {
        position: absolute;
        left: 105px;
        top: 60px
    }
    .createtips {
        position: absolute;
        left: 72px;
        top: 90px
    }
}

.side_base {
    position: relative;
    width: 350px;
    height: 174px;
    margin-top: 20px;
    color: #999;
  left: calc(100% - 350px);
    top: -392px
}

</style>
