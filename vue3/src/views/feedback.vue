<template>
    <div class="card" style="flex: 1;height: 82vh;margin-top: 10px;">
        <div>
            <el-tag size="large" style="font-size: 20px;">反馈中心</el-tag>
        </div>
        <div style="align-items: center;margin-top: 50px;display: flex;">
            <el-text>反馈：</el-text>
            <el-input v-model="inputdata" style="width: 200px;margin-left: 10px;" type="textarea"></el-input>
        </div>
        <el-button @click="submit" type="success" style="margin-left: 120px;margin-top: 20px;">发布</el-button>
        
    </div>
</template>

<script>
import { dayjs } from 'element-plus';
import moment from 'moment';
import { reactive} from 'vue';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 引入 ElMessage
import '@wangeditor/editor/dist/css/style.css'
import {onBeforeUnmount,ref,shallowRef} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import { useUserStore } from '@/store/userStore';
export default {
    data() {
    return {
      inputdata: '',
      user: null
    };
  },
  created() {
    const userStore = useUserStore();
    this.user = userStore.user;
    if (!userStore.isLoggedIn) {
      ElMessage.warning("还未登录！将进行默认反馈！");
    }
  },
  mounted(){

  },
  methods: {
    submit(){
        const userStore = useUserStore();
        if (!userStore.isLoggedIn) {
            axios.post('http://127.0.0.1:8000/addfeedback/', {content:this.inputdata,name:'游客'})
            .then(res => {
                ElMessage.success('反馈成功!');
            })
            .catch(error => {
                ElMessage.error('反馈失败');
                console.error(error);
            });
        }
        else{
            axios.post('http://127.0.0.1:8000/addfeedback/', {content:this.inputdata,name:this.user.name})
            .then(res => {
                ElMessage.success('反馈成功!');
            })
            .catch(error => {
                ElMessage.error('反馈失败');
                console.error(error);
            });
        }
    },
  }
};
</script>

<style scoped>

</style>