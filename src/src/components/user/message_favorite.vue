<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
                <el-menu-item index="1" @click="msgfavorite">收藏消息</el-menu-item>
                <el-menu-item index="2" @click="msgcomments">评论消息</el-menu-item>
                <el-menu-item index="3" @click="msgteam">团队消息</el-menu-item>
            </el-menu>
            <el-button class="createfile" type="info">
                <i class="el-icon-success"></i><span>全部设为已读</span>
            </el-button>
        </el-header>
        <el-main>
          <el-row v-for="(page, index) of pages" :key="index" style="margin-bottom: 40px;">
            <el-col :span="16" align="left" v-for="(item, innerindex) of page" :key="item.id" :offset="innerindex > 0 ? 2 : 0" style="margin-right: -60px;">
                <el-badge :value="read(item.msg_is_read)" class="msg">
              <el-card class="item" :body-style="{ padding: '0px' }" shadow="hover" @click.native="setread(item.msg_id)" style="cursor: pointer;">
                <div style="padding: 14px;">
                  <div class="top">
                    <div style="display: flex; align-items: start;">
                        <i class="el-icon-collection-tag icon"></i>
                        <span>{{item.msg_title}}</span>
                    </div>
                  </div>
                  <div class="middle">
                      <span style="font-size: 13px; margin-right: 15px;">{{item.msg_content}}</span>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time" style="margin-right: 20px;">{{time(item.msg_time)}}</time>
                    <span style="font-size: 13px; color: #999; margin-right: 15px;">
                      来自你的文档：{{item.msg_from}}
                    </span>
                  </div>
                </div>
              </el-card>
                </el-badge>
            </el-col>
          </el-row>
        </el-main>
    </el-container>
</template>

<script>
import Vue from 'vue'
export default {
  inject: ['reload'],
  data() {
    return {
      user_id: '',
      activeIndex:'1',
      token: '',
      messagetime: '',
      isread: 'new',
      messagelist: []
    };
  },
  created() {
    this.token = window.sessionStorage.getItem('token')
    this.user_id = window.sessionStorage.getItem('id')
    this.getmessageist('favor');
  },
  methods: {
    getmessageist(type) {
      var that = this;
      Vue.axios.get(
        'http://175.24.121.113:8000/myapp/getmsg/',
        {headers: {token: window.sessionStorage.getItem("token")},
        params: {msg_types: type}}
      ).then(function(res){
        console.log(res);
        that.messagelist=res.data.data;
      }).catch(function(error){
        console.log(error,Response);
      })
    },
    setread(id) {
      Vue.axios.get(
        'http://175.24.121.113:8000/myapp/set/read/',
        {headers: {token: window.sessionStorage.getItem("token")},
        params: {msg_id: id}}
      ).then(function(res){
        console.log(res);
      }).catch(function(error){
        console.log(error,Response);
      })
      this.getmessageist('favor');
      this.reload();
    },
    time(a) {
         this.messagetime = a.toString().substr(0, 10)
         return this.messagetime
    },
    read(a) {
        if (a === false) this.isread = 'new'
        else this.isread = ''
        return this.isread
    },
    msgfavorite() {
        this.$router.push('/message_favorite')
    },
    msgcomments() {
        this.$router.push('/message_comments')
    },
    msgteam() {
        this.$router.push('/message_team')
    }
  },
  computed: {
    pages () {
      const pages = []
      this.messagelist.forEach((item, index) => {
        const page = Math.floor(index / 1)
        if (!pages[page]) {
          pages[page] = []
        }
        pages[page].push(item)
      })
      return pages
    }
  }
}
</script>

<style lang="less" scoped>
.msg {
    margin-bottom: -30px;
    width: 900px;
}

.icon {
    margin-top: 4px;
    margin-right: 4px;
    color: rgb(0, 174, 255);
}

.time {
  font-size: 13px;
  color: #999;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
  
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.el-dropdown-link {
  cursor: pointer;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
  
.clearfix:after {
    clear: both
}

.createfile{
  height: 40px;
  width: 200px;
  margin-top: 20px;
  margin-right: 80px;
}
</style>