<template>
<div>
    <Ba/>
    <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../../assets/logo_new.png" alt="">
      </div>
      <el-container>
        <el-main class="main1">
          <div class="In">金刚石文档：用户登录 </div>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <el-form-item prop="username">
              <el-input placeholder="请输入账号" v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input placeholder="请输入密码" v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" @keyup.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info" @click="resetloginForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-main>
        <el-footer>
          <el-container>
          <el-aside width="50%">
              <router-link to="/register" class="a">前往注册</router-link>
          </el-aside>
          <el-main class="main2">
              <router-link to="/FindPassword" class="a">忘记密码</router-link>
          </el-main>
          </el-container>
        </el-footer>
      </el-container>
    </div>
  </div>
</div>
</template>

<script>
import Ba from './background.vue'
export default {
  components:{
    Ba,
  },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },

      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          // 因为数据库现在存的都是简单密码。。所以这里min先改成2，之后再改回来
        ]
      },
    }
  },
  //保存登录状态
  created() {
    //console.log(sessionStorage.getItem("store"));
    //console.log(sessionStorage.length);
    // 如果sessionStorage中存储了store
    //if (sessionStorage.getItem("store")) {
      // replaceState 替换state根状态（参数为 对象）
      //this.$store.replaceState( Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store")))) 		                                         
    //}
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    //window.addEventListener("beforeunload",()=>{
        //sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    //})
  },
  
  methods: {
    resetloginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields();
    },
      login () {
          this.$refs.loginFormRef.validate(async (valid) => {
              if (!valid) return false;
              // 缺少请求路径login
              var that = this;
              this.$http.post('http://175.24.121.113:8000/myapp/login/',
                  this.$qs.stringify(this.loginForm)
              ).then(function (res) {
                console.log(res.data);
                window.sessionStorage.setItem("token", res.data.token);
                window.sessionStorage.setItem("id", res.data.data.id);
                that.$message({
                  message: "欢迎回来,"+res.data.data.username,
                  type: "success",
                  customClass: "c-msg",
                  duration:1000,
                  showClose: true
                });
                that.$router.push('/');
              }).catch(function (error) {
                console.log(error.message)
                that.$message({message: error.response.data.info, type:'error'})
              });
              // 这里后端返回了一个code就先用code看看效果




              // this.$http.post('http://175.24.121.113:8000/myapp/login/',
              //     this.$qs.stringify(this.loginForm)
              // ).then(function (res) {
              //     console.log(res.data)
              // }).catch(function (error) {
              //     console.log(error)
              // });
          });
      }

  }
}
</script>

<style lang="less" scoped>
.login_container {
  padding-top: 400px;
  padding-right: 400px;
  margin-right: 900px;
  //background-color:#e4ddd0;
  
  //opacity: 20%;
  height:320px;
}

.login_box {
  width: 380px;
  height: 500px;
  background-color: #fff;
  border-radius: 3px;
  margin-left: 330px;
  opacity: 85%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    opacity: 90%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    opacity: 90%;
    padding-top:10%;
    width: 90%;
    padding-left: 30px;
    box-sizing: border-box;
  }

  .btns {
    opacity: 90%;
    padding-top: 10%;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .a{
        text-decoration: none;
        padding-left: 20px;
        color:#333;
    }
    
  .main1 {
    height: 420px;
    text-align: center;
    line-height: 190px;
    opacity: 90%;
  }
  .main2{
    text-decoration: none;
    display:flex;
    justify-content:center;
    align-items:center;
    vertical-align: top;
    opacity: 90%;
  }
  .el-aside{
    text-decoration: none;
    display:flex;
    justify-content:center;
    align-items:center;
    vertical-align: top;
    opacity: 90%;
  }
  .In{
    vertical-align: bottom;
    height: 120px;
  }
}
</style>
