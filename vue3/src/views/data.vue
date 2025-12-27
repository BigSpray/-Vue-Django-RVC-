<template>
<div class="card" style="margin-bottom: 5px;">
    <el-input style="width: 250px;margin-right: 10px;" v-model="inputdata" prefix-icon="Search" placeholder="请输入要查询的内容"></el-input>
    <el-button type="primary">查 询</el-button>
</div>
<div class="card" style="margin-bottom: 5px;">
    <el-table :data="data.tabledata" stripe>
        <el-table-column label="日期" prop="date"></el-table-column>\
        <el-table-column label="用户名字" prop="username"></el-table-column>
        <el-table-column label="内容" prop="content"></el-table-column>
    </el-table>
    <div style="margin-top: 15px">
        <el-pagination 
        v-model:current-page="data.pagenum"
        v-model:page-size="data.pagesize"
        :page-sizes="[5,10,15,20]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        />
    </div>
</div>
</template>

<script setup>
import { reactive } from 'vue';

const data = reactive({
    name:null,
    inputdata:null,
    pagenum:1,
    pagesize:10,
    total:66,
    tabledata:[
        {id:1, date:"2025-1-22", username:"鼠鼠", content:"欢迎来到本期缇宝攻略"},
        {id:2, date:"2025-1-25", username:"鼠鼠", content:"欢迎来到本期瑕蝶实机演示"},
        {id:3, date:"2025-1-27", username:"鼠鼠", content:"欢迎来到本期瑕蝶攻略"},
    ]
})
</script>