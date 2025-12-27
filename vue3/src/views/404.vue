<template>
    <div style="text-align: center;">
        <div style="align-items: center;display: flex;flex-direction: column;">
            <img src="@/assets/logo.png" style="margin-top: 20px; width: 100px;height: 100px;border-radius: 2px;" alt="">
            <img src="../assets/very_sorry.png">        
        </div>

        <div>
            <el-button type="primary" style="width: 150px;height: 80px;" @click="router.push('/main/home')">返回主页</el-button>
        </div>      
    </div>

</template>

<script setup>
import router from '@/router/index';
</script>
