<template>
    <!-- 模板代码保持不变 -->
    <div class="card" style="flex: 1;margin-top: 5px;padding: 30px;">
        <div style="align-items: center;">
            <el-tag type="success" size="large" style="font-size: 20px;" round>编辑帖子</el-tag>
            <div><el-text type="small">(注：封面和视频为非必需项)</el-text></div>         
            <el-form :model="newblog" label-width="80px" style="margin-top: 20px;">
                <el-form-item label="*标题">
                    <el-input v-model="newblog.title" style="width: 470px;"></el-input>
                </el-form-item>
                <el-form-item label="*封面">
                    <el-upload
                        action="http://127.0.0.1:8000/saveBlog/"
                        ref="uploadRef"
                        :http-request="uploadImg"
                        class="upload-demo"
                    >
                        <template #trigger>
                            <el-button type="primary">选择封面文件</el-button>
                        </template>
                    </el-upload>
                    <div v-if="newblog.coverUrl" class="upload-preview">
                        <img :src="newblog.coverUrl" alt="封面" style="max-width: 200px; max-height: 200px;">
                    </div>
                </el-form-item>
                <el-form-item label="*游戏类型">
                    <el-mention style="width: 470px;"  :prefix="optionspre" v-model="newblog.type" :options="options"></el-mention>
                </el-form-item>
                <el-form-item label="*内容">
                    <div style="border: 1px solid #ccc;">
                        <Toolbar
                            style="border-bottom: 1px solid #ccc"
                            :editor="editor"
                            :defaultConfig="toolbarConfig"
                            :mode="mode"
                        />
                        <Editor
                            style="height: 400px; overflow-y: hidden;"
                            v-model="newblog.content"
                            :defaultConfig="editorConfig"
                            :mode="mode"
                            @onCreated="onCreated"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="*视频">
                    <el-upload
                        action="http://127.0.0.1:8000/saveBlog/"
                        ref="uploadRef2"
                        :http-request="uploadVideo"
                        class="upload-demo"
                    >
                        <template #trigger>
                            <el-button type="primary">选择视频文件</el-button>
                        </template>
                    </el-upload>
                    <div v-if="newblog.videoUrl" class="upload-preview">
                        <video width="320" height="240" controls>
                            <source :src="newblog.videoUrl" type="video/mp4">
                            您的浏览器不支持视频播放。
                        </video>
                    </div>
                </el-form-item>
                <el-form-item label="*帖子类型">
                    <el-select
                      v-model="newblog.forblog"
                      placeholder="选择类型"
                      size="large"
                      style="width: 240px"
                    >
                      <el-option
                        v-for="item in blogoptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="justify-content: center;display: flex;">
                <el-button type="success" @click="submitBlog">发布帖子</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { dayjs } from 'element-plus';
import moment from 'moment';
import { reactive, ref } from 'vue';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { useUserStore } from '@/store/userStore';

export default {
    components: { Editor, Toolbar },
    data() {
        return {
            inputdata: '',
            user: null,
            // wangEditor 配置
            editorContent: '',
            editor: null,
            mode: 'default',
            toolbarConfig: {},
            editorConfig: {
                placeholder: '请输入内容...',
                // autoFocus: false,
                // 所有的菜单配置，都要在 MENU_CONF 属性下
                
                    MENU_CONF: {
						// 所有的菜单配置，都要在 MENU_CONF 属性下
						// 配置上传图片
 
						uploadImage: {
							// 后端上传地址，必填
							server: 'http://127.0.0.1:8000/uploadEditorImage/',
 
							timeout: 5 * 1000, // 5s 超时时间
 
							fieldName: 'custom-fileName',
 
							//选择文件时的类型限制，默认为['image/*'] 如不想限制，则设置为 []
							allowedFileTypes: [],
							
							metaWithUrl: true, // 参数拼接到 url 上
 
							maxFileSize: 1000 * 1024 * 1024, //1g //设置大点 不然图片过大会报错
 
							base64LimitSize: 1000000 * 1024, // 1g 以下插入 base64
 
							// 上传前
							onBeforeUpload(file) {
								console.log('onBeforeUpload', file)
								// Message({
								//                 message: '图片正在上传中,请耐心等待',
								//                 duration: 0,
								//                 customClass: 'uploadTip',
								//                 iconClass: 'el-icon-loading',
								//                 showClose: true
								//               });
								              return files;
								return file.url // 返回哪些文件可以上传
								// return false 会阻止上传
							},
							 // 上传进度的回调函数
							onProgress(progress) {
								console.log('onProgress', progress)
							},
							 // 单个文件上传成功之后
							onSuccess(file, res) {
								console.log('onSuccess', file.url, res)
							},
							// 单个文件上传失败
							onFailed(file, res) {
								alert(res.message)
								console.log('onFailed', file, res)
							},
							// 上传错误，或者触发 timeout 超时
							onError(file, err, res) {
								alert(err.message)
								console.error('onError', file, err, res)
							},
						},
                    }
            },
            mode: 'default',
            options: null,
            alltypes: null,
            newblog: {
                title: null,
                coverUrl: null,
                name: null,
                type: null,
                content: null,
                videoUrl: null,
                forblog: null
            },
            coverFile: null,
            videoFile: null,
            optionspre: [], // 这里初始化为空字符串
            blogoptions: [
                {
                    value: '游我攻略',
                    label: '游我攻略',
                },
                {
                    value: '游我来音',
                    label: '游我来音',
                },
                {
                    value: '游我推荐',
                    label: '游我推荐',
                },
                {
                    value: '游我杂谈',
                    label: '游我杂谈',
                },
            ]
        };
    },
    created() {
        const userStore = useUserStore();
        this.user = userStore.user;
        this.getdata();
        if (!userStore.isLoggedIn) {
            ElMessage.warning("还未登录，仅可预览界面！");
        }
    },
    methods: {
        getdata() {
            axios.get("http://127.0.0.1:8000/getblogtypes/").then((res) => {
                console.log(res.data);
                this.alltypes = res.data.blogtypes;
                this.options = this.alltypes.map(item => ({
                    label: item.type,
                    value: item.type
                }));
                // 提取 options 中每个对象的 label 的第一个字符
                const firstChars = this.options.map(option => option.label.charAt(0));
                // 去重并拼接成字符串
                for (let i of firstChars) {
                    this.optionspre.push(i);
                }
            });
        },
        onCreated(editor) {
            this.editor = Object.seal(editor);
        },
        uploadImg({ file }) {
            this.coverFile = file;
            if (this.coverFile) {
                this.editorConfig.MENU_CONF.uploadImage.customUpload([this.coverFile], (url) => {
                    this.newblog.coverUrl = url;
                });
            }
        },
        uploadVideo({ file }) {
            this.videoFile = file;
        },
        async submitBlog() {
            if (
                !this.newblog.title ||
                !this.newblog.type ||
                !this.newblog.content ||
                !this.newblog.forblog
            ) {
                ElMessage.error('请填写所有必填项');
                return;
            }

            const formData = new FormData();
            formData.append('img', this.coverFile);
            formData.append('name', this.user.name);
            formData.append('video', this.videoFile);
            formData.append('title', this.newblog.title);
            formData.append('type', this.newblog.type);
            formData.append('content', this.newblog.content);
            formData.append('forblog', this.newblog.forblog);
            console.log('提交的封面文件:', this.coverFile);
            try {
                const response = await axios.post('http://127.0.0.1:8000/saveBlog/', formData, {
                    headers: {
                        // 注意：不要手动设置 Content-Type，让浏览器自动处理
                        // 'Content-Type': 'multipart/form-data' 
                    }
                });
                if (response.data.status ==='success') {
                    this.newblog.coverUrl = response.data.imgUrl;
                    this.newblog.videoUrl = response.data.videoUrl;
                    ElMessage.success('帖子发布成功');
                    router.push('/');
                } else {
                    ElMessage.error('帖子发布失败，服务器返回错误信息');
                }
            } catch (error) {
                ElMessage.error('帖子发布失败，请检查网络连接或稍后重试');
                console.error('上传失败:', error);
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>';
        }, 1500);
    },
    beforeDestroy() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy();
    }
};
</script>

<style scoped>
.upload-preview {
    margin-top: 10px;
}
</style>    