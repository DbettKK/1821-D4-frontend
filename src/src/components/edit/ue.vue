<template>
  <div class="background" >
    <Header :can_comment="can_comment" :can_edit="can_edit" :can_share="can_share" :url="url" :title="title" :file_id="parseInt(file_id)" :content="content" :collect="collect" @event1="change($event)"></Header>
    <el-card style="height: 780px;">
      <el-container>
        <el-header style="height: 50px">
          <div class="font_type">{{title}}</div>
        </el-header>
        <el-main>
          <mavon-editor
            ref="md"
            :editable="can_edit"
            @imgAdd="$imgAdd"
            placeholder="请输入文档内容..."
            :boxShadow="true"
            style="z-index:1;border: 1px solid #d9d9d9;height:85vh"
            v-model="content"
            :toolbars="toolbars"/>
        </el-main>
        <!-- el-footer>
          <el-button type="primary" round @click="Submit">确认提交</el-button>
        </el-footer-->
      </el-container>
    </el-card>
    <el-drawer
      title="用户评论"
      :visible.sync="drawer"
      :direction="direction">
      <el-main>
        <el-table
          :data="comments"
          stripe
          style="width: 100%">
          <el-table-column
            prop="username"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="content"
            label="评论"
            width="290">
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-button type="primary" round @click="L_comment">编写评论</el-button>
      </el-footer>
    </el-drawer>
    <el-dialog title="添加用户评论" :visible.sync="CommentdialogFormVisible" width="30%">
      <el-form >
        <el-form-item label=" 说说你对这篇文档的看法：" >
          <el-input autocomplete="off" v-model="comment" placeholder="请输入短评..."></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CommentdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_comment">确 定</el-button>
      </div>
    </el-dialog>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from './header.vue' 
  import Footer from './footer.vue'
  import Vue from 'vue'
  export default {
    name: 'FuncFormsEdit',
    components: {
      Header,
      Footer
    },
    data() {
      return {
        collect:false,
        drawer: false,
        CommentdialogFormVisible:false,
        comment:'',
        direction: 'ltr',
        url:'12',
        title:'Title',
        file_id:10,
        file_type: '',
        privilege: '',
        can_edit: false,
        can_comment: false,
        can_share: false,
        content: "",
        comments:[],
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: false, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: false, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true // 预览
        }
      }
    },
    methods:{
      L_comment(){
        this.CommentdialogFormVisible=true;
      },
      add_comment(){
        this.CommentdialogFormVisible = false;
        Vue.axios.post(
          "http://175.24.121.113:8000/myapp/file/comment/",this.$qs.stringify({
              file_id:this.file_id,
              comment:this.comment
          }),{headers: {token: window.sessionStorage.getItem('token')}
          }).then((res)=>  {
              console.log(res);
              this.comments.push({id:res.data.data.id,username:res.data.data.username,content:this.comment})
              this.$notify({
                title: '成功',
                message: '您已成功提交！',
                type: 'success'
              });
          }).catch(res => {
              console.log(res);
        });
        this.get_comment();
      },
      get_comment(){
        Vue.axios.get(
            'http://175.24.121.113:8000/myapp/file/comment/get/',
            {headers: {token: window.sessionStorage.getItem('token')},
              params: {file_id: this.file_id}}
        ).then(res=>{
            this.comments=res.data.data;
            console.log(res);
        }).catch(function(error){
            console.log(error);
        })
      },
      change(data){
        this.drawer=data;
      },
      GetContents(){
        Vue.axios.get('http://175.24.121.113:8000/myapp/file/get/',
          {headers: {'token': window.sessionStorage.getItem('token')},
            params:{file_id:this.file_id}}
        ).then(res => {
          if (res.data.data.is_edit_now){
            this.$message({
              message: '当前文档正在被修改 请稍等',
              type: 'warning'
            });
            this.$router.push('/');
          }
          this.title=res.data.data.file_title;
          this.content=res.data.data.file_content;
          this.collect=res.data.is_kept;
          this.file_type=res.data.data.type;
          this.getPri(res.data.data.type);
        });
      },
      $imgAdd(pos, $file){
        var formdata = new FormData();
        console.log($file)
        formdata.append('image', $file);
        Vue.axios.post(
        'http://175.24.121.113:8000/myapp/picSave/',formdata,
        {headers: { 'Content-Type': 'multipart/form-data' }},
        ).then((response)=>{
        this.$refs.md.$img2Url(pos, 'http://175.24.121.113:8000/myapp/media/' + response.data.url);
        })
      },
      getPri(type){
        var that = this;
        this.$http.get('http://175.24.121.113:8000/myapp/'+type+'/privi/judge/',
                {headers: {token: window.sessionStorage.getItem('token')},
                  params: {file_id: this.file_id}}
        ).then(function (res) {
          console.log(res.data.data.pri);
          that.privilege=res.data.data.pri;
          console.log(typeof that.privilege);
          that.judgePri();
        })
      },
      judgePri(){
        if(this.privilege === 1){
          this.$message({
            message: '由于您的权限问题，当前页面只能查看哦',
            type: 'warning'
          });
        }else if(this.privilege >= 2){
          this.can_edit=true;
          this.$http.get('http://175.24.121.113:8000/myapp/file/edit/',
                  {headers: {token: window.sessionStorage.getItem('token')},
                    params: {file_id: this.file_id}});
          if (this.privilege >= 3){
            this.can_comment=true;
            if (this.privilege >= 4){
              this.can_share=true;
            }
          }
        }
      },

    },
    watch:{
    },
    created(){
      //this.fullscreenLoading = true;
      if(window.sessionStorage.getItem('token')){
        this.url=this.$route.path;
        this.file_id=this.$route.params.id;
        document.title=this.title;
        //this.enterEdit();
        this.GetContents();
        this.get_comment();
      }
      else{
        this.$message({
          message: '想查看文档 请先登录哦',
          type: 'warning'
        });
        this.$router.push('/');
      }
      //this.fullscreenLoading = false;
    },
    destroyed(){
      this.$http.get('http://175.24.121.113:8000/myapp/file/edit/save/',
      {headers: {token: window.sessionStorage.getItem('token')},
        params: {file_id: this.file_id}}
      );
    }
  }
</script>

<style scoped>
  .el-card{
    padding-top: 5px;
    width: 65%;
    margin:0 auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 2px;
  }
  .el-button{
    vertical-align: middle;
    margin:0 auto;
    margin-top:10px;
  }
  .el-header{
    color: #333;
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
  }
  .el-main{
    height: 700px;
  }
  .font_type{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 50px;
  }
  .background{
    background-color: #F2F6FC;
  }
  .el-main{
    height: 90%;
    width: 100%;
  }
  .el-footer{
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
  }
</style>