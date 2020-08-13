<template>
  <div class="background">
    <Header :url="url" :title="title" :file_id="file_id" :content="content"></Header>
    <el-card style="height: 780px;">
      <el-container>
        <el-header style="height: 50px">
          <div class="font_type" @click="drawer=true">{{title}}</div>
        </el-header>
        <el-main>
          <mavon-editor
            ref="md"
            :editable="showable"
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
      <el-table
        :data="comments"
        stripe
        style="width: 100%">
        <el-table-column
          prop="uesername"
          label="姓名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="comment"
          label="评论"
          width="300">
        </el-table-column>
      </el-table>
    </el-drawer>
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
        showable:true,
        drawer: false,
        direction: 'rtl',
        url:'12',
        title:'Title',
        file_id:10,
        content: "",
        comments:[
          {
            uesername:'yty',
            comment:'lalallalalalalallal'
          },{
            uesername:'yty',
            comment:'lalallalalalalallal'
          },{
            uesername:'yty',
            comment:'lalallalalalalallal'
          },{
            uesername:'yty',
            comment:'lalallalalalalallal'
          },
          ],
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
      GetContents(){
        return this.detailContent;
      },
      $imgAdd(pos, $file){
        var formdata = new FormData();
        formdata.append('image', $file);
        Vue.axios.post(
        'http://175.24.121.113:8000/myapp/picSave/',formdata,
        {headers: { 'Content-Type': 'multipart/form-data' }},
        ).then((response)=>{
        this.$refs.md.$img2Url(pos, response.data.data.url);
        })
      },
    },
    watch:{
    },
    created(){
      document.title=this.title;
      this.url=this.$route.path;
      console.log(this.$route.path)
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
</style>