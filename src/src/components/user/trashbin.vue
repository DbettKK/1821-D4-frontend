<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="recently">最近使用</el-menu-item>
            <el-menu-item index="2" @click="myproduction">我创建的</el-menu-item>
            <el-menu-item index="3" @click="favorite">我的收藏</el-menu-item>
            <el-menu-item index="4" @click="trashbin">回收站</el-menu-item>
          </el-menu>
          <el-card :body-style="{ padding: '0px' }" shadow="hover" class="newfile" @click.native="dialog1=true">
            <i class="el-icon-circle-plus bt">新建文档</i>
          </el-card>
        </el-header>
        <el-dialog title="是否新建私人文档" :visible.sync="dialog1" width="30%">
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialog1=false">取 消</el-button>
            <el-button type="primary" @click="submit()" >确 定</el-button>
          </div>
        </el-dialog>
        <el-main>
        <el-table :data="tableData" height=666px style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" :row-style="{height: '35px'}">
            <el-table-column prop="file_title" label="文件名称" @contextmenu.prevent=""></el-table-column>
            <el-table-column prop="creator_name" label="文档创建人" width="240px"></el-table-column>
            <el-table-column prop="delete_time" :formatter="dateFormat" label="删除日期" width="240px"></el-table-column>
            <el-table-column fixed="right" width="50">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="放回原处" placement="bottom-end">
                  <el-button @click.native="redo(scope.row.id)" type="text" style="color: #999" size="mini">
                    <i class="el-icon-thumb"></i>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column fixed="right" width="50">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="彻底删除" placement="bottom-end">
                  <el-button @click.native="del(scope.row.id)" type="text" style="color: #999" size="mini">
                    <i class="el-icon-delete-solid"></i>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
        </el-table>
        <el-card :body-style="{ padding: '0px' }" shadow="hover" class="Empty" @click.native="dialog3=true" style="position: absolute; left: 85%;">
          <i class="el-icon-delete bt">清空回收站</i>
        </el-card>
        </el-main>
        <el-dialog title="确认清空回收站" :visible.sync="dialog3" width="30%">
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialog3=false">取 消</el-button>
            <el-button type="primary" @click="Empty()" >确定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="确认将文档从回收站放回原处" :visible.sync="dialog" width="30%">
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialog=false">取 消</el-button>
            <el-button type="primary" @click="submitredo()" >确定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="确认将文档从回收站彻底删除" :visible.sync="dialog2" width="30%">
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialog2=false">取 消</el-button>
            <el-button type="primary" @click="submitdel()" >确定</el-button>
          </div>
        </el-dialog>
    </el-container>
</template>

<script>
  import Vue from 'vue'
  import fecha from 'fecha'
  export default {
    inject: ['reload'],
    data() {
      return {
        activeIndex:'4',
        tableData: [],
        dialog: false,
        dialog1: false,
        dialog2: false,
        dialog3: false,
        id: '1'
      }
    },
    created() {
      this.getTabledata()
    },
    methods:{
      getTabledata() {
      var that = this;
      Vue.axios.get(
        'http://175.24.121.113:8000/myapp/file/delete/get/',
        {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function(res){
        console.log(res);
        that.tableData=res.data.data;
      }).catch(function(error){
        console.log(error,Response);
      })
    },
    dateFormat(row, column, cellValue) {
        return cellValue ? fecha.format(new Date(cellValue), 'YYYY-MM-DD') : '';
      },
    time(a) {
      this.doctime = a.toString().substr(0, 10)
         return this.doctime
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
    redo(a) {
      this.id = a;
      console.log(this.id);
      this.dialog = true;
    },
    del(a) {
      this.id = a;
      console.log(this.id);
      this.dialog2 = true;
    },
    submitredo(){
      this.$http.get('http://175.24.121.113:8000/myapp/file/isdelete/',{
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: this.id, is_delete: 'False'}
      }
      ).then(function (res) {
        console.log(res.data);
      }).catch(function (error) {
        console.log(error.response);
      });
      this.dialog=false;
      this.getTabledata();
      this.reload();
    },
    submitdel(){
      this.$http.get('http://175.24.121.113:8000/myapp/file/realdelete/',{
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: this.id}
      }
      ).then(function (res) {
        console.log(res.data);
      }).catch(function (error) {
        console.log(error.response);
      });
      this.dialog2=false;
      this.getTabledata();
      this.reload();
    },
    submit(){
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/create/pri/',
              {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        console.log(res.data);
        that.file_id=res.data.data.id;
        console.log(that.file_id);
        that.addrecent();
      }).catch(function (error) {
        console.log(error.response);
      });
      this.dialog=false;
      this.getTabledata();
      this.reload();
    },
    Empty() {
      this.$http.get('http://175.24.121.113:8000/myapp/file/delete/all/',{
                headers: {token: window.sessionStorage.getItem("token")}
      }
      ).then(function (res) {
        console.log(res.data);
      }).catch(function (error) {
        console.log(error.response);
      });
      this.dialog3=false;
      this.getTabledata();
      this.reload();
    },
    addrecent() {
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
      this.getTabledata();
      this.reload();
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
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    color: rgb(180, 180, 180);
    margin-right: 0;
    margin-bottom: 0;
    width: 20%;
}
.newfile {
  height: 30px;
  width: 120px;
  background-color: rgb(36, 36, 36);
  font-size: 11px;
  margin-top: 20px;
  margin-right: 100px;
  color: rgb(180, 180, 180);
  position: relative;
  cursor: pointer;
  .bt {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%)translateY(-50%);
  }
}
.Empty {
  height: 30px;
  width: 150px;
  background-color: rgb(180, 180, 180);
  font-size: 11px;
  margin-top: 20px;
  margin-right: 100px;
  color: rgb(36, 36, 36);
  position: relative;
  cursor: pointer;
  .bt {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%)translateY(-50%);
  }
}
</style>