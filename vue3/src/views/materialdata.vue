<template>
    <div class="card" style="margin-bottom: 5px;">
        <el-table :data="imgtabledata" stripe style="width: 66%;">
            <el-table-column label="图片">
                <template #default="scope">
                    <img :src="'http://127.0.0.1:8000/'+scope.row.img_url" alt="Image" style="max-width: 80px; max-height: 80px;">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="danger" icon="Delete" circle @click="deletedata(scope.row)"></el-button>
                </template>
            </el-table-column>
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
            axios.get("http://127.0.0.1:8000/getimages").then((res) => {
                console.log(res.data);
                if (res.data && res.data.images) {
                    this.allImgData = res.data.images;
                    this.total = res.data.images.length;
                    this.updateTableData(); // 更新当前页要显示的数据
                } else {
                    ElMessage.error('获取数据格式错误，请检查后端接口');
                }
            }).catch(error => {
                ElMessage.error('获取数据失败，请稍后重试');
                console.error(error);
            });
        },
        deletedata(row) {
            console.log(row);
            axios.post('http://127.0.0.1:8000/deleteimg/', row).then(res => {
                const index = this.allImgData.findIndex(item => item.id === row.id);
                if (index!== -1) {
                    this.allImgData.splice(index, 1);
                    this.total = this.allImgData.length;
                    this.updateTableData(); // 更新当前页要显示的数据
                }
                ElMessage.success('删除成功!');
            }).catch(error => {
                ElMessage.error('删除失败，请稍后重试');
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
            this.imgtabledata = this.allImgData.slice(start, end);
        }
    }
};
</script>