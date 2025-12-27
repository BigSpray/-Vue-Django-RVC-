<template>
    <div class="register-container">
        <div class="register-column"> 
            <div style="margin: 7vh 16vh 25px 16vh;transition:all 3s ease;" >
                <el-image style="width: 200px;height: 200px;border-radius: 10px;" src="/logo.png" fit="fill"></el-image>
            </div>
            <div class="register-box">
                <div>
                    <el-form ref="formRef" :model="formdata" :rules="rules">
                    <el-form-item  prop="name" class="aligned-form-item">
                        <el-input class="register-input" prefix-icon="Avatar"  v-model="formdata.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item  prop="account" class="aligned-form-item">
                        <el-input class="register-input" prefix-icon="User"  v-model="formdata.account" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item  prop="password" class="aligned-form-item">
                        <el-input
                        class="register-input"
                        prefix-icon="Lock"
                        v-model="formdata.password"
                        placeholder="请输入密码"
                        show-password
                        @click="togglePasswordVisibility"
                        ></el-input>
                    </el-form-item>
                    </el-form>   
                </div>      
                <div style="margin:6% 40%;">
                    <el-button class="button" @click="register">注 册</el-button>
                </div>  
                <div style="text-align: left;margin-top: 70px;">
                        <a id="a1" style="color: blue; text-decoration: none;"  href="/login">返回登录</a>
                    </div>           
            </div>  
        </div>
    </div>
</template>

<script>
import logo from "@/assets/logo.png"
import { reactive,ref } from 'vue';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from "element-plus";
// let a = ref("1")
export default{
  data(){
    return{
        formdata:{
            "name":null,
            "account": null,
            "password":null,
        },
        passwordVisible: false,
        userdata: null,
        rules: {
                name: [
                    { required: true, message: '请输入用户名!', trigger: 'blur' }
                ],
                account: [
                    { required: true, message: '请输入账号!', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码!', trigger: 'blur' }
                ]
            }
    };
  },
   created(){
    this.getData()
   },
  methods:{

    getData(){
        axios.get("http://127.0.0.1:8000/user").then((res) =>{
        this.userdata = res.data
        console.log(this.userdata)
      })
    },
    togglePasswordVisibility() {
        console.log("点击了！")
      this.passwordVisible = !this.passwordVisible;
    },
    register(){
         this.$refs.formRef.validate((valid)=>{
            let flag = true
            if (valid) {
                for( let item of this.userdata){
                    if(this.formdata.name == item.name){
                        flag = false
                    }
                }
                if(!flag){
                console.log("用户名重复！(◜◔。◔◝)")
                // 登录失败，手动设置错误信息
                ElMessage.error('抱歉！用户名重复了，请大侠再换一个！(◔⊖◔)つ');
                }else{
                    axios.post('http://127.0.0.1:8000/register/',this.formdata).then(res =>{
                    ElMessage({message:"恭喜少侠，注册成功~", type: 'success', duration: 3000});
                    setTimeout(() => {
                    router.push('/login'); 
                  }, 3000);
                    }).catch(error => {
                    ElMessage.error('注册失败，请稍后重试');
                    console.error(error);
                });   
                }         
            } else {
                console.log('表单验证失败');
            }
        })
    },
    }
};
</script>

<style scoped>
.register-container{
    height: 100vh;
    overflow: hidden;
    background-image: url("@/assets/bimg.jpg");
    background-size: 100%;
    background-position:-1px -12px;
}
.register-column{
    background-color: rgb(244, 234, 234,0.8);
    width: 30%;
    height: 100%;
    right: 0;
    position: absolute;
    align-items: center;
}
.register-box{
    margin: 0 auto;
    width: 450px;
    height: 450px;
    background-color: white;
    padding: 6px;
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .12);
}
.register-input{
    width: 260px;
    height: 46px;
    margin: 5% auto;
}
.button{
    background-color:#3498db ;
    width: 100px;
    height: 40px;
    border: none;
    color: #fff;
    font-size: 16px;
    transition: width 0.5s linear,height 0.5s linear;
}
.button:hover{
    background-color: #7ff41a;
    width: 100px;
    height: 40px;
}
/* 自定义表单项样式 */
.aligned-form-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 260px; 
    margin: 2% auto;
}

/* 调整错误提示信息的样式 */
.aligned-form-item .el-form-item__error {
    padding: 0; 
    margin-top: 2px; 
    text-align: left; 
}
</style>