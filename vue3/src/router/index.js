import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/404.vue'
import Manager from '@/views/Manager.vue'
import Login from '@/views/login.vue'
import Register from '@/views/register.vue'
import showdata from '@/views/showdata.vue'
import userdata from '@/views/userdata.vue'
import upload_material from '@/views/upload_material.vue'
import materialdata from '@/views/materialdata.vue'
import materialdata2 from '@/views/materialdata2.vue'
import blog from '@/views/blog.vue'
import Main from '@/views/Main.vue'
import Mainhome from '@/views/mainhome.vue'
import Song from '@/views/song.vue'
import Gametype from '@/views/gametype.vue'
import Abouthome from '@/views/abouthome.vue'
import Recom from '@/views/recom.vue'
import Personal from '@/views/personal.vue'
import Detail from '@/views/detail.vue'
import Strategy from '@/views/strategy.vue'
import Postblog from '@/views/postblog.vue'
import Gamereco from '@/views/gamereco.vue'
import Gamechat from '@/views/gamechat.vue'
import Myblogs from '@/views/myblogs.vue'
import Feedback from '@/views/feedback.vue'
import Manfeed from '@/views/manfeed.vue'
import Searchblog from '@/views/searchblog.vue'
import Announcement from '@/views/Announcement.vue'
import RVC from '@/views/RVC.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/main/home'
    },
    {
      path: '/login',
      name:'login',
      meta: {title:'登录界面'},
      component:Login
    },
    {
      path: '/register',
      name:'register',
      meta: {title:'注册界面'},
      component:Register
    },
    {
      path: '/manager',
      name: 'manager',
      children:[{
        path:'home',
        name:'home',
        meta: {title:'管理主页'},
        component:HomeView,
      },
      {
        path: 'showdata',
        name: 'showdata',
        meta: {title:'数据展示'},
        component: showdata
      },
      {
        path: 'userdata',
        name: 'userdata',
        meta: {title:'用户数据展示'},
        component: userdata
      },
      {
        path: 'upload_material',
        name:'upload_material',
        meta: {title:'素材上传'},
        component: upload_material
      },
      {
        path: 'materialdata',
        name:'materialdata',
        meta: {title:'图片素材信息'},
        component: materialdata
      },
      {
        path: 'materialdata2',
        name:'materialdata2',
        meta: {title:'音频素材信息'},
        component: materialdata2
      },
      {
        path: 'blog',
        name:'blog',
        meta: {title:'贴子信息'},
        component: blog
      },
      {
        path: 'gametype',
        name:'gametype',
        meta: {title:'游戏类型信息'},
        component: Gametype
      },
      {
        path: 'horse',
        name:'horse',
        meta: {title:'走马灯管理'},
        component: Abouthome
      },
      {
        path: 'recom',
        name:'recom',
        meta: {title:'站长推荐管理'},
        component: Recom
      },
      {
        path: 'announce',
        name:'announce',
        meta: {title:'公告活动管理'},
        component: Announcement
      },
      {
        path: 'manfeed',
        name:'manfeed',
        meta: {title:'反馈中心'},
        component: Manfeed
      },
      {
        path: 'RVC',
        name:'RVC',
        meta: {title:'语音助手'},
        component: RVC
      }
    ],
      component: Manager,
      meta: {title:'管理主页'}
    },   
    {
      path: '/404',
      name:'NotFound',
      meta: {title:'404找不到页面'},
      component: NotFound,
    },
    {
      path: '/main',
      name: 'Main',
      children:[
        {
          path: 'home',
          name:'mainhome',
          meta: {title:'论坛首页'},
          component: Mainhome
        },
        {
          path: 'strategy',
          name:'strategy',
          meta: {title:'游我攻略'},
          component: Strategy
        },
        {
          path: 'postblog',
          name:'postblog',
          meta: {title:'发帖'},
          component: Postblog
        },
        {
          path: 'song',
          name:'song',
          meta: {title:'游我来音'},
          component: Song
        },
        {
          path: 'gamereco',
          name:'gamereco',
          meta: {title:'游我推荐'},
          component: Gamereco
        },
        {
          path: 'gamechat',
          name:'gamechat',
          meta: {title:'游我杂谈'},
          component: Gamechat
        },
        {
          path: 'personal',
          name:'personal',
          meta: {title:'个人中心'},
          component: Personal
        },
        {
          path: 'myblogs',
          name:'myblogs',
          meta: {title:'我的帖子'},
          component: Myblogs
        },
        {
          path: 'feedback',
          name:'feedback',
          meta: {title:'反馈中心'},
          component: Feedback
        },
        {
          path: 'detail',
          name:'detail',
          meta: {title:'展示信息'},
          component: Detail
        },
        {
          path: 'searchblog',
          name:'searchblog',
          meta: {title:'搜索帖子'},
          component: Searchblog
        },
      ],
      component:Main,
      meta: {title:'游我论坛'},
    },
    // 添加通配符路由，当路由未匹配时重定向到 404 页面
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ],
})

router.beforeEach((to, from, next) => {
  // 优先使用当前路由的标题
  let title = to.meta.title;
  // 如果当前路由没有标题，使用父路由的标题
  if (!title && to.matched.length > 0) {
    title = to.matched[to.matched.length - 1].meta.title;
  }
  if (title) {
    document.title = title;
  }
  next();
});

export default router;    