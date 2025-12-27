<template>
    <div class="card" style="margin-bottom: 5px;">
        <el-input style="width: 250px;margin-right: 10px;" v-model="inputdata" prefix-icon="Search" placeholder="请输入要查询的用户名"></el-input>
        <el-button type="primary" @click="searchUsers">查 询</el-button>
        <el-button type="warning" @click="resetSearch">重 置</el-button>
        <!-- 添加用户按钮 -->
        <el-button type="success" @click="openDialog">添加用户</el-button>
        <!-- 添加用户对话框 -->
        <el-dialog v-model="dialogVisible" title="添加用户">
            <el-form :model="newUser" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="newUser.name"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="newUser.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="newUser.password" show-password></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addUser">确定</el-button>
            </template>
        </el-dialog>
    </div>
    <div class="card" style="margin-bottom: 5px;">
        <el-table :data="tabledata" stripe v-loading="loading">
            <el-table-column label="用户名" prop="name"></el-table-column>
            <el-table-column label="头像" prop="img">
                <template #default="scope">
                    <el-avatar
                        :src="scope.row.img"
                    />
                </template>
            </el-table-column>
            <el-table-column label="账号" prop="account"></el-table-column>
            <el-table-column label="密码" prop="password"></el-table-column>
            <el-table-column label="操作">
                <!-- 正确使用作用域插槽，接收 scope 对象 -->
                <template #default="scope">
                    <!-- 传递当前行数据给 deletedata 方法 -->
                    <el-button type="danger" icon="Delete" circle @click="deletedata(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 15px">
            <el-pagination 
                v-model:current-page="pagenum"
                v-model:page-size="pagesize"
                :page-sizes="[5, 10]"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @update:current-page="onCurrentPageChange"
                @update:page-size="onPageSizeChange"
            />
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 引入 ElMessage

export default {
    data() {
        return {
            inputdata: '',
            pagenum: 1,
            pagesize: 10,
            total: 0,
            allData: [], // 存储完整的数据组
            tabledata: [], // 存储当前页要显示的数据
            newUser: {
                name: '',
                account: '',
                password: ''
            },
            dialogVisible: false,
            passwordVisible: false,
            loading: false
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.loading = true;
            axios.get("http://127.0.0.1:8000/user").then((res) => {
                console.log(res.data);
                this.allData = res.data;
                this.total = res.data.length;
                this.updateTableData(); // 更新当前页要显示的数据
                this.loading = false;
            }).catch(error => {
                ElMessage.error('获取数据失败，请稍后重试');
                console.error(error);
                this.loading = false;
            });
        },
        searchUsers() {
            const name = this.inputdata;
            if (name) {
                this.allData = this.allData.filter(item => item.name.includes(name));
            } else {
                this.getData(); // 如果关键词为空，重新获取所有数据
            }
            this.pagenum = 1; // 搜索时重置页码为 1
            this.total = this.allData.length;
            this.updateTableData();
        },
        resetSearch() {
            this.inputdata = '';
            this.pagenum = 1; // 重置时重置页码为 1
            this.getData();
        },
        deletedata(row) {
            console.log(row)
            // 发送删除请求，将当前行数据作为请求体
            axios.post('http://127.0.0.1:8000/delete/', row).then(res => {
                // 删除成功后，从 allData 中移除当前行
                const index = this.allData.findIndex(item => item.name === row.name);
                if (index!== -1) {
                    this.allData.splice(index, 1);
                    this.total = this.allData.length; // 更新总记录数
                    this.updateTableData(); // 更新当前页要显示的数据
                }
                ElMessage.success('删除成功!');
            }).catch(error => {
                ElMessage.error('删除失败，请稍后重试');
                console.error(error);
            });
        },
        openDialog() {
            console.log('点击了添加用户按钮');
            this.dialogVisible = true;
        },
        addUser() {
            let flag = true
            for( let item of this.allData){
                if(this.newUser.name == item.name){
                    flag = false
                }
            }
            if(!flag){
                console.log("用户名重复！(◜◔。◔◝)")
                // 登录失败，手动设置错误信息
                ElMessage.error('抱歉！用户名重复了，请大侠再换一个！(◔⊖◔)つ');
            }else if(this.newUser.name==null||this.newUser.account==null||this.newUser.password==null){
                ElMessage.error('用户名/账号/密码为空！');
            }
            else{
                axios.post('http://127.0.0.1:8000/register/', this.newUser).then(res => {
                    // 添加成功后，重新获取数据
                    this.getData();
                    // 清空表单
                    this.newUser = {
                        name: '',
                        account: '',
                        password: ''
                    };
                    // 关闭对话框
                    this.dialogVisible = false;
                    ElMessage.success('添加用户成功');  
                }).catch(error => {
                    ElMessage.error('添加用户失败，字段不能为空！');
                    console.error(error);
                });
            }                
        },
        onCurrentPageChange(newPage) {
            this.pagenum = newPage;
            this.updateTableData();
        },
        onPageSizeChange(newSize) {
            this.pagesize = newSize;
            this.pagenum = 1; // 切换每页记录数时重置页码为 1
            this.updateTableData();
        },
        updateTableData() {
            const start = (this.pagenum - 1) * this.pagesize;
            const end = start + this.pagesize;
            this.tabledata = this.allData.slice(start, end);
        }
    }
};
</script>

<style>
body {
  margin: 0;
}
.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>