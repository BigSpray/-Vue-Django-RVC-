<template>
    <div class="card" style="margin-bottom: 5px;">
        <el-button type="success" @click="openDialog">发布内容</el-button>
    </div>
    <el-dialog v-model="dialogVisible2" title="添加语音助手">
        <el-form :model="newUser" label-width="80px">
            <el-form-item label="*内容">
                <el-input v-model="newUser.content"></el-input>
            </el-form-item>
            <el-form-item label="*音频">
                <el-upload
                    action="http://127.0.0.1:8000/create_airvc/"
                    ref="uploadRef2"
                    :http-request="uploadVideo"
                    class="upload-demo"
                >
                    <template #trigger>
                        <el-button type="primary">选择音频文件</el-button>
                    </template>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible2 = false">取消</el-button>
            <el-button type="primary" @click="addblog">确定</el-button>
        </template>
    </el-dialog>
    <div class="card" style="margin-bottom: 5px;">
        <el-table :data="tabledata" stripe>
            <el-table-column label="内容" prop="content">
                <template #default="scope">
                    <div class="ellipsis-content">
                        <!-- 按字符数截断并添加省略号 -->
                        {{ scope.row.content.length > 20? scope.row.content.slice(0, 20) + '...' : scope.row.content }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="音频" prop="audio">
                <template #default="scope">
                    <audio
                        :src=" scope.row.audio_url"
                        controls
                        style="max-width: 200px; max-height: 200px;"
                    ></audio>
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
import DOMPurify from 'dompurify';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, reactive, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

export default {
    components: { Editor, Toolbar },
    data() {
        return {
            dialogVisible2: false,
            inputdata: '',
            pagenum: 1,
            pagesize: 10,
            total: 0,
            allData: [], // 存储完整的数据组
            tabledata: [], // 存储当前页要显示的数据
            newUser: {
                content: '',
                audio: null
            },
            audioFile: null,
            // 用于存储上传进度
            uploadProgress: 0,
            // 用于显示上传状态提示信息
            uploadTip: ''
        };
    },
    created() {
        this.getData();
    },
    methods: {
        uploadVideo({ file }) {
            this.audioFile = file;
            // 显示上传提示信息
            this.uploadTip = '音频正在上传中，请耐心等待';
            const formData = new FormData();
            formData.append('content', this.newUser.content);
            formData.append('audio', this.audioFile);

            const config = {
                headers: {
                    // 'Content-Type':'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    this.uploadProgress = percentComplete;
                }
            };

            axios.post('http://127.0.0.1:8000/airvc_create/', formData, config)
               .then(response => {
                    // 上传成功，更新提示信息
                    this.uploadTip = '音频上传成功';
                    ElMessage.success('添加成功！');
                    this.newUser= {
                        content: '',
                        audio: null
                    },
                    this.dialogVisible2 = false;
                    this.getData(); // 重新获取数据以更新表格
                })
               .catch(error => {
                    // 上传失败，更新提示信息
                    this.uploadTip = '音频上传失败，请稍后重试';
                    ElMessage.error('添加失败，请稍后重试');
                    console.error(error);
                });
        },
        getData() {
            axios.get("http://127.0.0.1:8000/airvc_get_all/")
               .then((res) => {
                    console.log(res.data);
                    this.allData = res.data.airvcs;
                    this.total = this.allData.length;
                    this.updateTableData(); // 更新当前页要显示的数据
                    ElMessage.success('获取数据成功！');
                })
               .catch(error => {
                    ElMessage.error('获取数据失败，请稍后重试');
                    console.error(error);
                });
        },
        deletedata(row) {
            const dataToSend = {
                id: row.id
            };
            axios.post('http://127.0.0.1:8000/airvc_delete/', dataToSend)
               .then(res => {
                    ElMessage.success('删除成功!');
                    const index = this.allData.findIndex(item => item.id === row.id);
                    if (index!== -1) {
                        this.allData.splice(index, 1);
                        this.total = this.allData.length;
                        this.updateTableData(); // 更新当前页要显示的数据
                    }
                })
               .catch(error => {
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
            this.tabledata = this.allData.slice(start, end);
        },
        openDialog() {
            console.log('点击了添加用户按钮');
            this.dialogVisible2 = true;
        },
        handleAudioChange(event) {
            this.audioFile = event.target.files[0];
        },
        addblog() {
            const formData = new FormData();
            formData.append('content', this.newUser.content);
            if (this.audioFile) {
                formData.append('audio', this.audioFile);
            }

            axios.post('http://127.0.0.1:8000/airvc_create/', formData, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            })
           .then(response => {
                    ElMessage.success('添加成功！');
                    this.newUser= {
                        content: '',
                        audio: null
                    },
                    this.dialogVisible2 = false;
                    this.getData(); // 重新获取数据以更新表格
                })
           .catch(error => {
                    ElMessage.error('添加失败，请稍后重试');
                    console.error(error);
                });
        }
    }
};
</script>

<style scoped>
/* 设置超出部分显示省略号的样式 */
.ellipsis-content {
    width: 200px; /* 设置宽度，可根据实际情况调整 */
    white-space: nowrap; /* 禁止文本换行 */
    overflow: hidden; /* 隐藏溢出内容 */
    text-overflow: ellipsis; /* 超出部分显示为省略号 */
}
/* 上传提示信息的样式 */
.upload-tip {
    color: #1989fa;
    margin-top: 5px;
}
</style>