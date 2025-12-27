<template>
    <div class="card" style="margin-bottom: 2px;min-height: 82vh; position: relative;">
        <div style="display: flex;justify-content: space-between;">
            <el-tag size="large" style="font-size: 20px;">我的帖子</el-tag>
            <el-button type="success" style="margin-right: 10px;" @click="postblog">
                    <el-icon><EditPen /></el-icon>我要发帖
            </el-button>
        </div>
        <el-table :data="tabledata" stripe>
            <el-table-column label="类型" prop="type"></el-table-column>
            <el-table-column label="标题" >
                <template #default="scope">
                    <div v-html="scope.row.title"></div>
                </template>
            </el-table-column>
            <el-table-column label="内容" prop="content">
                <template #default="scope">
                    <div class="ellipsis-content">
                        <!-- 按字符数截断并添加省略号 -->
                        {{ scope.row.content.length > 20? scope.row.content.slice(0, 20) + '...' : scope.row.content }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-select
                        v-model="selectvalue"
                        placeholder="选择要编辑的内容"
                        size="large"
                        style="width: 200px"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-button type="success" icon="Edit" circle @click="editdata(scope.row)"></el-button>
                    <el-button type="danger" icon="Delete" circle @click="deletedata(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="position: absolute; bottom: 0; width: 100%; padding: 10px; box-sizing: border-box;">
            <el-pagination 
                v-model:current-page="pagenum"
                v-model:page-size="pagesize"
                background
                layout="total, prev, pager, next, jumper"
                :total="total"
                @update:current-page="onCurrentPageChange"
                @update:page-size="onPageSizeChange"
            />
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="编辑内容" :append-to-body="true" style="z-index: 2000;">
        <div style="border: 1px solid #ccc;">
            <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
            />
            <Editor
                style="height: 500px; overflow-y: hidden;"
                v-model="editorContent"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
            />
        </div>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="savecontent">确定</el-button>
        </template>
    </el-dialog>
</template>

<script>
import DOMPurify from 'dompurify';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus'; 
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, reactive, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useUserStore } from '@/store/userStore';

export default {
    components: { Editor, Toolbar },
    data() {
        return {
            user:null,
            inputdata: '',
            pagenum: 1,
            pagesize: 9,
            total: 0,
            allData: [], // 存储完整的数据组
            tabledata: [], // 存储当前页要显示的数据
            dialogVisible: false,
            form: {},
            selectvalue: null,
            options: [
                { label: '标题', value: 'title' },
                { label: '内容', value: 'content' },
            ],
            // wangEditor 配置
            editorContent: '',
            editor: null,
            mode: 'default',
            toolbarConfig: {},
            editorConfig: {
                placeholder: '请输入内容...',
                MENU_CONF: {
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
                            return true; // 允许上传
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
                    }
                }
            },
            mode: 'default' 
        };
    },
    created() {
        this.getData();
    },
    methods: {
        onCreated(editor) {
            this.editor = editor;
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
        },
        getData() {
            const userStore = useUserStore();
            this.user = userStore.user;
            if (!this.user) {
                ElMessage.error('请先登录！');
                return;
            }
            axios.get("http://127.0.0.1:8000/getblogs")
              .then((res) => {
                    console.log(res.data);
                    const byall = res.data.blogs;
                    this.allData = byall.filter(blog => blog.name === this.user.name);
                    this.total = this.allData.length;
                    this.updateTableData(); // 更新当前页要显示的数据
                    ElMessage.success('获取数据成功！');
                })
              .catch(error => {
                    ElMessage.error('获取数据失败，请先登录！');
                    console.error(error);
                });
        },
        deletedata(row) {
            console.log(row);
            const index = this.allData.findIndex(item => item.id === row.id);
            if (index!== -1) {
                this.allData.splice(index, 1);
                this.total = this.allData.length;
                this.updateTableData(); // 更新当前页要显示的数据
            }
            axios.post('http://127.0.0.1:8000/deleteblog/', row)
              .then(res => {
                    ElMessage.success('删除成功!');
                })
              .catch(error => {
                    ElMessage.error('删除失败，请稍后重试');
                    console.error(error);
                });
        },
        editdata(row) {
            this.form = row;
            if (this.selectvalue) {
                this.editorContent = row[this.selectvalue];
            }
            this.dialogVisible = true;
        },
        savecontent() {
            if (this.selectvalue) {
                // 清理编辑器内容
                const cleanContent = DOMPurify.sanitize(this.editorContent);
                this.form[this.selectvalue] = cleanContent;
            }
            const dataToSend = {
                title: this.form.title,
                content: this.form.content
            };
            axios.put(`http://127.0.0.1:8000/updateblog/${this.form.id}/`, dataToSend)
              .then(response => {
                    const index = this.allData.findIndex(item => item.id === this.form.id);
                    if (index!== -1) {
                        this.allData[index] = this.form;
                        this.updateTableData(); // 更新当前页要显示的数据
                    }
                    ElMessage.success('更新成功！');
                    this.dialogVisible = false;
                })
              .catch(error => {
                    ElMessage.error('更新失败，请稍后重试');
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
        postblog(){
            const userStore = useUserStore();
            if (!userStore.isLoggedIn) {
            ElMessage.error("还未登录，不能发帖哦！");
            }
            else{
                this.$router.push('/main/postblog')
            }
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
</style>