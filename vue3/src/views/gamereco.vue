<template>
    <div style="display: flex;">
        <div style="flex: 1;">
            <div style="justify-content: space-between;margin: 20px 5px;padding:0 0 0 15px;border-left: 10px solid #f9f907;display: flex;align-items: center;">
                <el-text tag="b" style="color: #333;font-family:'Microsoft YaHei';font-size: 20px">
                    游我推荐
                </el-text>
                <el-button type="success" style="margin-right: 10px;" @click="postblog">
                    <el-icon><EditPen /></el-icon>我要发帖
                </el-button>
            </div>
            <div class="card" style="height: 707.55px; position: relative;">
                <div v-if="displayblog">
                        <div v-for="item in displayblog" :key="item.id">
                        <div  @click="gohorseshow('/main/detail?id=' + item.id, item)" style="cursor: pointer; padding: 15px;display: flex;justify-content: space-between;flex: 1;border-bottom: 1px dotted #f9f907;">
                            <div>
                                <el-text style="font-size: 17px;font-family:'Microsoft YaHei';color: #333;">{{ item.title }}</el-text>
                                <div style="color: #888; display: flex;margin-top: 7px;font-size: 14px;align-items: center;font-family:'Microsoft YaHei'">
                                    <el-icon><User/></el-icon>
                                    <span style="margin-left: 5px;">{{ item.name }}</span>
                                </div>
                                <div style="color: #888; display: flex;margin-top: 5px;font-size: 14px;font-family:'Microsoft YaHei';align-items: center;">
                                    <el-icon><Timer /></el-icon>
                                    <span style="margin-left: 5px;">{{ formatTime(item.last_edit_time) }}</span>
                                </div>
                                <div style=" display: flex;margin-top: 3px;">
                                    <div style="display: flex; color: #888;font-size: 14px;align-items: center;">
                                        <el-icon><View /></el-icon>
                                        <span style="margin-left: 3px;">{{ item.view }}</span>
                                    </div>
                                    <div style="margin-left: 10px; display: flex; color: #888;font-size: 14px;align-items: center;">
                                        <el-icon><Star /></el-icon>
                                        <span style="margin-left: 3px;">{{ item.collection }}</span>
                                    </div>
                                    <div style="margin-left: 20px; display: flex; color: #888;font-size: 14px;align-items: center;">
                                        <el-tag effect="plain">{{ item.type }}</el-tag>
                                    </div>
                                </div>
                            </div>
                            <div v-if="item.img" style="display: flex;align-items: center;">
                                <el-image 
                                    :src="'http://127.0.0.1:8000/'+item.img" 
                                    style="width: 250px;object-fit: cover;"
                                    @click="showImagePreview('http://127.0.0.1:8000/'+item.img)"
                                ></el-image>
                            </div>
                        </div>
                    </div>
                    <div style="position: absolute; bottom: 0; width: 100%; padding: 10px; box-sizing: border-box;">
                        <el-pagination :current-page="pagenum1" :page-size="3"  style="margin-top: 10px;" background layout="total, prev, pager, next" :total="total" @update:current-page="onCurrentPageChange1" />
                    </div>
                </div>
                <div v-else>
                    <div style="height: 500px;" v-loading="load" element-loading-text="加载中" element-loading-background="rgb(10,154,243 ,0.1)">
                    </div>    
                </div>
            </div>
        </div>
        <div style="width: 200px;height: 100px;">
            <div class="card" style="width: 130px;">
                <el-statistic title="已发布推荐" :value="total" >
                <template #prefix>
                    <el-icon style="vertical-align: -0.125em">
                    <Position />
                    </el-icon>
                </template>
                </el-statistic>
            </div>
        </div>
        <el-image-viewer
            v-if="showViewer"
            :url-list="[previewImageUrl]"
            @close="showViewer = false"
        ></el-image-viewer>
    </div>
</template>

<script>
import { dayjs } from 'element-plus';
import moment from 'moment';
import { reactive } from 'vue';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 引入 ElMessage
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useUserStore } from '@/store/userStore';
export default {
    data() {
        return {
            load:true,
            inputdata: '',
            user: null,
            all: null,
            blog: null,
            displayblog: null,
            total: null,
            pagenum1: 1,
            pagesize: 3,
            showViewer: false,
            previewImageUrl: '',
            loading: false // 添加loading状态
        };
    },
    created() {
        const userStore = useUserStore();
        this.user = userStore.user;
        this.getData();
        if (!userStore.isLoggedIn) {
            ElMessage.warning("还未登录，仅可预览界面！");
        }
    },
    mounted() {

    },
    methods: {
        getData() {
            this.loading = true; // 请求开始，设置loading为true
            // 先请求走马灯数据
            axios.get("http://127.0.0.1:8000/getblogs").then((res) => {
                this.all = res.data.blogs;
                const filteredBlogs = this.all.filter(blog => blog.forblog === '游我推荐');

                // 按照最后编辑时间排序，取最新的六个博客
                const sortedByTime = filteredBlogs.sort((a, b) => {
                    const dateA = new Date(this.parseTime(a.last_edit_time));
                    const dateB = new Date(this.parseTime(b.last_edit_time));
                    return dateB - dateA;
                });
                this.blog = sortedByTime
                console.log(this.blog)
                this.total = this.blog.length
                this.updateTableData1()
                this.load = false;
            }).catch(error => {
                ElMessage.error('获取数据失败，请稍后重试');
                console.error(error);
            });
        },
        formatTime(timeStr) {
            const parts = timeStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日 (\d{1,2}):(\d{1,2})/);
            if (parts) {
                return `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')} ${parts[4].padStart(2, '0')}:${parts[5].padStart(2, '0')}`;
            }
            return '时间格式错误';
        },
        onCurrentPageChange1(newPage) {
            this.pagenum1 = newPage;
            this.updateTableData1();
        },
        updateTableData1() {
            const start = (this.pagenum1 - 1) * this.pagesize;
            const end = start + this.pagesize;
            this.displayblog = this.blog.slice(start, end);
        },
        parseTime(timeStr) {
            const parts = timeStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日 (\d{1,2}):(\d{1,2})/);
            if (parts) {
                const year = parseInt(parts[1], 10);
                const month = parseInt(parts[2], 10) - 1; // Date对象的月份是从0开始的
                const day = parseInt(parts[3], 10);
                const hour = parseInt(parts[4], 10);
                const minute = parseInt(parts[5], 10);
                return new Date(year, month, day, hour, minute).getTime();
            }
            return null;
        },
        showImagePreview(url) {
            this.previewImageUrl = url;
            this.showViewer = true;
        },        
        gohorseshow(url,item){
            if(item.title){
                this.$router.push(url)
            }
            else{
                ElMessage.warning("本走马灯暂无信息！")
            }
        },
        postblog() {
            const userStore = useUserStore();
            if (!userStore.isLoggedIn) {
                ElMessage.error("还未登录，不能发帖哦！");
            } else {
                this.$router.push('/main/postblog')
            }
        }
    }
};
</script>

<style scoped>

</style>    