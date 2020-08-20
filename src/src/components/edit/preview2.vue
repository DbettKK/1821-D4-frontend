<template>
  <div class="background" >
    <el-card style="height: 780px;">
      <el-container>
        <el-header style="height: 50px">
          <div class="font_type">{{title}}</div>
        </el-header>
        <el-main>
          <mavon-editor
            ref="md"
            :editable="false"
            placeholder="请输入文档内容..."
            :boxShadow="true"
            :subfield="false"
            defaultOpen="preview"
            style="z-index:1;border: 1px solid #d9d9d9;height:85vh"
            v-model="content"
            :toolbarsFlag="false"
            :toolbars="toolbars"/>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'FuncFormsEdit',
    components: {
    
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
      change(data){
        this.drawer=data;
      },
      GetContents(){
        Vue.axios.post('http://175.24.121.113:8000/myapp/file/create/preview/',
        this.$qs.stringify({
          model:this.$route.params.mode,
        }),
          {
            headers: {'token': window.sessionStorage.getItem('token')},
          }
        ).then(res => {
          this.file_id=res.data.data.mod_title;
          this.content=res.data.data.mod_content;
        });
      },
      GetContent2(){
        Vue.axios.get('http://175.24.121.113:8000/myapp/user/other/previewfile/',
          {params:{
            file_id:this.file_id,
          },}
        ).then(res => {
          this.title=res.data.data.file_title;
          this.content=res.data.data.file_content;
        });
      }
    },
    watch:{
    },
    created(){
        this.url=this.$route.path;
        console.log(this.url.substr(9));
        this.file_id=window.atob(this.$route.params.id).substr(11);
        this.file_id=this.file_id.substr(0,this.file_id.length-1);
        console.log(this.file_id);
        this.GetContent2();
        document.title=this.title;
    
      //this.fullscreenLoading = false;
    },
    goBack() {
            //window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        }
  }
</script>

<style scoped>
  
  .font_type{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 50px;
  }
  .background{
    background-color: #F2F6FC;
  }
  .el-main{
    height: 100%;
    width: 100%;
  }
  .el-footer{
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
  }
</style>