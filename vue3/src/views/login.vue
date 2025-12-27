<template>
    <div class="login-container">
        <div class="login-column"> 
            <div style="margin: 10vh 16vh 25px 16vh;transition:all 3s ease;" >
                <el-image style="width: 200px;height: 200px;border-radius: 10px;" src="/logo.png" fit="fill"></el-image>
            </div>
            <div class="login-box">
                <div>
                    <el-form ref="formRef" :model="formdata" :rules="rules">
                    <el-form-item  prop="account" class="aligned-form-item">
                        <el-input class="login-input" prefix-icon="User"  v-model="formdata.account" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item  prop="password" class="aligned-form-item">
                        <el-input class="login-input" type="password" show-password prefix-icon="Lock"  v-model="formdata.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    </el-form>
                    <div style="margin-left: 80px;margin-top: 10px;">
                        <el-radio-group v-model="radio1" class="ml-4">
                            <el-radio value="manager" size="large">管理员</el-radio>
                            <el-radio value="user" size="large">用户</el-radio>
                        </el-radio-group>
                    </div>
                    
                    <div style="display: flex;margin-top: 20px;">
                        <div style="margin-left: 65px;">
                            <el-button class="button" @click="login">登 录</el-button>
                        </div>
                        <div style="margin-left: 65px;">
                            <el-button class="button" @click="register">注 册</el-button>
                        </div>
                    </div>
                    <div style="text-align: left;margin-top: 40px;">
                        <el-link href="/main/home" type="primary">-游客访问</el-link>
                    </div>        
                </div>          
            </div>  
        </div>
    </div>
</template>

<script>
import logo from "@/assets/logo.png";
import { reactive, ref } from 'vue';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from "element-plus";
import { useUserStore } from '@/store/userStore'; // 引入 Pinia 存储

export default {
    data() {
        return {
            formdata: {
                "account": null,
                "password": null,
            },
            userdata: null,
            radio1: null,
            rules: {
                account: [
                    { required: true, message: '请输入账号!', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码!', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            axios.get("http://127.0.0.1:8000/user").then((res) => {
                this.userdata = res.data;
                console.log(this.userdata);
            });
        },
        login() {
            this.$refs.formRef.validate((valid) => {
                const userStore = useUserStore(); // 获取 Pinia 存储实例
                if (valid) {
                    if (this.radio1 === 'manager') {
                        if (this.formdata.account === "admin" && this.formdata.password === "123") {
                            router.push("/manager/home");
                        } else {
                            ElMessage.error("账号或密码错误！");
                        }
                    } else {
                        let foundUser = null;
                        for (let item of this.userdata) {
                            if (this.formdata.account === item.account && this.formdata.password === item.password) {
                                foundUser = item;
                                break;
                            }
                        }
                        if (!foundUser) {
                            console.log("账号或密码错误！(◜◔。◔◝)");
                            ElMessage.error('账号或密码错误，请重新输入！(◜◔。◔◝)');
                        } else {
                            ElMessage.success('登录成功！');
                            userStore.setUser(foundUser); // 将用户数据存储到 Pinia 中
                            router.push('/main/home'); // 假设用户登录后跳转到用户主页
                        }
                    }
                } else {
                    console.log('表单验证失败');
                }
            });
        },
        register() {
            router.push('/register');
        },
    }
};
</script>

<style scoped>
.login-container{
    height: 100vh;
    overflow: hidden;
    background-image: url("@/assets/bimg.jpg");
    background-size: 100%;
    background-position:-1px -12px;
}
.login-column{
    background-color: rgb(244, 234, 234,0.8);
    width: 30%;
    height: 100%;
    right: 0;
    position: absolute;
    align-items: center;
}
.login-box{
    margin: 0 auto;
    width: 400px;
    height: 400px;
    background-color: white;
    padding: 6px;
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .12);
}
.login-input{
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
    margin: 6% auto;
}

/* 调整错误提示信息的样式 */
.aligned-form-item .el-form-item__error {
    padding: 0; 
    margin-top: 2px; 
    text-align: left; 
}
</style>