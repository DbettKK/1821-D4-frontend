<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
                <el-menu-item index="1" @click="msgfavorite">收藏消息</el-menu-item>
                <el-menu-item index="2" @click="msgcomments">评论消息</el-menu-item>
                <el-menu-item index="3" @click="msgteam">团队消息</el-menu-item>
                <el-menu-item index="4" @click="msgshare">分享消息</el-menu-item>
            </el-menu>
            <div>
              <el-button class="createfile" type="info" @click.native="setallread()">
                <i class="el-icon-success"></i><span>全部设为已读</span>
              </el-button>
              <el-dropdown trigger="hover" class="set">
                <span class="el-dropdown-link">
                    <i class="el-icon-s-tools el-icon--right icon-setting"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="delmsgall()">清空评论消息列表</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
        </el-header>
        <el-main>
          <el-row v-for="(item, index) of messagelist" :key="index" style="margin-bottom: 40px;">
            <el-col :span="16" align="left" style="margin-right: -60px;">
                <el-badge :value="item.msg_is_read" class="msg">
              <el-card class="item" :body-style="{ padding: '0px' }" shadow="hover" @click.native="setread(item.id)" style="cursor: pointer;">
                <div style="padding: 14px;">
                  <div class="top">
                    <div style="display: flex; align-items: start;">
                        <i class="el-icon-edit icon"></i>
                        <span>{{item.msg_title}}</span>
                    </div>
                    <el-dropdown trigger="hover" style="font-size: 1px; color: #999;" placement="bottom-start">
                      <span class="el-dropdown-link">···</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-view" @click.native="setunread(item.id)" v-if="item.msg_is_read == false">设为未读</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete" @click.native="delmsg(item.id)">删除消息</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="middle">
                      <span style="font-size: 13px; margin-right: 15px;">{{item.msg_content}}</span>
                      <el-button @click.stop="jumpto(item.msg_type_from, item.id)" style="float:right">查看</el-button>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time" style="margin-right: 20px;">{{item.msg_time}}</time>
                    <span style="font-size: 13px; color: #999; margin-right: 15px;">
                      来自你的文档：{{item.msg_type_from_name}}
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
      activeIndex:'2',
      token: '',
      messagetime: '',
      isread: 'new',
      messagelist: []
    };
  },
  created() {
    this.token = window.sessionStorage.getItem('token')
    this.user_id = window.sessionStorage.getItem('id')
    this.getmessagelist('comment');
  },
  methods: {
      jumpto(file_id, msg_id) {
          var that=this;
          this.$http.get(this.$API + '/msg/judge/file/',
              {headers:{token:window.sessionStorage.getItem('token')},
                  params:{file_id:file_id, msg_id: msg_id}}
          ).then(()=>{
              file_id = window.btoa('hello,world'+file_id+'s')
              that.$router.push('/edit/' + file_id)
          }).catch(()=>{
              that.$message.error('该文件已不存在，这条消息将会被自动删除');
              that.reload();
          })

      },
    getmessagelist(type) {
      var that = this;
      Vue.axios.get(
        this.$API + '/getmsg/',
        {headers: {token: window.sessionStorage.getItem("token")},
        params: {msg_types: type}}
      ).then(function(res){
        console.log(res);
        that.messagelist=res.data.data;
        that.data();
      }).catch(function(error){
        console.log(error,Response);
      })
    },
    setread(id) {
      var that = this;
      Vue.axios.get(
        this.$API + '/set/read/',
        {headers: {token: window.sessionStorage.getItem("token")},
        params: {msg_id: id}}
      ).then(function(res){
        console.log(res);
        that.reload();
      }).catch(function(error){
        console.log(error,Response);
      })
    },
    setunread(id) {
      var that=this;
      Vue.axios.get(
        this.$API + '/set/unread/',
        {headers: {token: window.sessionStorage.getItem("token")},
        params: {msg_id: id}}
      ).then(function(res){
        console.log(res);
        that.reload();
      }).catch(function(error){
        console.log(error,Response);
      })
    },
    setallread() {
      var that=this;
      Vue.axios.get(
        this.$API + '/set/type/read/all/',
        {headers: {token: window.sessionStorage.getItem("token")},
        params: {msg_types: 'comment'}}
      ).then(function(res){
        console.log(res);
        that.reload();
      }).catch(function(error){
        console.log(error,Response);
      })
    },
    data() {
      this.messagelist.forEach((item) => {
        item.msg_time = this.time(item.msg_time);
        item.msg_is_read = this.read(item.msg_is_read);
      })
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
    },
    msgshare() {
        this.$router.push('/message_share')
    },
    delmsg(msg_id) {
      var that = this
      Vue.axios.get(
        this.$API + '/msg/delete/',
        {headers: {token: window.sessionStorage.getItem("token")},
        params: {msg_id: msg_id}}
      ).then(function(res){
        console.log(res);
        that.reload();
      }).catch(function(error){
        console.log(error,Response);
      })
    },
    delmsgall() {
      var that = this
      Vue.axios.get(
        this.$API + '/msg/delete/all/',
        {headers: {token: window.sessionStorage.getItem("token")},
        params: {msg_type: 'comment'}}
      ).then(function(res){
        console.log(res);
        that.reload();
      }).catch(function(error){
        console.log(error,Response);
      })
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
  margin-right: 15px;
}

.set{
  margin-right: 80px;
}
</style>