<template>
  <div class="background">
    <Header :url="url"></Header>
    <el-card style="height: 780px;">
      <el-container>
        <el-header style="height: 50px">
          <div class="font_type">{{title}}</div>
        </el-header>
        <el-main style="height: 630px">
          <el-upload
              class="avatar-uploader"
              :action="serverUrl"  
              name="file"
              :headers="header"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError">
          </el-upload>
          <quill-editor v-model="detailContent" style="height: 500px;" 
              ref="myQuillEditor" 
              :options="editorOption">
              {{detailContent}}
          </quill-editor>
        </el-main>
        <!-- el-footer>
          <el-button type="primary" round @click="Submit">确认提交</el-button>
        </el-footer-->
      </el-container>
    </el-card>
    <Footer></Footer>
  </div>
</template>

<script>
  import {
    Quill,
    quillEditor
  } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  
  import Header from './header.vue' 
  import Footer from './footer.vue'

  //引入font.css 
  import '../../assets/css/font.css'
  
  // 自定义字体大小
  let Size = Quill.import('attributors/style/size')
  Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
  Quill.register(Size, true)

  // 自定义字体类型
  var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
    '宋体', '黑体'
  ]
  var Font = Quill.import('formats/font')
  Font.whitelist = fonts
  Quill.register(Font, true)

  const toolbarOptions = [
              ['bold', 'italic', 'underline'],        // toggled buttons
              ['blockquote', 'code-block'],
              [{'header': 1}],               // custom button values
              [{'list': 'ordered'}],
              [{'direction': 'rtl'}],                         // text direction

              //[{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
              [{'header': [1, 2, 3, 4, 5, 6, false]}],

              [{'color': []}, {'background': []}],          // dropdown with defaults from theme
              [{'font': []}],
              [{'align': []}],
              ['link', 'image'],
              ['clean']                                         // remove formatting button
        ]

  export default {
    name: 'FuncFormsEdit',
    components: {
      quillEditor,
      Header,
      Footer
    },
    data() {
      return {
        url:'////',
        title:'Title',
        serverUrl: '/api/file/uploadForApp',
        header: {token: sessionStorage.token},
        detailContent:'',  //富文本编辑器内容
        editorOption: {
            placeholder: '请输入.....',
            theme: 'snow',  // or 'bubble'
            modules: {
              toolbar: {
                container: toolbarOptions,  // 工具栏
                handlers: {
                  'image': function (value) {
                    if (value) {
                      //****就是这里自定义了图片上传的事件****
                      //你们可以alert(1111)试下有没有成功
                      alert(111)
                      console.log(this.header);
                      document.querySelector('.avatar-uploader input').click()
                    } else {
                      
                      alert(115)
                      this.quill.format('image', false);
                    }
                  }
                }
              }
            }
        },
      }
    },
    methods:{
      uploadSuccess(res, file) {
                    console.log('图片上传到服务器',file.response.data.fileUrl)
                    //res为图片服务器返回的数据
                    //获取富文本组件实例
                    let quill = this.$refs.myQuillEditor.quill
                    console.log('uploadSuccess的res',res)
                    // 如果上传成功
                    if (res.code == 0 && res.data !== null) {
                        // 获取光标所在位置
                        let length = quill.getSelection().index;
                        // 插入图片  res.info为服务器返回的图片地址
                        quill.insertEmbed(length, 'image', res.data.fileUrl)
                        // 调整光标到最后
                        quill.setSelection(length + 1)
                    } else {
                        this.$message.error('uploadSuccess图片插入失败')
                    }
                },
      GetContents(){
        return this.detailContent;
      },
      Submit(){
        this.$notify({
          title: '成功',
          message: '您已成功提交修改！',
          type: 'success'
        });
      },
    },
    watch:{
      detailContent:function(){
        console.log(this.detailContent);
      }
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
  .el-header, .el-footer {
    color: #333;
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
  }
  .font_type{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 50px;
  }
  .background{
    background-color: #F2F6FC;
  }
</style>