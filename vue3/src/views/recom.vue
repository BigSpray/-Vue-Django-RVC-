<template>
    <div style="display: flex;">
        <div class="card" style="margin-bottom: 5px;width: 50%;">
            <el-tag>已有的推荐</el-tag>
            <el-table :data="tabledata" stripe>
                <el-table-column label="标题" prop="title"></el-table-column>
                <el-table-column label="封面">
                    <template #default="scope">
                        <img :src="'http://127.0.0.1:8000/'+scope.row.img" alt="Image" style="max-width: 200px; max-height: 200px;">
                    </template>
                </el-table-column>
                <el-table-column label="移除">
                    <template #default="scope">
                        <el-button type="danger" icon="Close" circle @click="deletehorse(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 15px">
                <el-pagination 
                    v-model:current-page="pagenum"
                    v-model:page-size="pagesize"
                    background
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                    @update:current-page="onCurrentPageChange"
                />
            </div>
        </div>
        <div class="card" style="margin-bottom: 5px;flex: 1;">
            <el-tag>添加推荐</el-tag>
            <el-table :data="tabledata1" stripe>
                <el-table-column label="标题" prop="title"></el-table-column>e
                <el-table-column label="封面">
                    <template #default="scope">
                        <img :src="'http://127.0.0.1:8000/'+scope.row.img" alt="/暂无图片.png" style="max-width: 200px; max-height: 200px;">
                    </template>
                </el-table-column>
                <el-table-column label="添加">
                    <template #default="scope">
                        <el-button type="success" icon="Check" circle @click="addhorse(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 15px">
                <el-pagination 
                    v-model:current-page="pagenum1"
                    v-model:page-size="pagesize1"
                    background
                    layout="total, prev, pager, next, jumper"
                    :total="total1"
                    @update:current-page="onCurrentPageChange1"
                />
            </div>
        </div>
    </div>
</template>

<script>
import DOMPurify from 'dompurify';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus'; 
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, reactive, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
    components: { Editor, Toolbar },
    data() {
        return {
            dialogVisible:false,
            inputdata: '',
            pagenum: 1,
            pagesize: 4,
            total: 0,
            pagenum1: 1,
            pagesize1: 3,
            total1: 0,
            allData: [], // 存储完整的数据组
            tabledata: [], // 存储当前页要显示的数据
            tabledata1: [], // 存储当前页要显示的数据
            tabledatafir:null,
            tabledata1fir:null,
            pagenum2: 1,
            pagesize2: 4,
            total2: 0,
            allImgData: [], // 存储完整的图片数据组
            imgtabledata: [], // 存储当前页要显示的图片数据
        };
    },
    created() {
        this.getData();
    },
    methods: {
        onCreated(editor) {
            this.editor = Object.seal(editor); 
        },
        mounted() {
            setTimeout(() => {
                this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>';
            }, 1500);
        },
        getData() {
            axios.get("http://127.0.0.1:8000/getblogs")
              .then((res) => {
                    console.log(res.data);
                    this.allData = res.data.blogs;
                    this.tabledatafir =   this.allData.filter(blog => blog.recommend === 1);
                    this.tabledata1fir =   this.allData.filter(blog => blog.recommend === 0);
                    this.updateTableData(); // 更新当前页要显示的数据
                    this.updateTableData1(); // 更新当前页要显示的数据
                    this.total = this.tabledatafir.length;
                    this.total1 = this.tabledata1fir.length;
                    ElMessage.success('获取数据成功！');
                })
              .catch(error => {
                    ElMessage.error('获取数据失败，请稍后重试');
                    console.error(error);
                });
        },
        onCurrentPageChange(newPage) {
            this.pagenum = newPage;
            this.updateTableData();
        },
        updateTableData() {
            const start = (this.pagenum - 1) * this.pagesize;
            const end = start + this.pagesize;
            this.tabledata = this.tabledatafir.slice(start, end);
        },
        onCurrentPageChange1(newPage) {
            this.pagenum1 = newPage;
            this.updateTableData1();
        },
        updateTableData1() {
            const start = (this.pagenum1 - 1) * this.pagesize1;
            const end = start + this.pagesize1;
            this.tabledata1 = this.tabledata1fir.slice(start, end);
        },
        deletehorse(row) {
            axios.post('http://127.0.0.1:8000/change_recommend_status/', { id: row.id, recommend: 0 })
              .then((res) => {
                    if (res.data.success) {
                        const index = this.tabledatafir.findIndex(item => item.id === row.id);
                        if (index!== -1) {
                            this.tabledatafir.splice(index, 1);
                        }
                        this.tabledata1fir.push(row);
                        this.updateTableData();
                        this.updateTableData1();
                        this.total = this.tabledatafir.length;
                        this.total1 = this.tabledata1fir.length;
                        ElMessage.success('移除成功！');
                    } else {
                        ElMessage.error('移除失败，请稍后重试！');
                    }
                })
              .catch((error) => {
                    ElMessage.error('移除失败，请稍后重试！');
                    console.error(error);
                });
        },
        addhorse(row) {
            axios.post('http://127.0.0.1:8000/change_recommend_status/', { id: row.id, recommend: 1 })
            .then((res) => {
                    if (res.data.success) {
                        // 从右侧列表（可添加列表）中移除该记录
                        const index = this.tabledata1fir.findIndex(item => item.id === row.id);
                        if (index!== -1) {
                            this.tabledata1fir.splice(index, 1);
                        }
                        // 将该记录添加到左侧列表（已有走马灯列表）
                        this.tabledatafir.push(row);
                        // 更新分页数据
                        this.updateTableData();
                        this.updateTableData1();
                        this.total = this.tabledatafir.length;
                        this.total1 = this.tabledata1fir.length;
                        ElMessage.success('添加成功！');
                    } else {
                        ElMessage.error('添加失败，请稍后重试！');
                    }
                })
            .catch((error) => {
                    ElMessage.error('添加失败，请稍后重试！');
                    console.error(error);
                });
        },
        onCurrentPageChange2(newPage) {
            this.pagenum2 = newPage;
            this.updateTableData2();
        },
        updateTableData2() {
            const start = (this.pagenum2 - 1) * this.pagesize2;
            const end = start + this.pagesize2;
            this.imgtabledata = this.allImgData.slice(start, end);
        }
    }
};
</script>

<style scoped>

</style>