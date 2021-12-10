import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import mavonEditor from 'mavon-editor'
import "mavon-editor/dist/css/index.css"
//import { quillEditor } from 'vue-quill-editor'
//import * as Quill from 'quill';

import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css';
//import 'quill/dist/quill.core.css'
//import 'quill/dist/quill.snow.css'
//import 'quill/dist/quill.bubble.css'
import qs from 'qs';

//复制到粘贴板插件
import VueClipboard from 'vue-clipboard2'

axios.defaults.baseURL = 'http://dbettkk.top:8000/myapp/register'
//axios请求拦截
axios.interceptors.request.use(config => {
  console.log (config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$qs = qs;
Vue.prototype.$API = 'http://dbettkk.top:8000/myapp'

Vue.use(ElementUI);
Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(mavonEditor);
//Vue.use(VueQuillEditor, /* { default global options } */)

Vue.use(VueClipboard)

Vue.config.productionTip = false

const store =new Vuex.Store({
  state:{
    token:''
  },
  mutations:{
    exit(state){
      state.token=''
    },
    login(state,new_token){
      state.token=new_token
    }
  }
})

new Vue({
  store:store,
  render: h => h(App),
  router,
}).$mount('#app')

