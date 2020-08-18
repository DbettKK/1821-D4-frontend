import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/user/login.vue'
import Register from './components/user/register.vue'
import FindPassword from './components/user/FindPassword.vue'
import Home from './components/user/home.vue'
import Welcome from './components/user/welcome.vue'
import Ue from './components/edit/ue.vue'
import Recently from './components/user/recently.vue'
import Myproduction from './components/user/myproduction.vue'
import Favorite from './components/user/favorite.vue'
import Trashbin from './components/user/trashbin.vue'
import ShowUserInfo from './components/user/showUserInfo.vue'
import TeamSpace from './components/user/TeamSpace.vue'
import Teammember from './components/user/Teammember.vue'
import Preview from './components/edit/preview.vue'
import message_favorite from './components/user/message_favorite.vue'
import message_comments from './components/user/message_comments.vue'
import message_team from './components/user/message_team.vue'
import message_share from './components/user/message_share.vue'
import N404 from './components/NotFoundComponent.vue'
import checkpassword from './components/user/chgpw_fir.vue'
import newpassword from './components/user/chgpw_sec.vue'
import changepassword from './components/user/chgpw_thr.vue'

Vue.use(Router)
/*
const teamSpace =
{
  template:'<div>Teamspace {{$route.params.id }} </div>'
}
*/
const router = new Router({
  routes: [
    {
      path: '/Login', 
      component: Login,
      name: 'Login',
      meta:{title:'金刚石文档编辑器'}
    },
    {
      path: '/Register', 
      component: Register,
      name: 'Register',
      meta:{title:'用户注册'}
    },
    {
      path:'/FindPassword',
      component:FindPassword,
      name:'FindPassword',
      meta:{title:'找回密码'}
    },
    /*
    {
      path:'/TeamSpace',
      component:TeamSpace,
      name:'Teamspace',
      meta:{title:'团队空间'}

    },

    */
    {
      path: '/', 
      component: Home,
      name: 'Home',
      meta:{title:'金刚石文档编辑器'},
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: Welcome,meta:{title:'金刚石文档编辑器'}},
        {path: '/recently', component: Recently,meta:{title:'金刚石文档编辑器'}},
        {path: '/myproduction', component: Myproduction,meta:{title:'金刚石文档编辑器'}},
        {path: '/favorite', component: Favorite,meta:{title:'金刚石文档编辑器'}},
        {path: '/trashbin', component: Trashbin,meta:{title:'金刚石文档编辑器'}},
        // {path: '/changeInfo', component: User, name:'ChangeInfo',meta:{title:'金刚石文档编辑器:个人信息'}},
         //name:'Teamspace',meta:{title:'团队空间'} }
        { path:'/TeamSpace/:id', component:TeamSpace, name:'Teamspace',meta:{title:'团队空间'} },
        { path:'/Teammember/:id',component:Teammember,name:'Teammember',meta:{title:'团队成员'}},
        {path: '/checkpassword', component: checkpassword, name:'checkpassword', meta:{title:'金刚石文档编辑器:验证密码'}},
        {path: '/newpassword', component: newpassword, name:'newpassword', meta:{title:'金刚石文档编辑器:新密码'}},
        {path: '/changepassword', component: changepassword, name:'changepassword', meta:{title:'金刚石文档编辑器:修改密码'}},
        {path: '/showUserInfo', component: ShowUserInfo, name:'ShowUserInfo',meta:{title:'金刚石文档编辑器:个人信息'}},
        //{ path:'/TeamSpace', component:TeamSpace,  name:'Teamspace',meta:{title:'团队空间'} }
        {path: '/message_favorite', component: message_favorite, name:'message_favorite', meta:{title:'收藏消息'}},
        {path: '/message_comments', component: message_comments, name:'message_comments', meta:{title:'评论消息'}},
        {path: '/message_team', component: message_team, name:'message_team', meta:{title:'团队消息'}},
        {path: '/message_share', component: message_share, name:'message_share', meta:{title:'分享消息'}},
      ]
    },
    /*{
      path: '/changeInfo', 
      component: User, 
      name:'ChangeInfo',
      meta:{title:'金刚石文档编辑器'}
    },*/
    {
      path:'/Edit/:id',
      component:Ue,
      name:'Edit',
      meta:{title:'无'}
    },
    {
      path:'/preview/:mode',
      component:Preview,
      name:'Preview',
      meta:{title:'模板预览'}
    },
    {
      path: '/404',
      name: '404',
      component:N404,
      meta:{title: '乌乌，页面丢失了',},
    },
    {
      path: '*',    // 此处需特别注意至于最底部
      redirect: '/404'
    }
  ],
  mode:"history"
})

//路由导航守卫
/*router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/Register' || to.path === '/welcome' || to.path === '/') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})*/

export default router
