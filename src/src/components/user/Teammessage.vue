<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="toTeam()">团队文档</el-menu-item>
            <el-menu-item index="2" @click="Teammessage()">团队信息</el-menu-item>
          </el-menu>
        </el-header>
        <el-main>
          
        </el-main>
    </el-container>
</template>

<script>
export default {
    inject: ['reload'],
  data() {
    return {
        activeIndex: '2'
    };
  },
  created() {
  },
    watch: {//监听下个访问的东西是不是还是teamspace，是则重新获取
        '$route' (to, from) {
            if(to.name === 'Teamspace'){
                this.getDoclist();
            }

            //if(to.name === 'teammessage'){
                
            //}

            if(from.name==='post')//纯粹为了避免unused
            {
                this.five++;
            }
        }
    },
  methods: {
    toTeam(){
        var team_id = this.$route.params.id;
        this.$router.push("/TeamSpace/"+team_id);
    },
    Teammessage(){
        var team_id = this.$route.params.id;
      this.$router.push("/Teammessage/"+team_id);
    },
  },
  computed: {

  }
}
</script>

<style lang="less" scoped>

</style>