<template>
  <div style="display: flex;">
    <div style="margin-left: 60px;" >  
    <div style="display: flex;">
      <div style="margin-left: 100px; width: 110px;height: 80px;" class="card">
            <el-statistic style="font-size: 50px !important;" title="已注册用户" :value="usertotal">
              <template #prefix>
                <el-icon style="vertical-align: -0.125em">
                  <UserFilled />
                </el-icon>
              </template>
            </el-statistic>
      </div>
      <div style="margin-left: 60px; width: 120px;height: 80px;" class="card">
            <el-statistic title="已发布帖子" :value="blogtotal" >
              <template #prefix>
                <el-icon style="vertical-align: -0.125em">
                  <List />
                </el-icon>
              </template>
            </el-statistic>
      </div>
      <div style="margin-left: 60px; width: 120px;height: 80px;" class="card">
            <el-statistic title="已发布评论" :value="commenttotal" >
              <template #prefix>
                <el-icon style="vertical-align: -0.125em">
                  <Comment />
                </el-icon>
              </template>
            </el-statistic>
      </div>
    </div>
    <div class="card" style="width: 290px;height: 160px;margin-left:110px ;">
      <div>
        <div style="display: inline-flex; font-size: 25px;">
          <el-icon style="margin-top: 5px;margin-right: 10px;" :size="20">
            <Calendar />
          </el-icon>
          论坛已运行 {{ runningTimeDisplay }}
        </div>
      </div>
      <div class="countdown-footer" style="font-size: 30px;text-align: center;color: #0a9bf4;">{{ startTime.format('YYYY-MM-DD') }}</div>
    </div>
    <img src="@/assets/welcome.png" style=" height: 60vh;z-index: -1;"  alt="">
  </div>
  </div>
</template>




<script>
import { reactive,ref } from 'vue';
import router from '@/router';
import axios from 'axios';
import dayjs from 'dayjs';
// let a = ref("1")
export default{
  data(){
    return{
      startTime : dayjs('2025-02-01 00:00:00'),
      runningTime: 0,
      runningTimeDisplay: '',
      usertotal: null,
      blogtotal:null,
      user: null,
      types:null,
      dialogVisible: false,
      dialogVisible2: false,
      newType:{type:null},
      selectvalue:null,
      options:null,
      commenttotal:null
    };
  },
  created(){
    // 首次加载页面时更新运行时间
    this.updateRunningTime();
    // 每秒更新一次运行时间
    this.timer = setInterval(() => {
      this.updateRunningTime();
    }, 1000);
    this.getData()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods:{
    getData() {
        axios.get("http://127.0.0.1:8000/user/").then((res) => {
            console.log(res.data);
            this.usertotal = res.data.length;
        }).catch((error) => {
            console.error('获取用户数据失败:', error);
        });

        axios.get("http://127.0.0.1:8000/getblogs/").then((res) => {
            console.log(res.data);
            this.blogtotal = res.data.blogs.length;
        }).catch((error) => {
            console.error('获取博客数据失败:', error);
        });

        axios.get("http://127.0.0.1:8000/getblogtypes/").then((res) => {
            console.log(res.data);
            this.user = res.data.blogtypes;
            this.options = this.user.map(item => ({
                label: item.type,
                value: item.type
            }));
        }).catch((error) => {
            console.error('获取博客类型数据失败:', error);
        });

        // 这里如果不需要指定博客 id，可以不传 id 参数，确保后端处理逻辑正确
        axios.post("http://127.0.0.1:8000/getcomments/", {}).then((res) => {
            if (res.data && res.data.comments) {
                this.commenttotal = res.data.comments.length;
            } else {
                console.error('获取评论数据格式错误:', res.data);
            }
        }).catch((error) => {
            console.error('获取评论数据失败:', error);
        });
    },
    updateRunningTime() {
      this.runningTime = dayjs().diff(this.startTime, 'milliseconds');
      const days = Math.floor(this.runningTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((this.runningTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((this.runningTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((this.runningTime % (1000 * 60)) / 1000);

      this.runningTimeDisplay = `${days} 天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    searchall(){
      axios.get("http://127.0.0.1:8000/getblogtypes/").then((res) =>{
        console.log(res.data)
        // this.user = res.data
        this.user = res.data.blogtypes
        this.types = res.data.blogtypes
      })
    },
    addtype() {
      console.log('点击了添加用户按钮');
      this.dialogVisible = true;
    },
    deletetype() {
      console.log('点击了添加用户按钮');
      this.dialogVisible2 = true;
    },
    addlast() {
            let flag = true
            for( let item of this.user){
                if(this.newType.type == item.type){
                    flag = false
                }
            }
            if(!flag){
                console.log("游戏类型重复！(◜◔。◔◝)")
                // 登录失败，手动设置错误信息
                ElMessage.error('游戏类型重复！(◜◔。◔◝)');
            }
            else{
                axios.post('http://127.0.0.1:8000/addtype/', this.newType).then(res => {
                    // 添加成功后，重新获取数据
                    this.searchall();
                    // 清空表单
                    this.newType={type:null}
                    // 关闭对话框
                    this.dialogVisible = false;
                    ElMessage.success('添加游戏类型成功');  
                }).catch(error => {
                    ElMessage.error('添加游戏类型失败！');
                    console.error(error);
                });
            }                
    },
    deletelast() {
        console.log(this.selectvalue)
            // 发送删除请求，将当前行数据作为请求体
            axios.post('http://127.0.0.1:8000/deletetype/', this.selectvalue).then(res => {
                // 删除成功后，从表格数据中移除当前行
                this.searchall();
                ElMessage.success('删除成功!');
                this.dialogVisible2 =false
            }).catch(error => {
                ElMessage.error('删除失败，请稍后重试');
                console.error(error);
            });
        },
  },
};
// const data = reactive({
//   a:1,
//   b:2,
//   games:["崩坏：星穹铁道","王者荣耀","三角洲行动"],
//   getthings:[],
// })

// const createdata = () =>{
//   axios.get("http://127.0.0.1:8000/api/user/get").then(res=>{
//     this.getthings = res.data;
//   }).catch(error =>{
//     console.log("出错了");
//   });
//   console.log(getthings);
// }
</script>

<style scoped>
.countdown-footer {
  margin-top: 8px;
}
</style>