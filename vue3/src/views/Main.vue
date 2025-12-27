<template>
  <div>
    <!-- 顶部 -->
    <div style="height: 60px; background-color: #0a9af3; display: flex; align-items: center;">
      <div style="display: flex; align-items: center; margin-left: 30px;cursor: pointer;" @click="gohome">
        <img src="@/assets/logo2.png" style="width: 60px; height: 60px; border-radius: 2px;" alt="">
        <span style="font-size: 25px; color: white;">游我论坛</span>
      </div>
      <div style="width: 700px; margin-left: 30px;">
        <el-menu
          router
          class="el-menu-demo"
          mode="horizontal"
          background-color="#0a9af3"
          text-color="white"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/main/home" style="font-size: 20px;">论坛首页</el-menu-item>
          <el-menu-item index="/main/strategy" style="font-size: 20px;">游我攻略</el-menu-item>
          <el-menu-item index="/main/song" style="font-size: 20px;">游我来音</el-menu-item>
          <el-menu-item index="/main/gamereco" style="font-size: 20px;">游我推荐</el-menu-item>
          <el-menu-item index="/main/gamechat" style="font-size: 20px;">游我杂谈</el-menu-item>
        </el-menu>
      </div>
      <div style="flex: 1;">
        <el-input
          style="width: 250px; margin-left: 10px; border-radius: 10px;"
          v-model="inputdata"
          prefix-icon="Search"
          placeholder="请输入要搜索的内容"
        ></el-input>
        <el-button round style="margin-left: 5px;" type="success" @click="search">搜 索</el-button>
      </div>
      <div style="margin-right: 100px;display: flex;align-items: center;">
        <div v-if="!user ||!user.name">
          <el-button type="success" @click="handleLogin" round>登 录</el-button>
          <el-button type="warning" @click="handleRegister" round>注 册</el-button>
          <el-tooltip
            class="box-item"
            effect="light"
            content="站长联系方式wx: XXXX"
            placement="top-start"
          >
            <el-button type="primary" round @click="this.$router.push('/main/feedback')">反馈</el-button>
          </el-tooltip>
        </div>
        <div v-else>
          <div style="display: flex;margin-left: 150px;">
            <!-- 绑定导入的图片路径 -->
            <el-avatar :size="40" :src="user.img" />
            <el-dropdown style="margin-left: 6px;">
              <span style="font-size: 15px; color: white; margin-top: 10px;">
                {{ user.name }}
                <el-icon>
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="gopersonal">个人中心</el-dropdown-item>
                  <el-dropdown-item @click="gomyblogs">我的帖子</el-dropdown-item>
                  <el-dropdown-item @click="gofeedback">我要反馈</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

          </div>
        </div>
        <el-tooltip
            class="box-item"
            effect="light"
            content="RVC语音助手展示关闭/打开"
            placement="top-start"
          >
            <el-button type="success" round @click="toggleVoiceAssistant" style="cursor: pointer;margin-left: 10px;">
              <el-icon><View/></el-icon>
            </el-button>
          </el-tooltip>
      </div>
    </div>
    <div style="display: flex;">
      <!-- 左侧 -->
      <div style="width: 200px; background-color: aliceblue;"></div>
      <div style="flex: 1;">
        <router-view />
      </div>
      <!-- 右侧 -->
      <div style="width: 200px; background-color: aliceblue; position: relative;">
        <div v-if="isVoiceAssistantVisible"
          style="position: sticky; top: 50%; transform: translateY(-50%); display: flex; justify-content: center;">
          <el-tooltip
            class="box-item"
            effect="light"
            content="我是RVC语音助手！"
            placement="top-end"
          >
            <img
              :src="yourImageSrc"
              style="width: 120px; height: 100px; object-fit: cover; cursor: pointer;"
              @click="showTooltip =!showTooltip"
            />
          </el-tooltip>
          <div style="margin-left: 45px; min-width: 100px;" v-if="showTooltip" class="tooltip">
            <div
              v-for="(item, index) in tooltipText"
              :key="index"
              @click="playAudio(index)"
              style="cursor: pointer;border-bottom: 1px dotted whitesmoke;padding: 3px;"
            >
              {{ item.content }}
            </div>
          </div>
        </div>
        <el-backtop :right="100" :bottom="100" />
      </div>
    </div>
    <div style="height: 78px; background-color: #0a9af3; display: flex; align-items: center;">
      <div style="margin: auto; display: flex; align-items: center;">
        <el-image src="/src/assets/logo2.png" style="width: 50px; height: 50px;" alt="/fail.png"></el-image>
        <el-divider direction="vertical" />
        <el-text style="color: white;">Copyright © 2025 by Spray.</el-text>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import router from '@/router';
import axios from 'axios';
// 导入图片
import userAvatar from '@/assets/me.png';
import logo from '@/assets/logo2.png';
import { useUserStore } from '@/store/userStore';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      inputdata: '',
      user: null,
      yourImageSrc: '/public/liuying.png', // 替换为实际的图片路径
      tooltipText: [],
      showTooltip: false,
      isVoiceAssistantVisible: true // 新增状态变量
    };
  },
  created() {
    const userStore = useUserStore();
    this.user = userStore.user;
    if (!userStore.isLoggedIn) {
      ElMessage.warning("还未登录，仅可预览界面！");
    }
    this.getData();
  },
  methods: {
    getData() {
      axios.get("http://127.0.0.1:8000/airvc_get_all")
      .then((res) => {
          console.log('获取到的数据:', res.data);
          this.tooltipText = res.data.airvcs;
        })
      .catch(error => {
          ElMessage.error('获取数据失败，请稍后重试');
          console.error(error);
        });
    },
    search() {
      // 搜索逻辑
      console.log('搜索内容:', this.inputdata);
      const title = this.inputdata;
      this.inputdata = '';
      this.$router.push(`/main/searchblog?title=${title}`);
    },
    handleLogin() {
      this.$router.push('/login');
    },
    handleRegister() {
      this.$router.push('/register');
    },
    handleLogout() {
      const userStore = useUserStore();
      // 在这里添加退出登录的逻辑，比如清除用户数据等
      userStore.logout();
      location.reload();
    },
    gohome(){
      this.$router.push('/main/home');
    },
    gopersonal() {
      this.$router.push('/main/personal');
    },
    gomyblogs() {
      this.$router.push('/main/myblogs');
    },
    gofeedback() {
      this.$router.push('/main/feedback');
    },
    playAudio(index) {
      const item = this.tooltipText[index];
      console.log(item)
      if (item && item.audio_url) {
        const audioSrc = item.audio_url;
        console.log('音频路径:', audioSrc);
        const audioPlayer = new Audio(audioSrc);
        audioPlayer.play();
      } else {
        console.error('音频路径不存在:', item);
      }
    },
    toggleVoiceAssistant() {
      this.isVoiceAssistantVisible =!this.isVoiceAssistantVisible; // 切换语音助手可见性
    }
  }
};
</script>

<style scoped>
/* 去除所有元素聚焦时的默认边框 */
*:focus {
  outline: none;
}
.tooltip {
  position: absolute;
  background-color: #0a9af3; /* 修改此处控制透明度，这里设置为 0.3 */
  color: white;
  padding: 5px;
  border-radius: 5px;
  top: 110px;
  left: 0;
}
</style>