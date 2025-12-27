<template>
    <div class="card" style="margin-bottom: 5px;">
        <el-table :data="imgtabledata" stripe style="width: 66%;">
            <el-table-column label="用户名" prop="name"></el-table-column>
            <el-table-column label="内容" prop="content"></el-table-column>
            <el-table-column label="时间" prop="formattedTime"></el-table-column>
        </el-table>
        <div style="margin-top: 15px">
            <el-pagination 
                v-model:current-page="pagenum"
                v-model:page-size="pagesize"
                :page-sizes="[4, 8]"
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
import { ElMessage } from 'element-plus'; 
import moment from'moment'; // 引入 moment 库

export default {
    data() {
        return {
            inputdata: '',
            pagenum: 1,
            pagesize: 4,
            total: 0,
            allImgData: [], // 存储完整的图片数据组
            imgtabledata: [], // 存储当前页要显示的图片数据
        };
    },
    created() {
        this.getimgData();
    },
    methods: {
        getimgData() {
            axios.get("http://127.0.0.1:8000/getfeedbacks").then((res) => {
                console.log(res.data);
                if (res.data && res.data.feeds) {
                    this.allImgData = res.data.feeds;
                    this.total = res.data.feeds.length;
                    this.updateTableData(); // 更新当前页要显示的数据
                } else {
                    ElMessage.error('获取数据格式错误，请检查后端接口');
                }
            }).catch(error => {
                ElMessage.error('获取数据失败，请稍后重试');
                console.error(error);
            });
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
            const dataSlice = this.allImgData.slice(start, end);
            // 对每一项数据的时间进行格式化
            this.imgtabledata = dataSlice.map(item => {
                const formattedTime = moment(item.last_edit_time).format('YYYY-MM-DD HH:mm:ss');
                return {...item, formattedTime };
            });
        },
        formatCommentTime(time) {
            return moment(time).format('YYYY-MM-DD HH:mm:ss');
        },
    }
};
</script>