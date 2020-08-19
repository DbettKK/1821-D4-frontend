<template>
  <div class="background" >
    <Header :can_edit="can_edit" :can_share="can_share" :url="url" :title="title" :file_id="parseInt(file_id)" :content="content" :collect="collect" v-bind:team_belong="team_belong" @event1="change($event)" ></Header>
<!--    <Bnt @click1="drawer=true"></Bnt>-->
<!--    <el-card style="height: 780px;">-->
      <el-container>
<!--        <el-header style="height: 50px">-->
<!--          <div class="font_type">{{title}}</div>-->
<!--        </el-header>-->
<!--        <el-main>-->
          <mavon-editor
            ref="md"
            :editable="can_edit"
            @imgAdd="$imgAdd"
            placeholder="请输入文档内容..."
            :boxShadow="true"
            :subfield="can_edit"
            defaultOpen="preview"
            style="z-index:1;border: 1px solid #d9d9d9;height:90vh;width:100%;"
            v-model="content"
            :toolbarsFlag="can_edit"
            :toolbars="toolbars"/>

        <el-timeline v-if="this.privilege!='1'" class="timeline">
          <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  icon='el-icon-more'
                  color='#0bbd87'
                  type="primary"
                  :timestamp="activity.time.substr(0,19).replace('T', ' ')">
            {{activity.user_username}} 修改于
          </el-timeline-item>
        </el-timeline>
<!--        </el-main>-->
        <!-- el-footer>
          <el-button type="primary" round @click="Submit">确认提交</el-button>
        </el-footer-->
      </el-container>
<!--    </el-card>-->
    <el-drawer
      title="用户评论"
      :visible.sync="drawer"
      :direction="direction">
      <el-main>
        <el-row v-for="item in comments" :key="item.id">
          <el-col :span="24">
            <el-card :body-style="{ padding: '1px' }" shadow="hover" class="box-card">
              <div style="padding: 14px;">
                <div slot="header" class="clearfix">
                  <div style="display: flex; align-items: start;">
                    <div class="docicon"><i class="el-icon-chat-line-round"></i></div>
                    <span style="margin-left: 5px;">{{item.content}}</span>
                  </div>
                </div>
                <div class="bottom clearfix">
                  <span style="font-size: 13px; color: #999;margin-right: 20px;cursor: pointer" @click="toOther(item.person)">
                    评论用户：{{item.username}}
                  </span>
                  <span style="font-size: 13px; color: #999;margin-right: 25px;">评论时间：{{time(item.create_time)}}</span>
                  <span style="font-size: 13px; color: #999;margin-right: 15px;cursor: pointer;" @click="agree(item.id)"><i class="el-icon-good"></i>{{item.agree_set.length}}</span>
                  <span style="font-size: 13px; color: #999;cursor: pointer"><i class="el-icon-bad" @click="disagree(item.id)"></i>{{item.disagree_set.length}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-button type="primary" @click="L_comment" round >编写评论</el-button>
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
        <el-button type="primary" style="margin-left: 20px" @click="add_comment">确 定</el-button>
      </div>
    </el-dialog>
<!--    <Footer></Footer>-->
  </div>
</template>

<script>
  import Header from './header.vue' 
  //import Footer from './footer.vue'
  //import Bnt from './hoverBnt.vue'
  import '@/assets/iconfont/iconfont.css'
  import Vue from 'vue'
  export default {
    name: 'FuncFormsEdit',
    components: {
      //Bnt,
      Header,
      //Footer
    },
    data() {
      return {
        activities: [],
        collect:false,
        drawer: false,
        CommentdialogFormVisible:false,
        comment:'',
        direction: 'ltr',
        url:'12',
        title:'Title',
        file_id: '',
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
        },
        team_belong:true,
        
      }
    },
    methods:{
      getTimeLine(file_id){
        Vue.axios.get(
          "http://175.24.121.113:8000/myapp/file/timeline/get/",
          {
            headers: {token: window.sessionStorage.getItem('token')},   
            params:{
              file_id:file_id
            }
          }).then((res)=>  {

            this.activities=res.data.data;
          }).catch(res => {
            this.$message.error(res.response.data.info);
              console.log(res);
        });
      },
      ShowDrawer(){

      },
      toOther(uid) {
        this.$router.push('/otherInfo/' + window.btoa('hello,world'+uid+'nihao'));
      },
      L_comment(){
        if(this.can_comment==true)
          this.CommentdialogFormVisible=true;
        else
          this.$message({message: '您没有这个权限哦', type: 'warning'})
      },
      time(a) {
        this.doctime = a.toString().substr(0, 10)
        return this.doctime
      },
      agree(id){

        Vue.axios.get(
          "http://175.24.121.113:8000/myapp/comment/agree/",
          {
            headers: {token: window.sessionStorage.getItem('token')},
            
            params:{
              comment_id:id
            }
          }).then((res)=>  {
            console.log(res)
            this.$message({message: '点赞成功',type: 'success'})
            this.get_comment();
          }).catch(res => {
            this.$message.error(res.response.data.info);
              console.log(res);
        });
      },
      disagree(id){
        Vue.axios.get(
          "http://175.24.121.113:8000/myapp/comment/disagree/",
          {
            headers: {token: window.sessionStorage.getItem('token')},
            
            params:{
              comment_id:id
            }
          }).then((res)=>  {
            console.log(res)
          this.$message({message: '反对成功',type: 'success'})
            this.get_comment();

          }).catch(res => {
            this.$message.error(res.response.data.info);
              console.log(res);
        });
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
              this.$message({
                message: '您已成功提交！',
                type: 'success'
              });
              this.comment='';
              this.get_comment();
          }).catch(res => {
              console.log(res);
        });
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
        Vue.axios.get('http://175.24.121.113:8000/myapp/file/getedit/',
          {headers: {'token': window.sessionStorage.getItem('token')},
            params:{file_id:this.file_id}}
        ).then(res => {
          if (res.data.is_edit){
            this.$message({
              message: '当前文档正在被修改 请稍等',
              type: 'warning'
            });
            this.$router.push('/recently');
          }
          this.title=res.data.data.file_title;
          this.content=res.data.data.file_content;
          this.collect=res.data.is_kept;
          this.file_type=res.data.data.type;
          if(res.data.data.team_belong==null)
            this.team_belong=false;
          this.privilege=res.data.pri;
          this.judgePri();
          //this.getPri(res.data.data.type);
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
          that.privilege=res.data.data.pri;
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
          if (this.privilege >= 3){
            this.can_comment=true;
            if (this.privilege >= 4){
              this.can_share=true;
            }
          }
        }
      },
      addrecent() {
        Vue.axios.get('http://175.24.121.113:8000/myapp/file/browse/', {
                params: {'file_id': this.file_id},
                  headers: {'token': window.sessionStorage.getItem("token")}
                }
        ).then(function (res) {
          console.log(res.data);
        }).catch(function (error) {
          console.log(error.response);
        });
      },
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        console.log(from);
        if(from.path==='/message_comments' || from.name === 'OtherInfo'){
          vm.drawer=true;
        }

      })
    },
    created(){
      console.log(window.name)
      this.url=this.$route.path;
      let str = window.atob(this.$route.params.id).substr(11)
      this.file_id=str.substr(0, str.length-1);
      document.title=this.title;
      if(window.name==''){
        console.log("刚进来")
        window.name = "isReload";
        if(window.sessionStorage.getItem('token')){
          this.GetContents();
          this.get_comment();
          this.addrecent();
          this.getTimeLine(this.file_id);
        }
        else{
          this.$message({
            message: '想查看文档 请先登录哦',
            type: 'warning'
          });
          this.$router.push('/');
        }
      }else if(window.name == "isReload"){
        console.log("刷新")
        this.$http.get('http://175.24.121.113:8000/myapp/file/edit/save/',
                {headers: {token: window.sessionStorage.getItem('token')},
                  params: {file_id: this.file_id}}
        ).then(()=>{
          if(window.sessionStorage.getItem('token')){
            this.GetContents();
            this.get_comment();
            this.addrecent();
            this.getTimeLine(this.file_id);
          }
          else{
            this.$message({
              message: '想查看文档 请先登录哦',
              type: 'warning'
            });
            this.$router.push('/');
          }
        });
      }

    },
    destroyed(){
      window.name="";
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
    width: 70%;
    margin-left: 14%;
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
  .el-row {
    margin-bottom: 3px;
  }
  .font_type{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 50px;
  }
  .background{
    background-color: white;
  }
  .el-main{
    height: 85%;
    width: 100%;
  }
  .el-footer{
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
  }
  .box-card{
    margin-left:0px;
    width: 100%;
    height: 90%;
    padding-top: 2px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .float{
    position: absolute;
    right: 40px;
    top: 30%;
    touch-action: none ;
    text-align: center;
    width: 48px;
    height: 48px;
    border-radius: 24px;
    line-height: 48px;
    background: rgba(95, 95, 105, 0.88);
    color: white;
  }
  .timeline{
    float: right;
    margin-right:3%;
    width:200px;
    margin-top:3%;
  }
</style>