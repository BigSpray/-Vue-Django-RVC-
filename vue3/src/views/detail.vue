<template>
    <div style="display: flex;">
        <div style="flex: 1;">
            <div v-loading.fullscreen.lock="load" element-loading-text="加载中" element-loading-background="rgb(10,154,243 ,0.1)">
            </div>
            <div v-if="detailblog&&detailblog.video">
                <div style="align-items: center;" class="carddetail">
                    <div style="display: flex;align-items: center;font-size: 30px;">
                        <el-icon><VideoPlay /></el-icon>
                        <span style="margin-left: 6px;" >{{ detailblog.title }}</span>
                    </div>
                    <div style="display: flex;">
                        <div style="margin-left: 30px; display: flex;align-items: center; font-size: 16px; color: #888;">
                            <el-icon><View /></el-icon> 
                            <span style="margin-left: 3px;">{{ detailblog.view }}</span>
                        </div>
                        <div style="margin-left: 30px; display: flex;align-items: center; font-size: 16px; color: #888;">
                            <el-icon><Timer /></el-icon>
                            <span style="margin-left: 3px;">{{ detailblog.last_edit_time }}</span>
                        </div>
                    </div>
                </div>
                <video 
                :src="'http://127.0.0.1:8000/'+detailblog.video" 
                style="width: 100%;height: 100%;"
                controls
                >
                </video>
                <div style="align-items: center;" class="carddetail">
                    <div size="large" v-html="detailblog.content"></div>
                    <div style="margin-top: 6px; display: flex; align-items: center;">
                        <div style="display: flex; align-items: center;" >
                            <el-tag round >{{ detailblog.type }}</el-tag>
                            <el-tag round style="margin-left: 5px;">{{ detailblog.forblog }}</el-tag>
                        </div>
                        <!-- 添加收藏图标 -->
                        <el-icon size="30" @click="toggleFavorite" style="margin-left: 20px; cursor: pointer;">
                            <template  v-if="isFavorite"><StarFilled /></template>
                            <template v-else><Star /></template>
                        </el-icon>
                        <!-- 显示收藏数 -->
                        <span style="margin-left: 5px;">{{  this.favoriteCount }}</span>
                    </div>
                </div>            
            </div>
            <div v-else-if="detailblog">
                <div style="align-items: center;min-height: 650px;" class="carddetail">
                    <div style="display: flex;align-items: center;font-size: 30px;margin-top: 15px;">
                        <el-text  tag="b" style="margin-left: 6px;font-size: 30px;color: #333;" >{{ detailblog.title }}</el-text>
                    </div>
                    <div style="display: flex;margin-left: 6px;margin-top: 10px;align-items: center;">
                        <div style=" display: flex;align-items: center; font-size: 16px; color: #888;">
                            <el-icon><View /></el-icon> 
                            <span style="margin-left: 3px;">{{ detailblog.view }}</span>
                        </div>
                        <div style="margin-left: 30px; display: flex;align-items: center; font-size: 16px; color: #888;">
                            <el-icon><Timer /></el-icon>
                            <span style="margin-left: 3px;">{{ detailblog.last_edit_time }}</span>
                        </div>
                        <div style="display: flex;align-items: center;">
                            <!-- 添加收藏图标 -->
                            <el-icon size="30" @click="toggleFavorite" style="margin-left: 20px; cursor: pointer;">
                                <template  v-if="isFavorite"><StarFilled /></template>
                                <template v-else><Star /></template>
                            </el-icon>
                            <!-- 显示收藏数 -->
                            <span style="margin-left: 5px;">{{  this.favoriteCount }}</span>
                        </div>
                        <el-tag style="margin-left: 20px;">{{ detailblog.type }}</el-tag>
                    </div>
                    <div style="margin-left: 20px;" v-html="detailblog.content"></div>
                </div>
            </div>
                <!-- 评论输入框 -->
                <div class="carddetail">
                    <div><el-text size="large" tag="b"><el-icon><Comment /></el-icon> 评论</el-text></div>
                    <el-input
                        type="textarea"
                        v-model="commentInput"
                        placeholder="请输入评论内容"
                        style="width: 60%;margin: 6px;"
                    ></el-input>
                    <el-button style="margin-left: 10px;" @click="submitComment" type="success">发表评论</el-button>
                    <!-- 评论列表 -->
                    <div style="margin-top: 20px;">
                        <div v-for="comment in comments" :key="comment.id" style=" margin-bottom: 10px;align-items: center;">
                            <div v-if="(comment.father_id==0)" style="display: flex;align-items: center;">
                                <div style="width: 100px; text-align: center;display: flex; flex-direction: column; align-items: center;">
                                    <div v-for="i in allupers" :key="i.id">
                                        <div v-if="comment.user_id == i.id" style="display: flex;flex-direction: column;">
                                            <el-avatar :src="i.img"></el-avatar>
                                            <el-text style="margin-top: 2px;">{{ i.name }}</el-text>
                                        </div>
                                    </div>
                                </div>
                                <div style="margin-left: 3px; flex: 1;">
                                    <div>{{ comment.content }}</div>
                                    <div style="display: flex;">
                                        <div style="font-size: 12px; color: #888;margin-top: 9px;">{{ formatCommentTime(comment.last_edit_time) }}</div>
                                        <div style="margin-left: 9px;margin-top: 7px;display: flex;align-items: center;">
                                            <el-text style="cursor: pointer;" size="mini" @click="replyComment(comment.id)">回复</el-text>
                                            <div v-if="user && user.id === comment.user_id">
                                                <el-popconfirm
                                                confirm-button-text="是"
                                                cancel-button-text="否"
                                                :icon="InfoFilled"
                                                icon-color="#626AEF"
                                                title="确定要删除评论吗?"
                                                @confirm="deleteComment(comment.id)"
                                                @cancel="cancelEvent"
                                                >
                                                    <template #reference>
                                                    <el-text style="cursor: pointer;margin-left: 9px;" size="mini"  v-if="user && user.id === comment.user_id">删除</el-text>
                                                    </template>
                                                </el-popconfirm>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-for="scom in comments" :key="scom.content">
                                <div v-if="scom.father_id==comment.id">
                                    <div style="margin-left: 70px;display: flex;margin-top: 10px;align-items: center;">
                                        <div style="width: 100px; text-align: center;display: flex; flex-direction: column; align-items: center;">
                                            <div v-for="i in allupers" :key="i.id">
                                                <div v-if="scom.user_id == i.id" style="display: flex;flex-direction: column;">
                                                    <el-avatar :src="i.img"></el-avatar>
                                                    <el-text style="margin-top: 2px;">{{ i.name }}</el-text>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="margin-left: 3px; flex: 1;">
                                            <div>{{ scom.content }}</div>
                                            <div style="display: flex;">
                                                <div style="font-size: 12px; color: #888;margin-top: 9px;">{{ formatCommentTime(scom.last_edit_time) }}</div>
                                                <div style="margin-left: 9px;margin-top: 7px;display: flex;align-items: center;">
                                                    <el-text style="cursor: pointer;" size="mini" @click="replyComment(scom.id)">回复</el-text>
                                                    <div v-if="user && user.id === comment.user_id">
                                                        <el-popconfirm
                                                            confirm-button-text="是"
                                                            cancel-button-text="否"
                                                            :icon="InfoFilled"
                                                            icon-color="#626AEF"
                                                            title="确定要删除评论吗?"
                                                            @confirm="deleteComment(scom.id)"
                                                            @cancel="cancelEvent"
                                                        >
                                                            <template #reference>
                                                                <el-text style="cursor: pointer;margin-left: 9px;" size="mini"  v-if="user && user.id === comment.user_id">删除</el-text>
                                                            </template>
                                                        </el-popconfirm>
                                                    </div>    
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div v-if="uper">
            <div style="width: 250px;height:178px ;cursor: pointer;" @click="showuper('/main/searchblog?name='+this.uper.name)" class="card">
                <el-tag type="success">博主信息</el-tag>
                <div v-if="uper" >
                    <div style="display: flex;justify-content: center;align-items: center;">
                        <el-avatar size="large" :src="uper.img|| defaultAvatar" ></el-avatar>
                    </div>
                    <div style="margin-top: 3px; display: flex;justify-content: center;align-items: center;border-bottom: 1px dotted black;padding-bottom: 9px;">
                        <el-text tag="b">{{ uper.name }}</el-text>
                    </div>
                    <div style="display: flex;justify-content: center;align-items: center;margin-top: 6px;">
                        <el-text>{{ uper.myself }}</el-text>
                    </div>
                </div>
            </div>
        </div>
        
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
import { useRoute } from 'vue-router';
import { Star, StarFilled,InfoFilled } from '@element-plus/icons-vue';

export default {
    data() {
        return {
            load:true,
            inputdata: '',
            user: null,
            allblogs: null,
            detailid: null,
            detailblog: null,
            allupers: null,
            uper: null,
            defaultAvatar: '',
            isFavorite: false, // 新增收藏状态
            favoriteCount: 0, // 新增收藏数
            commentInput: '', // 评论输入框内容
            comments: [] // 评论列表
        };
    },
    created() {
        this.getData();
        this.getUser();
    },
    mounted() {
        this.detailid = this.$route.query.id;
        console.log(this.detailid);
    },
    methods: {
        showuper(url){
            console.log(url)
            this.$router.push(url)
        },
        async getData() {
            try {
                // 使用 Promise.all 同时处理两个请求
                const [blogsRes, usersRes,resv] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/getblogs"),
                    axios.get("http://127.0.0.1:8000/user")
                ]);

                this.allblogs = blogsRes.data.blogs;
                this.allupers = usersRes.data;
                var flag1 = false
                var flag2 = false
                if (this.allblogs) {
                    for (let item of this.allblogs) {
                        if (item.id == this.detailid) {
                            console.log(item);
                            this.detailblog = item;
                            flag1 = true
                            // 检查是否已收藏，这里假设后端返回的博客数据中有 is_favorite 字段
                            this.isFavorite = item.is_favorite || false;
                            // 获取收藏数
                            this.favoriteCount = item.collection || 0;
                            break;
                        }
                    }
                    this.getComments()
                }

                if (this.detailblog && this.allupers) {
                    axios.post(`http://127.0.0.1:8000/viewadd/`, {id:this.detailid})
                    .then(response => {
                        console.log('浏览量更新响应:', response.data);
                        })
                    .catch(error => {
                            ElMessage.error('更新失败，请稍后重试');
                            console.error(error);
                        });
                    for (let i of this.allupers) {
                        if (i.name == this.detailblog.name) {
                            this.uper = i;
                            flag2 = true
                            console.log(this.uper);
                            break;
                        }
                    }
                        this.load = false
                }
            } catch (error) {
                ElMessage.error('获取数据失败，请稍后重试');
                console.error(error);
            }
        },
        toggleFavorite() {
            const userStore = useUserStore();
            if(userStore.isLoggedIn){
                this.isFavorite = !this.isFavorite;
            // 这里可以添加发送请求到后端更新收藏状态的逻辑
            if (this.isFavorite) {
                // 发送收藏请求
                axios.post(`http://127.0.0.1:8000/blogs/${this.detailblog.id}/favorite/`)
            .then(response => {
                ElMessage.success('收藏成功');
                this.favoriteCount = response.data.collection_count;
            })
            .catch(error => {
                ElMessage.error('收藏失败，请稍后重试');
                console.error(error);
                this.isFavorite = false; // 失败时恢复状态
            });
            } else {
                // 发送取消收藏请求
                axios.delete(`http://127.0.0.1:8000/blogs/${this.detailblog.id}/favorite/`)
                .then(response => {
                    ElMessage.success('取消收藏成功');
                    this.favoriteCount = response.data.collection_count;
                })
                .catch(error => {
                    ElMessage.error('取消收藏失败，请稍后重试');
                    console.error(error);
                    this.isFavorite = true; // 失败时恢复状态
                });
            }
            }else{
                ElMessage.error("未登录！无法进行收藏！")
            }   
        },
        getUser() {
            const userStore = useUserStore();
            if (userStore.isLoggedIn) {
                this.user = userStore.user;
            }
        },
        getComments() {
            if(this.detailblog){
            axios.post(`http://127.0.0.1:8000/getcomments/`,{id:this.detailblog.id})
            .then(response => {
                this.comments = response.data.comments;
                console.log(this.comments)
            })
            .catch(error => {
                ElMessage.error('获取评论失败，请稍后重试');
                console.error(error);
            });
            }
        },
        async submitComment() {
            const userStore = useUserStore();
            if (!userStore.isLoggedIn) {
                ElMessage.error('未登录！无法进行评论！');
                return;
            }
            if (!this.commentInput) {
                ElMessage.error('请输入评论内容');
                return;
            }
            try {
                const response = await axios.post(`http://127.0.0.1:8000/addcomment/`, {
                    blog_id: this.detailblog.id,
                    content: this.commentInput,
                    user_id: this.user.id
                });

                // 检查请求是否成功
                if (response && response.status === 201) {
                    // 检查 response.data 是否存在且包含 message 属性
                    if (response.data && response.data.message) {
                        this.comments.push(response.data.message);
                        this.commentInput = '';
                        ElMessage.success('评论提交成功');
                    } else {
                        ElMessage.error('服务器返回数据格式错误');
                    }
                } else {
                    ElMessage.error('评论提交失败，状态码：' + (response ? response.status : '未知'));
                }
            } catch (error) {
                ElMessage.error('评论提交失败，请稍后重试');
                console.error('请求错误:', error);
            }
        },
        async deleteComment(commentId) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/deletecomment/', {
                    id: commentId
                });
                if (response.status === 200) {
                    this.comments = this.comments.filter(comment => comment.id !== commentId);
                    ElMessage.success('评论删除成功');
                } else {
                    ElMessage.error('评论删除失败，请稍后重试');
                }
            } catch (error) {
                ElMessage.error('评论删除失败，请稍后重试');
                console.error('请求出错:', error);
            }
        },
        async replyComment(commentId) {
            const userStore = useUserStore();
            if (!userStore.isLoggedIn) {
                ElMessage.error('未登录！无法进行评论！');
                return;
            }
            if (!this.commentInput) {
                ElMessage.error('请输入评论内容');
                return;
            }
            try {
                const response = await axios.post(`http://127.0.0.1:8000/addcomment/`, {
                    blog_id: this.detailblog.id,
                    content: this.commentInput,
                    user_id: this.user.id,
                    father_id: commentId
                });

                // 检查请求是否成功
                if (response && response.status === 201) {
                    // 检查 response.data 是否存在且包含 message 属性
                    if (response.data && response.data.message) {
                        this.comments.push(response.data.message);
                        this.commentInput = '';
                        ElMessage.success('评论提交成功');
                    } else {
                        ElMessage.error('服务器返回数据格式错误');
                    }
                } else {
                    ElMessage.error('评论提交失败，状态码：' + (response ? response.status : '未知'));
                }
            } catch (error) {
                ElMessage.error('评论提交失败，请稍后重试');
                console.error('请求错误:', error);
            }
        },
        formatCommentTime(time) {
            return moment(time).format('YYYY-MM-DD HH:mm:ss');
        },
        cancelEvent(){
            console.log("删除成功！")
        }
    },
    components: {
        Star,
        StarFilled
    }
};
</script>

<style scoped>
.carddetail{
    margin: 5px 5px;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .12);
}
</style>    