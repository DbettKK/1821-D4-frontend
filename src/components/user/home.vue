<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <el-header style="text-align: right; font-size: 12px">
            <div class="name_place">
                <span class="name">金刚石文档</span>
            </div>
            <div class="ue">
                <el-button type="primary" icon="el-icon-circle-plus" @click="ue"><strong>新建</strong></el-button>
            </div>
            <div>
                <span style="margin-right:100px" class="user">你好，{{userinfo.username}}!</span>
                <el-dropdown trigger="click">
                    <i class="el-icon-setting" style="margin-right: 10px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                        <el-dropdown-item @click.native="changeInfo">修改密码及个人信息</el-dropdown-item>
                        <el-dropdown-item>注销账号</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span><userinfo class="username"></userinfo></span>
            </div>
        </el-header>
        
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '250px'" style="background-color: rgb(238, 241, 246)">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" style="background-color: rgb(238, 241, 246)">
                    <el-menu-item index="1" @click="recently"><i class="el-icon-menu"></i><span>工作站</span></el-menu-item>
                    <el-submenu index="2" style="background-color: rgb(238, 241, 246)">
                        <template slot="title"><i class="el-icon-user-solid"></i><span>个人空间</span></template>
                        <el-menu-item-group style="background-color: rgb(238, 241, 246)">
                            <template slot="title">个人信息</template>
                            <el-menu-item index="2-1">个人详情</el-menu-item>
                            <el-menu-item index="2-2">消息通知</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3" style="background-color: rgb(238, 241, 246)">
                        <template slot="title"><i class="el-icon-s-claim"></i><span>团队空间</span></template>
                        <el-menu-item index="3-1" @click="createTeamVisible=true">创建团队</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
                        <el-dialog title="创建团队" :visible.sync="createTeamVisible" width="400px">
                        <el-form :model="create">
                            <el-form-item label="要创建的团队名称" :label-width="formLabelWidth">
                                <el-input v-model="create.team_name" autocomplete="off"></el-input>
                            </el-form-item>
                            <div>
                                <el-button @click="createTeamVisible = false">取 消</el-button>
                                <el-button type="primary" @click="createTeam()">确 定</el-button>
                            </div>
                        </el-form>
                        </el-dialog>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Vue from 'vue'
export default {
    data() {
        return {
            userinfo: {
                id:111,
                username:"cxc",
                email:"xxa@buqq.edu.cn",
                phone_num:"1222233",
            },
            isCollapse: false,
            createTeamVisible:false,
            create:{
                team_name:""
            }
        }
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getUserInfo() {
            const {data:res} = await this.$http.get('http://175.24.121.113:8000/myapp/user/info')
            if(res.code !== 200) return this.$message.error(res.info)
            this.userinfo = res.data
            console.log(res)
        },
        //折叠展开左菜单
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        createTeam(){
            this.createTeamVisible=false;
            Vue.axios.post(
                "http://175.24.121.113:8000/myapp/team/create/",
                {
                    team_name:this.createTeam.team_name
                },
                {
                    headers: {
                        token: this.$store.state.token
                    }
                }
            ).then(res=>{
                if(res.code===200){
                    alert(res.info);
                    alert("你的新团队:"+res.data.name+" id:"+res.data.id+"成功创建！");
                }
            }).catch(res=>{
                console.log(res);
            });
        },
        ue(){
            this.$router.push('/Edit')
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
        }
    }
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: rgb(130, 255, 213);
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
    background-color: rgb(238, 241, 246);
    font-size: 10px;
    line-height: 24px;
    color: #333;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
.el-menu-item {
    background-color: rgb(238, 241, 246)
}
</style>
