<template>
    <div>
      <!-- 顶部 -->
        <div style="height: 60px;background-color: #0a9af3; display: flex;align-items: center;">
            <div style="display: flex;align-items: center;padding-left: 16px;">
              <img src="@/assets/logo2.png" style="width: 60px;height: 60px;border-radius: 2px;" alt="">
              <span style="font-size: 20px; color: white;" >后台管理系统</span> 
            </div>
            <div style="flex: 1;"></div>
            <div style="display: flex;align-items: center;width: 150px;">
              <img style="width: 30px;height: 30px;border-radius: 50%;object-fit: cover;" src="../assets/me.png" alt="">
              <span style="color: white; margin-left: 6px;">管理员大大</span>
            </div>
        </div>
        <!-- 左侧导航 -->
        <div style="display:flex;">
            <div style="width: 200px;box-shadow: 1px; border-right: 1px solid #ddd; min-height:calc(100vh - 60px)" >
                <el-menu router default-active style="border: 0;">
                    <el-menu-item index="/manager/home"><el-icon><House /></el-icon>系统首页</el-menu-item>
                    <el-menu-item index="/manager/showdata"><el-icon><DataAnalysis /></el-icon>数据统计</el-menu-item>
                    <el-sub-menu index="1">
                      <template #title>
                        <el-icon><User /></el-icon>
                        <span>用户管理</span>
                      </template>
                      <el-menu-item index="/manager/userdata">用户基本信息</el-menu-item>
                    </el-sub-menu> 
                    <el-sub-menu index="2">
                      <template #title>
                        <el-icon><Files /></el-icon>
                        <span>素材管理</span>
                      </template>
                      <el-menu-item index="/manager/upload_material">上传素材</el-menu-item>
                      <el-menu-item index="/manager/materialdata">图片素材信息</el-menu-item>
                      <el-menu-item index="/manager/materialdata2">音频素材信息</el-menu-item>
                    </el-sub-menu> 
                    <el-sub-menu index="3">
                      <template #title>
                        <el-icon><Notebook /></el-icon>
                        <span>帖子管理</span>
                      </template>
                      <el-menu-item index="/manager/blog">帖子信息</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="4">
                      <template #title>
                        <el-icon><Discount /></el-icon>
                        <span>论坛管理</span>
                      </template>
                      <el-menu-item index="/manager/gametype">游戏类型信息</el-menu-item>
                      <el-menu-item index="/manager/horse">走马灯管理</el-menu-item>
                      <el-menu-item index="/manager/recom">站长推荐管理</el-menu-item>
                      <el-menu-item index="/manager/announce">公告活动管理</el-menu-item>
                      <el-menu-item index="/manager/manfeed">反馈中心</el-menu-item>
                    </el-sub-menu>
                    <el-menu-item index="/manager/RVC"><el-icon><Headset /></el-icon>RVC语音助手</el-menu-item>  
                    <el-menu-item index="/main/home"><el-icon><SwitchButton /></el-icon>退出后台管理</el-menu-item>
                  </el-menu>
            </div>
          <!-- 右侧区 -->
            <div style="flex:1;width:0;background-color: aliceblue;">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive,ref } from 'vue';
import router from '@/router';
import axios from 'axios';
// let a = ref("1")
export default{
  data(){
    return{
      user: null,
    };
  },
  created(){
    ElMessage.success("欢迎回家~管理员大大！(*´∀`)~♥")
    // this.getData()
  },
  methods:{
    // getData(){
    //   axios.get("http://127.0.0.1:8000/usershowdata/"+1).then((res) =>{
    //     console.log(res.data)
    //     this.user = res.data
    //   })
    // }
  },
};
</script>

<style scoped>
/* .el-menu .is-active{
  background-color: #e6ecf7 !important;
} */
</style>