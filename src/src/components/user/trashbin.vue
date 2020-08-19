<template>
    <el-container style="height: 100%; width: 100%; border: 0px">
        <el-header style="text-align: left; font-size: 20px; display: flex; justify-content: space-between;">
            <span style="color: grey;font-size: 40px">回收站</span>
            <el-button class="emptytrash" type="danger" @click.native="emptyTrash">
                <i class="el-icon-delete-solid"></i><span>清空回收站</span>
            </el-button>
<!--          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">-->
<!--            <el-menu-item index="1" @click="recently">最近使用</el-menu-item>-->
<!--            <el-menu-item index="2" @click="myproduction">我创建的</el-menu-item>-->
<!--            <el-menu-item index="3" @click="favorite">我的收藏</el-menu-item>-->
<!--            <el-menu-item index="4" @click="trashbin">回收站</el-menu-item>-->
<!--          </el-menu>-->
<!--          <el-card :body-style="{ padding: '0px' }" shadow="hover" class="newfile" @click.native="createFile">-->
<!--            <i class="el-icon-circle-plus bt">新建文档</i>-->
<!--          </el-card>-->
        </el-header>
<!--        <el-dialog title="是否新建私人文档" :visible.sync="dialog1" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog1=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="submit()" >确 定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
        <el-main>
        <el-table :data="tableData" height=666px style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" :row-style="{height: '35px'}">
            <el-table-column prop="file_title" label="文件名称" @contextmenu.prevent=""></el-table-column>
            <el-table-column prop="creator_name" label="文档创建人" width="240px"></el-table-column>
            <el-table-column prop="delete_time" :formatter="dateFormat" label="删除日期" width="240px"></el-table-column>
            <el-table-column fixed="right" width="50">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="放回原处" placement="bottom-end">
                  <el-button @click.native="redoFile(scope.row.id)" type="text" style="color: #999" size="mini">
                    <i class="el-icon-thumb"></i>
                  </el-button>
                </el-tooltip>
            </template>
            </el-table-column>
            <el-table-column fixed="right" width="50">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="彻底删除" placement="bottom-end">
                  <el-button @click.native="delFile(scope.row.id)" type="text" style="color: #999" size="mini">
                    <i class="el-icon-delete-solid"></i>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
        </el-table>

        </el-main>
<!--        <el-dialog title="确认清空回收站" :visible.sync="dialog3" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog3=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="Empty()" >确定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
<!--        <el-dialog title="确认将文档从回收站放回原处" :visible.sync="dialog" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="submitredo()" >确定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
<!--        <el-dialog title="确认将文档从回收站彻底删除" :visible.sync="dialog2" width="30%">-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialog2=false">取 消</el-button>-->
<!--            <el-button type="primary" @click="submitdel()" >确定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
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
        //dialog: false,
        //dialog1: false,
        //dialog2: false,
        //dialog3: false,
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
        that.tableData=res.data.data;
      }).catch(function(error){
        console.log(error.response.data.info);
      })
    },
    dateFormat(row, column, cellValue) {
        return cellValue ? fecha.format(new Date(cellValue), 'YYYY-MM-DD') : '';
      },
    time(a) {
      this.doctime = a.toString().substr(0, 10);
         return this.doctime;
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
    redoFile(file_id){
        this.$confirm('确定将回收站文件放回原处?', '文档恢复', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
        }).then(() => {
            this.id = file_id
            this.submitredo();
        });
    },
    submitredo(){
      var that=this
      this.$http.get('http://175.24.121.113:8000/myapp/file/isdelete/',{
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: this.id, is_delete: 'False'}
      }
      ).then(function () {
          that.$message({
              message: "恢复成功",//+res.data.file_id,
              type: "success"
          });
          that.getTabledata();
          that.reload();
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });
      //this.dialog=false;

    },
    delFile(file_id){
        this.$confirm('确定此文件彻底删除?', '文档彻底删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
        }).then(() => {
            this.id = file_id
            this.submitdel();
        });
    },
    submitdel(){
      var that=this
      this.$http.get('http://175.24.121.113:8000/myapp/file/realdelete/',{
                headers: {token: window.sessionStorage.getItem("token")},
                params:{file_id: this.id}
      }
      ).then(function () {
          that.$message({
              message: "成功彻底删除",//+res.data.file_id,
              type: "success",
          });
          that.getTabledata();
          that.reload();
      }).catch(function (error) {
        that.$message.error(error.response.data.info);
      });
      //this.dialog2=false;

    },
    createFile(){
        this.$confirm('确定新建一个私人文档吗?', '文档创建', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
        }).then(() => {
            this.submit();
        });
    }    ,
    submit(){
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/create/pri/',
              {headers: {token: window.sessionStorage.getItem("token")}}
      ).then(function (res) {
        that.file_id=res.data.data.id;
          that.$message({
              message: '创建成功 请前往我的创建中查看',
              type: 'success'
          })
        that.addrecent();
          that.getTabledata();
          that.reload();
      }).catch(function (error) {
          that.$message.error(error.response.data.info);
      });
    },
    emptyTrash(){
        this.$confirm('确定清空回收站所有文件?', '清空回收站', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.Empty();
        });
    },
    Empty() {
          var that=this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/delete/all/',{
                headers: {token: window.sessionStorage.getItem("token")}
      }
      ).then(function () {
        that.$message({
            message: '已经成功清空回收站',
            type: 'success'
        });
          that.getTabledata();
          that.reload();
      }).catch(function (error) {
        that.$messgae.error(error.response.data.info);
      });
      //this.dialog3=false;

    },
    addrecent() {
      var that = this;
      this.$http.get('http://175.24.121.113:8000/myapp/file/browse/', {
        headers: {token: window.sessionStorage.getItem("token")},
        params:{file_id: that.file_id}
      }
      ).then(function (res) {
        console.log(res.data);
          that.file_id='';
          that.getTabledata();
          that.reload();
      }).catch(function (error) {
        console.log(error.response);
      });

    },
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
.emptytrash{
    height: 40px;
    width: 130px;
    margin-top: 20px;
    margin-right: 80px;
}
</style>