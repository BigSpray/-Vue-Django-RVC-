<template>
    <div class="card" style="flex: 1;height: 82vh;margin-top: 20px;">
        <div>
            <el-avatar :size="50" :src="user.img" />
        </div>
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
      ElMessage.warning("还未登录，仅可预览界面！");
    }
  },
  mounted(){

  },
  methods: {
        
  }
};
</script>

<style scoped>

</style>