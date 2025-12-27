<template>
    <div class="card" style="flex: 1; height: 82vh; margin-top: 20px; display: flex;">
        <div style="flex: 1;">
            <div>
                <el-tag size="large" style="font-size: 20px;">个人中心</el-tag>
            </div>
            <div style="margin-top: 35px;margin-left: auto;">
                <el-form ref="infoFormRef" :model="user" label-width="120px">
                    <el-form-item label="头像">
                        <div style="display: flex;align-items: center;">
                            <el-avatar :src="user.img || defaultAvatar"></el-avatar>
                            <el-upload
                                action="http://127.0.0.1:8000/uploadAvatar/"
                                ref="uploadRef"
                                class="upload-demo"
                                :file-list="fileList"
                                :http-request="uploadFile"
                                list-type="picture"
                            >
                                <template #trigger>
                                    <el-button  style="margin-left: 10px;margin-top: 10px;" type="primary">上传头像</el-button>
                                </template>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input style="width: 250px;" v-model="newname" placeholder="请输入新的用户名" @blur="checkUsernameDuplicate"></el-input>
                        <span v-if="isUsernameDuplicate" style="color: red;margin-left: 6px;">该用户名已存在</span>
                    </el-form-item>
                    <el-form-item label="账号">
                        <el-input style="width: 250px;" v-model="user.account" disabled placeholder="账号不可修改"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitUserInfo">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-top: 40px;">
                <el-form ref="passwordFormRef" :model="passwordData" label-width="120px">
                    <el-form-item label="*原始密码">
                        <el-input style="width: 250px;" v-model="passwordData.oldPassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="*新密码">
                        <el-input style="width: 250px;" v-model="passwordData.newPassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="primary" @click="submitPasswordForm">确认修改</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-top: 40px;">
                <el-form ref="myselfFormRef" :model="myselfData" label-width="120px">
                    <el-form-item label="个人简介">
                        <el-input style="width: 250px;" v-model="myselfData.myself" :placeholder="this.user.myself"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="primary" @click="submitMyselfForm">确认修改</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/userStore';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';

export default {
    data() {
        return {
            newname: null,
            uploadRef: null,
            inputdata: '',
            user: {},
            fileList: [],
            defaultAvatar: '@/assets/default.png',
            passwordData: {
                oldPassword: '',
                newPassword: ''
            },
            myselfData: {
                myself: ''
            },
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            isUsernameDuplicate: false
        };
    },
    created() {
        const userStore = useUserStore();
        this.user = userStore.user || {};
        this.passwordData.oldPassword = this.user.password;
        this.myselfData.myself = this.user.myself;
        this.myselfData.myself = this.user.myself;
    },
    methods: {
        checkUsernameDuplicate() {
            if (this.newname) {
                axios.get('http://127.0.0.1:8000/checkUsername', {
                    params: {
                        username: this.newname
                    }
                })
                   .then(response => {
                        this.isUsernameDuplicate = response.data.isDuplicate;
                    })
                   .catch(error => {
                        console.error('检查用户名重复出错:', error);
                    });
            }
        },
        async submitUserInfo() {
            if (this.isUsernameDuplicate) {
                return;
            }
            try {
                if (this.$refs.uploadRef) {
                    await this.$refs.uploadRef.submit();
                } else {
                    console.log('uploadRef 未正确绑定');
                }
                // 保存旧名字
                const oldName = this.user.name;
                if (this.newname) {
                    this.user.name = this.newname;
                }
                console.log('即将发送的用户数据:', this.user);
                const response = await axios.post('http://127.0.0.1:8000/updateUserInfo/', this.user);
                if (response.data.status === 'success') {
                    const userStore = useUserStore();
                    console.log('Before setUser, isLoggedIn:', userStore.isLoggedIn);
                    userStore.setUser(this.user);
                    console.log('After setUser, isLoggedIn:', userStore.isLoggedIn);
                    ElMessage.success('保存成功！');
                    // 保存成功后调用更新博客名字的方法
                    if (this.newname) {
                        await this.updateBlogsUserName(oldName, this.newname);
                    }
                } else {
                    ElMessage.error('保存失败，请稍后重试！');
                }
            } catch (error) {
                ElMessage.error('保存失败，请稍后重试！');
            }
        },
        submitPasswordForm() {
            axios.post('http://127.0.0.1:8000/updatePassword/', this.passwordData)
               .then((response) => {
                    if (response.data.status === 'success') {
                        ElMessage.success('密码修改成功！');
                    } else {
                        ElMessage.error('密码修改失败，请稍后重试！');
                    }
                })
               .catch((error) => {
                    console.error('密码修改失败:', error);
                    ElMessage.error('密码修改失败，请稍后重试！');
                });
        },
        uploadFile({ file }) {
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('account', this.user.account);
            axios.post('http://127.0.0.1:8000/uploadAvatar/', formData, {
                headers: {
                    // 注意：不要手动设置 Content-Type，让浏览器自动处理
                    // 'Content-Type': 'multipart/form-data' 
                }
            })
           .then(response => {
                if (response.data.status === 'success') {
                    // 处理多余的 //
                    this.user.img = response.data.imgUrl
                    console.log(response.data.imgUrl);
                    const userStore = useUserStore();
                    userStore.setUser(this.user);
                    ElMessage.success('头像上传成功！');
                } else {
                    ElMessage.error('头像上传失败，请稍后重试！');
                }
            })
           .catch(error => {
                console.error('头像上传失败:', error);
                ElMessage.error('头像上传失败，请稍后重试！');
            });
        },
        beforeUpload(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedImageUrl = e.target.result;
            };
            reader.readAsDataURL(file);
            return true;
        },
        submitMyselfForm() {
            const data = {
                account: this.user.account,
                myself: this.myselfData.myself
            };
            axios.post('http://127.0.0.1:8000/updateMyself/', data)
               .then((response) => {
                    if (response.data.status === 'success') {
                        this.user.myself = this.myselfData.myself;
                        const userStore = useUserStore();
                        userStore.setUser(this.user);
                        ElMessage.success('个人简介修改成功！');
                    } else {
                        ElMessage.error('个人简介修改失败，请稍后重试！');
                    }
                })
               .catch((error) => {
                    console.error('个人简介修改失败:', error);
                    ElMessage.error('个人简介修改失败，请稍后重试！');
                });
        },
        async updateBlogsUserName(oldName, newName) {
            try {
                console.log(oldName + newName);
                const response = await axios.post('http://127.0.0.1:8000/updateBlogsUserName/', {
                    oldName: oldName,
                    newName: newName
                });
                if (response.data.status === 'success') {
                    ElMessage.success('博客用户名更新成功！');
                } else {
                    ElMessage.error('博客用户名更新失败，请稍后重试！');
                }
            } catch (error) {
                ElMessage.error('博客用户名更新失败，请稍后重试！');
                console.error('更新博客用户名出错:', error);
            }
        }
    }
};
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>    