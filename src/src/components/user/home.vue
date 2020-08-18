<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <el-header style="text-align: right; font-size: 12px">
            <div class="name_place">
                <span class="name">金刚石文档</span>
            </div>
<!--            <div class="ue">-->
<!--                <el-button type="primary" icon="el-icon-circle-plus" @click="ue"><strong>新建</strong></el-button>-->
<!--            </div>-->
            <div>
                <el-dropdown trigger="hover" >
                    <span class="el-dropdown-link">
                        <i class="el-icon-user-solid el-icon--right icon-user"></i>
                        <!--  <span style="font-size: 27px;margin-right: 20px;">欢迎您，{{userinfo.username}}</span>-->
                    </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="isLogin && userinfo.username">你好，{{userinfo.username}}</el-dropdown-item>
                    <el-dropdown-item v-else @click.native="logout">请登录</el-dropdown-item>
                    <el-dropdown-item @click.native="changeInfo" v-if="isLogin && userinfo.username">
                        修改密码及绑定邮箱
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isLogin && userinfo.username" @click.native="dialog=true">加入团队</el-dropdown-item>

                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="hover" >
                <span class="el-dropdown-link">
                    <i class="el-icon-s-tools el-icon--right icon-setting"></i>
                    <!--   <span style="font-size: 27px;margin-right: 20px;">欢迎您，{{userinfo.username}}</span>-->
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="!(isLogin && userinfo.username)">登录后查看更多</el-dropdown-item>
                    <el-dropdown-item @click.native="logout" v-if="isLogin && userinfo.username">退出登录</el-dropdown-item>
                    <el-dropdown-item @click.native="wirteOffWarn" v-if="isLogin && userinfo.username">注销账号</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            </div>
        </el-header>
        
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '250px'" style="background-color: #EDEEEF;">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" style="background-color: #EDEEEF;">
                    <el-menu-item index="1" @click="welcome"><i class="el-icon-s-home"></i><span>主页</span></el-menu-item>
                    <el-menu-item index="2" @click="recently"><i class="el-icon-menu"></i><span>工作站</span></el-menu-item>
                    <el-menu-item index="3" @click="trashbin"><i class="el-icon-delete-solid"></i><span>回收站</span></el-menu-item>
                    <el-submenu index="4" style="background-color: #EDEEEF">
                        <template slot="title">
                            <i class="el-icon-user-solid"></i><span>个人空间</span></template>
                        <el-menu-item-group style="background-color: #EDEEEF">
                            <template slot="title">个人信息</template>
                            <el-menu-item index="2-1" @click.native="showUserInfo">个人详情</el-menu-item>
                            <el-menu-item index="2-2" @click.native="message">消息通知</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="5" style="background-color: #EDEEEF" >
                        <template slot="title" >
                            <i class="el-icon-s-claim" @click="getTeams" ></i><span style="margin-right: 50px" @click="getTeams"> 团队空间</span>
                            <i class="el-icon-circle-plus" @click="createTeamVisible=true" ></i>  </template>
                            <el-menu-item-group style="background-color: #EDEEEF">
                            <template slot="title">加入的团队</template>

                                <template v-for="(item) in Teams">
                                    <el-menu-item :key="item.name" @click.native="toTeam(item.id)">
                                        <!-- class="el-icon-caret-right">图标好像有点丑-->
                                        <!--   <router-link :to="idplus(item.id)"  class="a" :key="item.name">-->
                                        {{item.name}}
                                        <!--    </router-link>-->
                                    </el-menu-item>
                                </template>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
                        <el-dialog title="创建团队" :visible.sync="createTeamVisible" width="400px">
                        <el-form >
                            <el-form-item label="要创建的团队名称" >
                                <el-input v-model="createTeam_name" autocomplete="off"></el-input>
                            </el-form-item>
                            <div>
                                <el-button @click="createTeamVisible = false">取 消</el-button>
                                <el-button type="primary" @click="createTeam()">确 定</el-button>
                            </div>
                        </el-form>
                        </el-dialog>
            <el-dialog title="请输入团队id" :visible.sync="dialog" width="30%">
                <el-form>
                    <el-form-item>
                        <el-input v-model="join_team_id" placeholder="团队id"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialog=false">取消</el-button>
                    <el-button type="primary" @click="joinTeam" >确定</el-button>
                </div>
            </el-dialog>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    <Footer></Footer>
    </el-container>
</template>

<script>
//import Footer from './footer.vue'
export default {
    components:{
        //Footer
    },
    inject: ['reload'],
    data() {
        return {
            userinfo: {
                id: "",
                username: "",
                email: "",
                phone_num: "",
            },
            join_team_id: '',
            dialog: false,
            isLogin: false,
            isCollapse: false,
            createTeamVisible:false,
            createTeam_name:"",
            Teams: []
        }
    },
    created() {
        if(window.sessionStorage.getItem('token')){
            this.isLogin = true;
            this.getUserInfo();
            this.getTeams();
        }else{
            this.isLogin = false;
        }

    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        getUserInfo() {
            this.$http.get(
                'http://175.24.121.113:8000/myapp/user/info/',
                {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(res=>{
                this.userinfo.username=res.data.data.username;
                this.userinfo.phone_num=res.data.data.phone_num;
                this.userinfo.id=res.data.data.id;
                this.userinfo.email=res.data.data.email;
                console.log(res);
            }).catch(function(error){
                console.log(error);
            })
        },
        showUserInfo(){
            this.$router.push('/showUserInfo')
        },
        //折叠展开左菜单
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        createTeam(){
            var that = this;
            this.createTeamVisible=false;
            this.$http.post(
                "http://175.24.121.113:8000/myapp/team/create/",
                this.$qs.stringify({
                    team_name:this.createTeam_name
                }),
                {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(res=>{
                if(res.data.code===200){
                    that.$message({message:  '你的新团队:'+res.data.data.name+ '  id:'+res.data.data.id+'已成功创建',
                    type: 'success',duration:7000,showClose:true})
                    that.reload();
                }
            }).catch(res=>{
                console.log(res);
                that.$message({message:  '创建失败 ' + '原因:' + res.response.data.info,
                    type: 'error'})
                that.reload();
            });
        },
        welcome(){
            this.$router.push('/')
        },
        ue(){
            this.$router.push('/Edit')
        },
        dashboard(){
            this.$router.push('/dashboard')
        },
        recently() {
            this.$router.push('/recently')
        },
        myproduction() {
            this.$router.push('/myproduction')
        },
        favorite() {
            this.$router.push('/favorite')
        },
        trashbin() {
            this.$router.push('/trashbin')
        },
        changeInfo(){
            this.$router.push('/changeInfo')
        },
        message(){
            this.$router.push('/message_favorite')
        },
        getTeams()
        {
            var that = this;
            this.$http.get(
                'http://175.24.121.113:8000/myapp/team/all/get/',
                {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(res=>{
                that.Teams=res.data.data;
                console.log(that.Teams)
            }).catch(function(error){
                console.log(error);
            });
            },
        wirteOffWarn(){
            this.$confirm('此操作将永久注销账号, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '注销成功!'
                });
                this.writeOff();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消注销'});
            });
        },
        writeOff(){
            this.$http.get('http://175.24.121.113:8000/myapp/user/writeoff/',
                {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(function (res) {
                console.log(res.data)
            }).catch(function (error) {
                console.log(error.response)
            });
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        joinTeam(){
            var that=this;
            this.$http.get('http://175.24.121.113:8000/myapp/team/join/'+this.join_team_id+'/',
                {headers: {token: window.sessionStorage.getItem("token")}}
            ).then(() => {
                that.$message({
                    message: '你已经成功加入团队',
                    type: 'success'
                });
                that.reload();
            }).catch((error) => {
                that.$message.error(error.response.data.info);
            });

        },
        toTeam(team_id){
            this.$router.push("/TeamSpace/"+window.btoa('hello,world'+team_id+'!!'));
        }
    }
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: #F2F6FC;
    color: #333;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
}

.name_place {
    span {
        margin-left: 15px;
    }
}

.name {
    color: #333;
    font-size: 20px;
    display: flex;
    align-items: center;
}
.user{
    color: #333;
    font-size: 20px;
}
.el-aside {
    color: #333;
}

.toggle-button {
    background-color: #EDEEEF;
    font-size: 10px;
    line-height: 24px;
    color: #333;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
.el-menu-item {
    background-color: #EDEEEF
}
.icon-user{
    font-size:30px;
    margin-top: 15px;
    margin-right: 10px;
 }
.icon-setting{
    font-size:30px;
    margin-top: 15px;
    margin-right: 20px;
}
</style>
