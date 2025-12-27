<template>
    <div>
        <div style="flex: 1;cursor:pointer">
            <el-carousel 
                v-if="horse && horse.length > 0"
                :interval="3000" 
                arrow="always" 
                :motion-blur="true"
                height="550px"
                style="margin-top: 2px;margin-bottom: 10px;"
            >
                <el-carousel-item v-for="item in horse" :key="item.id">
                    <!-- 添加懒加载属性 -->
                    <img @click="gohorseshow('/main/detail?id=' + item.id, item)" :src="'http://127.0.0.1:8000/'+item.img" loading="lazy" style="height: 100%;width: 100%;object-fit: cover;" alt="/暂无图片.png">
                </el-carousel-item>
            </el-carousel>
        </div>
        <div style="display: flex;grid-gap: 30px;">
            <div style="flex: 1;flex-direction: column;">
                <!-- 最新攻略 -->
                <div>
                    <div style="margin-bottom: 1px; padding-bottom: 6px; margin-left: 5px; color: #15c804; border-bottom: 3px solid #15c804; display: flex; justify-content: space-between; align-items: flex-end;">
                        <span>最 <strong style="font-size: 24px;">新</strong> 攻略</span>
                        <el-link style="align-self: flex-end; color: #15c804;" @click="mores">更多攻略>></el-link>
                    </div>
                    <div style="margin-left: 10px;">
                        <el-row :gutter="20">
                            <!-- 骨架屏 -->
                            <template v-if="!newblogs">
                                <el-col style="margin-bottom: 10px; display: flex; align-items: center; padding: 6px;" :span="12" v-for="i in 6" :key="i">
                                    <el-skeleton :rows="5" animated />
                                </el-col>
                            </template>
                            <!-- 实际内容 -->
                            <el-col style="margin-bottom: 10px; display: flex; align-items: center; padding: 6px;" :span="12" v-for="item in newblogs" :key="item.id">
                                <div   @click="gohorseshow('/main/detail?id=' + item.id, item)" class="card" style="display: flex;align-items: center;cursor: pointer;">
                                    <!-- 添加懒加载属性 -->
                                    <img :src="'http://127.0.0.1:8000/'+item.img" loading="lazy" style="border-radius: 30px; width: 200px;height: 200px;object-fit: cover;" alt="/暂无图片.png">
                                    <div style="margin-left: 15px;  flex-direction: column;">
                                        <div style="font-size: 24px;color: #0a9af3;margin-bottom: 10px;">{{ item.title }}</div>
                                        <el-tag type="primary" >{{ item.type }}</el-tag>
                                        <div style="display: flex; align-items: center; margin-top: 20px;">
                                            <el-icon><UserFilled /></el-icon>
                                            <span style="margin-left: 5px;">{{ item.name }}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; margin-top: 5px;">
                                            <el-icon><Timer /></el-icon>
                                            <span style="margin-left: 5px;">{{ formatTime(item.last_edit_time) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <!-- 超燃翻唱 -->
                <div>
                    <div style="margin-bottom: 1px; padding-bottom: 6px; margin-left: 5px; color: #9d0eec ; border-bottom: 3px solid #9d0eec; display: flex; justify-content: space-between; align-items: flex-end;">
                        <span>超 <strong style="font-size: 24px;">燃</strong> 翻唱</span>
                        <el-link style="align-self: flex-end; color: #9d0eec;" @click="moresong">更多来音>></el-link>
                    </div>
                    <el-row :gutter="20">
                        <!-- 骨架屏 -->
                        <template v-if="!songs">
                            <el-col style=" margin-bottom: 10px; display: flex; align-items: center; " :span="21" v-for="i in 2" :key="i">
                                <el-skeleton :rows="5" animated />
                            </el-col>
                        </template>
                        <!-- 实际内容 -->
                        <el-col style=" margin-bottom: 10px; display: flex; align-items: center; " :span="21" v-for="item in songs" :key="item.id">
                            <div @click="gohorseshow('/main/detail?id=' + item.id, item)" style="cursor: pointer; padding: 5px;display: flex;align-items: center;margin-left: 40px;border-bottom: 1px dotted #9d0eec;">
                                <img :src="'http://127.0.0.1:8000/'+item.img" loading="lazy" style=" border-radius: 30px; width: 400px;height: 200px;object-fit: cover;" alt="/暂无图片.png">
                                <div style="margin-left: 15px;  flex-direction: column;">
                                    <div style="padding-bottom: 10px; font-size: 24px;color: #9d0eec;margin-bottom: 5px;">{{ item.title }}</div>
                                    <div style="display: flex;align-items: center;">
                                        <el-tag type="primary" round > 游我来音 </el-tag>                                        
                                        <span style="margin-left: 10px;"><el-icon><View /></el-icon> {{ item.view }}</span>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 40px;">
                                        <el-icon><UserFilled /></el-icon>
                                        <span style="margin-left: 5px;">{{ item.name }}</span>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 5px;">
                                        <el-icon><Timer /></el-icon>
                                        <span style="margin-left: 5px;">{{ formatTime(item.last_edit_time) }}</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!-- 站长推荐 -->
                <div>
                    <div style="margin-bottom: 1px; padding-bottom: 6px; margin-left: 5px; color: #e6f609; border-bottom: 3px solid #e6f609; display: flex; justify-content: space-between; align-items: flex-end;">
                        <span>站长 <strong style="font-size: 24px;">推荐</strong> </span>
                    </div>
                    <div style="margin-left: 10px;">
                        <el-row :gutter="20">
                            <!-- 骨架屏 -->
                            <template v-if="!recomblog">
                                <el-col style="margin-bottom: 10px; display: flex; align-items: center; padding: 6px;" :span="12" v-for="i in 4" :key="i">
                                    <el-skeleton :rows="5" animated />
                                </el-col>
                            </template>
                            <!-- 实际内容 -->
                            <el-col style="margin-bottom: 10px; display: flex; align-items: center; padding: 6px;" :span="12" v-for="item in recomblog" :key="item.id">
                                <div @click="gohorseshow('/main/detail?id=' + item.id, item)" class="card" style="cursor: pointer; display: flex;align-items: center;">
                                    <!-- 添加懒加载属性 -->
                                    <img :src="'http://127.0.0.1:8000/'+item.img" loading="lazy" style="border-radius: 30px; width: 200px;height: 200px;object-fit: cover;" alt="/暂无图片.png">
                                    <div style="margin-left: 15px;  flex-direction: column;">
                                        <div style="font-size: 24px;color: #0a9af3;margin-bottom: 10px;">{{ item.title }}</div>
                                        <el-tag type="primary" round>{{ item.type }}</el-tag>
                                        <div style="display: flex; align-items: center; margin-top: 20px;">
                                            <el-icon><UserFilled /></el-icon>
                                            <span style="margin-left: 5px;">{{ item.name }}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; margin-top: 5px;">
                                            <el-icon><Timer /></el-icon>
                                            <span style="margin-left: 5px;">{{ formatTime(item.last_edit_time) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div  style="width: 350px;">
                <div style="display: flex; flex-direction: column;">
                    <div style="margin-bottom: 10px;padding-bottom: 6px;margin-left: 5px;color: #e41111; border-bottom: 3px solid #e41111;">
                        论坛 <strong style="font-size: 24px;">热</strong> 帖
                    </div>
                    <template v-if="!hotblogs">
                            <el-skeleton :rows="8" animated />
                        </template>
                    <el-row :gutter="20">
                        <el-col :span="21" v-for="(item, index) in hotblogs" :key="item.id">
                            <div @click="gohorseshow('/main/detail?id=' + item.id, item)" style="padding: 5px; border-bottom: 1px dotted #e41111;">
                                <div style="display: flex;align-items: center;">
                                    <span :class="getNumberClass(index)">{{ index + 1 }}</span>
                                    <div style="margin-left: 8px;">
                                        <el-link style="font-size: 18px;color: #1e0202;">
                                        {{ item.title }}
                                        </el-link>
                                    </div>
                                </div>    
                                <div style="display: flex;">
                                    <div style="margin-left: 30px; display: flex;align-items: center; font-size: 13px; color: #888;">
                                        <el-icon><View /></el-icon> 
                                        <span style="margin-left: 5px;">{{ item.view }}</span>
                                    </div>
                                    <div style="margin-left: 30px; display: flex;align-items: center; font-size: 13px; color: #888;">
                                        <el-icon><Star /></el-icon> 
                                        <span style="margin-left: 5px;">{{ item.collection }}</span>
                                    </div>
                                    <div style="margin-left: 30px; display: flex;align-items: center; font-size: 13px; color: #888;">
                                        <el-icon><User /></el-icon> 
                                        <span style="margin-left: 5px;">{{ item.name }}</span>
                                    </div>
                                </div>  
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div style="display: flex; flex-direction: column;margin-top: 160px;">
                    <div style="margin-bottom: 10px;padding-bottom: 6px;margin-left: 5px;color: #1129f7; border-bottom: 3px solid #1129f7;">
                        论坛 <strong style="font-size: 24px;">活动</strong> 
                    </div>
                    <div class="card">
                        <template v-if="!hotblogs">
                            <el-skeleton :rows="8" animated />
                        </template>
                        <div v-for="item in this.activityDisplay" :key="item.id">
                            <div @click="gohorseshow('/main/detail?id=' + item.id, item)" style="margin-top: 5px; display: flex;justify-content: space-between; align-items: center;">
                                <el-link>{{ item.title }}</el-link>
                                <div style="margin-right: 6px;">{{ formatTime(item.last_edit_time) }}</div>
                            </div>
                        </div>
                        <el-pagination :current-page="pagenum1" :page-size="6" size="small" style="margin-top: 20px;" background layout="total, prev, pager, next" :total="act_total" @update:current-page="onCurrentPageChange1"
                        />
                    </div>
                </div>
                <div style="display: flex; flex-direction: column;margin-top: 160px;">
                    <div style="margin-bottom: 10px;padding-bottom: 6px;margin-left: 5px;color: #1129f7; border-bottom: 3px solid #1129f7;">
                        论坛 <strong style="font-size: 24px;">公告</strong> 
                    </div>
                    <div class="card">
                        <template v-if="!hotblogs">
                            <el-skeleton :rows="8" animated />
                        </template>
                        <div v-for="item in this.announcementDisplay" :key="item.id">
                            <div @click="gohorseshow('/main/detail?id=' + item.id, item)" style="margin-top: 5px;display: flex;justify-content: space-between; align-items: center;">
                                <el-link>{{ item.title }}</el-link>
                                <div style="margin-right: 6px;">{{ formatTime(item.last_edit_time) }}</div>
                            </div>
                        </div>
                        <el-pagination :current-page="pagenum2"  :page-size="6" size="small" style="margin-top: 20px;" background layout="total, prev, pager, next" :total="ann_total" @update:current-page="onCurrentPageChange2"
                        />
                    </div>
                </div>
            </div>  
        </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { reactive } from 'vue';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { UserFilled, Timer, View, User, Star } from '@element-plus/icons-vue'; // 引入图标

export default {
    data() {
        return {
            all: null,
            newblogs: null,
            hotblogs: null,
            activity: null,
            announcement: null,
            act_total: null,
            ann_total: null,
            songs: null,
            pagenum1: 1,
            pagenum2: 1,
            pagesize: 6,  // 定义每页显示数量
            activityDisplay: [], // 用于显示活动的当前页数据
            announcementDisplay: [], // 用于显示公告的当前页数据
            recomblog: null,
            horse: null,
            recomtotal:null
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            // 先请求走马灯数据
            axios.get("http://127.0.0.1:8000/getblogs").then((res) => {
                this.all = res.data.blogs;
                if (this.all) {
                    const filteredByForblog5 = this.all.filter(blog => blog.horse === 1);
                    this.horse = filteredByForblog5;

                    // 对其他数据请求添加延迟
                    setTimeout(() => {
                        const filteredByForblog6 = this.all.filter(blog => blog.recommend === 1);
                        this.recomblog = filteredByForblog6;
                        this.recomtotal = this.recomblog.length

                        // 筛选出 forblog 为 '游我攻略' 的博客
                        const filteredBlogs = this.all.filter(blog => blog.forblog === '游我攻略');

                        // 按照最后编辑时间排序，取最新的六个博客
                        const sortedByTime = filteredBlogs.sort((a, b) => {
                            const dateA = new Date(this.parseTime(a.last_edit_time));
                            const dateB = new Date(this.parseTime(b.last_edit_time));
                            return dateB - dateA;
                        });
                        this.newblogs = sortedByTime.slice(0, 6);

                        // 筛选出 forblog 不是 '公告' 或 '活动' 的博客
                        const filteredByForblog = this.all.filter(blog => blog.forblog!== '公告' && blog.forblog!== '活动');

                        // 按照 view 字段降序排序，取前8个博客
                        const sortedByView = filteredByForblog.sort((a, b) => b.view - a.view);
                        this.hotblogs = sortedByView.slice(0, 8);

                        const filteredByForblog2 = this.all.filter(blog => blog.forblog === '活动');
                        this.activity = filteredByForblog2;
                        this.act_total = filteredByForblog2.length;
                        this.updateTableData1();

                        const filteredByForblog3 = this.all.filter(blog => blog.forblog === '游我来音');
                        const sortedbysongs = filteredByForblog3.sort((a, b) => b.view - a.view);
                        this.songs = sortedbysongs.slice(0, 2);

                        const filteredByForblog4 = this.all.filter(blog => blog.forblog === '公告');
                        this.announcement = filteredByForblog4;
                        this.ann_total = filteredByForblog4.length;
                        this.updateTableData2();
                    }, 2000); 
                }
            }).catch(error => {
                ElMessage.error('获取数据失败，请稍后重试');
                console.error(error);
            });
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
        formatTime(timeStr) {
            const parts = timeStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日 (\d{1,2}):(\d{1,2})/);
            if (parts) {
                return `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')} ${parts[4].padStart(2, '0')}:${parts[5].padStart(2, '0')}`;
            }
            return '时间格式错误';
        },
        getNumberClass(index) {
            if (index === 0) {
                return 'circle-number number-1';
            } else if (index === 1) {
                return 'circle-number number-2';
            } else if (index === 2) {
                return 'circle-number number-3';
            } else {
                return 'normal-number';
            }
        },
        onCurrentPageChange1(newPage) {
            this.pagenum1 = newPage;
            this.updateTableData1();
        },
        updateTableData1() {
            const start = (this.pagenum1 - 1) * this.pagesize;
            const end = start + this.pagesize;
            this.activityDisplay = this.activity.slice(start, end);
        },
        onCurrentPageChange2(newPage) {
            this.pagenum2 = newPage;
            this.updateTableData2();
        },
        updateTableData2() {
            const start = (this.pagenum2 - 1) * this.pagesize;
            const end = start + this.pagesize;
            this.announcementDisplay = this.announcement.slice(start, end);
        },
        gohorseshow(url,item){
            if(item.title){
                this.$router.push(url)
            }
            else{
                ElMessage.warning("本走马灯暂无信息！")
            }
        },
        mores(){
            this.$router.push('/main/strategy/');
        },
        moresong(){
            this.$router.push('/main/song');
        }
    }
};
</script>

<style scoped>
.circle-number {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    color: white;
    font-size: 14px;
    margin-right: 5px;
}

.number-1 {
    background-color: #e41111;
}

.number-2 {
    background-color: #ff5252;
}

.number-3 {
    background-color: #ff8a80;
}

.normal-number {
    color: black;
    margin-right: 5px;
    margin-left: 8px;
}

/* 骨架屏样式 */
.skeleton-card {
    display: flex;
    align-items: center;
}

.skeleton-img {
    width: 200px;
    height: 200px;
    background-color: #f0f0f0;
    border-radius: 30px;
    margin-right: 15px;
}

.skeleton-content {
    display: flex;
    flex-direction: column;
}

.skeleton-title {
    width: 200px;
    height: 24px;
    background-color: #f0f0f0;
    margin-bottom: 10px;
}

.skeleton-tag {
    width: 80px;
    height: 20px;
    background-color: #f0f0f0;
    margin-bottom: 20px;
}

.skeleton-info {
    width: 150px;
    height: 16px;
    background-color: #f0f0f0;
    margin-bottom: 5px;
}
</style>