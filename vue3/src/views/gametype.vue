<template>
    <div style="display: flex;">
    <div style="margin-left: 30px;width: 500px;">
      <div class="card" style="width: 250px; height: 90px;">
        <div><el-text size="small" type="info">展示已有类型，可添加or删除</el-text></div>
        <el-button style="margin-top: 15px;" @click="searchall" type="primary">查询</el-button>
        <el-button style="margin-top: 15px;" @click="addtype" type="success">新增</el-button>
        <el-button style="margin-top: 15px;" @click="deletetype" type="danger">删除</el-button>
      </div>
      <el-card style="max-width: 480px">
        <template #header>
          <div class="card-header">
            <span>已有游戏类型</span>
          </div>
        </template>
        <p v-for="item in types" :key="item.id" :item="item"  class="text item">{{ item.type}}</p>
      </el-card>
    </div>
    </div>
    <el-dialog v-model="dialogVisible" title="添加游戏类型">
              <el-form :model="newType" label-width="80px">
                  <el-form-item label="游戏类型">
                      <el-input v-model="newType.type"></el-input>
                  </el-form-item>
              </el-form>
              <template #footer>
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="addlast">确定</el-button>
              </template>
      </el-dialog>
      <el-dialog v-model="dialogVisible2" title="删除游戏类型">
                      <el-select
                          v-model="selectvalue"
                          placeholder="选择要删除的游戏类型"
                          size="large"
                          style="width: 200px"
                      >
                          <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          />
                      </el-select>
              <template #footer>
                  <el-button @click="dialogVisible2 = false">取消</el-button>
                  <el-button type="primary" @click="deletelast">确定</el-button>
              </template>
      </el-dialog>
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
        options:null
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
      getData(){
        axios.get("http://127.0.0.1:8000/user/").then((res) =>{
          console.log(res.data)
          // this.user = res.data
          this.usertotal = res.data.length
        })
        axios.get("http://127.0.0.1:8000/getblogs/").then((res) =>{
          console.log(res.data)
          // this.user = res.data
          this.blogtotal = res.data.blogs.length
        })
        axios.get("http://127.0.0.1:8000/getblogtypes/").then((res) =>{
          console.log(res.data)
          // this.user = res.data
          this.user = res.data.blogtypes
          this.options = this.user.map(item => ({
            label: item.type,
            value: item.type
          }));
        })
        console.log(this.options)
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