<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px">
            <!--
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="recently">最近使用</el-menu-item>
            <el-menu-item index="2" @click="myproduction">我创建的</el-menu-item>
            <el-menu-item index="3" @click="favorite">我的收藏</el-menu-item>
            <el-menu-item index="4" @click="trashbin">回收站</el-menu-item>
          </el-menu>
          -->
        </el-header>
        <el-main>
          <el-row v-for="(page, index) of pages" :key="index" style="margin-bottom: 40px;">
            <el-col :span="8" align="left" v-for="(item, innerindex) of page" :key="item.id" :offset="innerindex > 0 ? 2 : 0" style="margin-right: -60px;">
              <el-card :body-style="{ padding: '0px' }" shadow="hover" @click.native="edit(item.id)">
                <div style="padding: 14px;">
                  <div class="top">
                    <div style="display: flex; align-items: start;">
                      <div class="docicon"><i class="el-icon-document"></i></div>
                      <span>{{item.file_title}}</span>
                    </div>
                    <el-dropdown trigger="hover" style="font-size: 1px; color: #999;" placement="bottom-start">
                      <span class="el-dropdown-link">···</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-star-on" @click.native="addFavorite(item.id)">收藏</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete-solid" @click.native="remove(item.id)" disabled>从列表中删除</el-dropdown-item>
<!--                        <el-dropdown-item icon="el-icon-delete-solid" v-if="item.person">移到回收站</el-dropdown-item>-->

                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time" style="margin-right: 40px;">{{time(item.last_modified)}} 我 打开</time>
                    <span style="font-size: 13px; color: #999;">该文档创建者：</span>
                    <span style="font-size: 13px; color: #999;">{{item.file_creator_name}}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
<!--        <div class="right_pannels">&lt;!&ndash;右边按钮栏&ndash;&gt;-->
<!--            <div class="button_container">-->
<!--            <div class="button_create_team_doc">   -->
<!--                <el-button class="shenhui"  style="width:160px" icon="el-icon-edit">-->
<!--                    新建-->
<!--                </el-button>-->
<!--            </div>-->
<!--            <div class= button_putin>-->
<!--                <el-button type='info'  style="width:160px" icon="el-icon-plus"  >-->
<!--                    导入-->
<!--                </el-button>-->
<!--            </div>-->
<!--            </div>-->

<!--        </div>-->

    </el-container>
</template>

<script>
import Vue from 'vue'
export default {
    inject: ['reload'],
  data() {
    return {
        file_id: null,
      activeIndex:'1',
      doclist: [],
        five: 0
    };
  },
  created() {
    this.getDoclist()
  },
    watch: {//监听下个访问的东西是不是还是teamspace，是则重新获取
        '$route' (to, from) {
            if(to.name === 'Teamspace'){
                this.getDoclist();
            }
            if(from.name==='post')//纯粹为了避免unused
            {
                this.five++;
            }
        }
    },
  methods: {
    getDoclist() {
      var that = this;
      Vue.axios.get(
          'http://175.24.121.113:8000/myapp/file/team/get/', {
              headers: {'token': window.sessionStorage.getItem('token')},
              params:{team_id: that.$route.params.id.toString()}}
      ).then(function(res){
        console.log(res);
        that.doclist=res.data.data;
      }).catch(function(error){
        console.log(error,Response);
      })
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
    time(a) {
         this.doctime = a.toString().substr(0, 10)
         return this.doctime
    },
    addrecent(){
        var that = this;
        this.$http.get('http://175.24.121.113:8000/myapp/file/browse/', {
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: that.file_id}
            }
        ).then(function (res) {
            console.log(res.data);
        }).catch(function (error) {
            console.log(error.response);
        });
        this.file_id='';
        this.getDoclist();
        this.reload();
    },
    edit(file_id){
      this.file_id = file_id;
      this.addrecent();
      this.$router.push('/edit/' + file_id)
    },
      addFavorite(file_id){
          var that = this;
          this.$http.get('http://175.24.121.113:8000/myapp/file/favorite/',
              {
                  headers: {token: window.sessionStorage.getItem("token")},
                  params:{file_id: file_id}
              }
          ).then(function (res) {
              console.log(res.data);
              that.file_id=res.data.data.file;
              console.log(that.file_id);
              that.addrecent();
          }).catch(function (error) {
              console.log(error.response.data);
              console.log(window.sessionStorage.getItem("token"))
          });
          this.getDoclist();
          this.reload();
      },
      remove(file_id) {
          this.$http.get('http://175.24.121.113:8000/myapp/file/browse/delete/',
              {
                  headers: {token: window.sessionStorage.getItem("token")},
                  params:{file_id: file_id}
              }
          ).then(function (res) {
              console.log(res.data);
          }).catch(function (error) {
              console.log(error.response.data);
              console.log(window.sessionStorage.getItem("token"))
          });
          this.getDoclist();
          this.reload();
      },
  },
  computed: {
    pages () {
      const pages = []
      this.doclist.forEach((item, index) => {
        const page = Math.floor(index / 2)
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
.title {
    color: #333;
    margin-bottom: -20px;
    font-size: 20px;
    line-height: 1.7;
    display: flex;
    align-items: center;
    font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}
.time {
  font-size: 13px;
  color: #999;
}

.docicon {
  margin-right: 12px;
  color: #999;
}

.top {
  display: flex;
  justify-content: space-between;
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
    clear: both;
}

.right_pannels{
display: flex;
    z-index: 100;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    box-sizing: border-box;
    position: absolute;
    padding-top: 38px;
    right: 0px;
    top: 0px;
    bottom: 0;
    width: 244px;
    margin: 0;
    padding: 0;
    outline: none;
}
.button_container
{
    
    margin-bottom: 40px;
    margin-top: 100px;
    width: 160px;
    top:100px;
    left:50px;
    margin: 0;
    padding: 0;
    outline: none;
    position:absolute;
}
.button_putin
{
    top:40px;
     margin-top: 20px;
     //length:60px;
    position: absolute;

}
.shenhui {
  background-color: rgb(73, 74, 75);
  border-color:  rgb(73, 74, 75);;
  color: #fff;
}
//特意设置了鼠标聚焦时的颜色，不然莫名其妙就会变
.shenhui:hover{
    background-color: rgb(73, 74, 75);
  border-color:  rgb(73, 74, 75);;
  color: #fff;
}
.bt {
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translateX(-50%)translateY(-50%);
 }
</style>