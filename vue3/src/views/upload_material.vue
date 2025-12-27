<template>
    <div style="display: flex;">
    <div class="card" style="width: 400px;height: 150px;">
    <el-upload
    ref="uploadRef"
    class="upload-demo"
    action="http://127.0.0.1:8000/uploadimg/"
    :auto-upload="false"
    :on-success="handleUploadSuccess"
    :on-error="handleUploadError"
    :before-upload="beforeUpload"
  >
    <template #trigger>
      <el-button type="primary" style="margin-right: 10px;">选择图片</el-button>
    </template>
    <el-button class="ml-3" type="success" @click="submitUpload">
     上传至后台
    </el-button>

    <template #tip>
      <div class="el-upload__tip">
        请选择图片进行上传，可在下方展示出来哦~
      </div>
    </template>
  </el-upload>
   </div> 
   <div class="card" style="width: 400px;height: 150px;margin-left: 340px;">
    <el-upload
    ref="uploadRef2"
    class="upload-demo"
    action="http://127.0.0.1:8000/uploadvideo/"
    :auto-upload="false"
    :on-success="handleUploadSuccess"
    :on-error="handleUploadError"
    :before-upload="beforeUpload2"
  >
    <template #trigger>
      <el-button type="primary" style="margin-right: 10px;">选择视频</el-button>
    </template>
    <el-button class="ml-3" type="success" @click="submitUpload2">
     上传至后台
    </el-button>

    <template #tip>
      <div class="el-upload__tip">
        请选择视频/音频进行上传，可在下方展示出来哦~
      </div>
    </template>
  </el-upload>
   </div> 
    </div>
    <div class="display-container">
        <div class="card" style="width: 50%;height: 400px;">
                <div class="el-upload__tip">
                    展示图片区~
                </div>
            <img v-if="selectedImageUrl" :src="selectedImageUrl" alt="Selected Image" style="max-width: 100%; margin-top: 10px;">
        </div>
        <div class="card" style="width: 50%;height: 400px;">
                <div class="el-upload__tip">
                    展示视频区~
                </div>
                <video v-if="selectedVideoUrl" :src="selectedVideoUrl" controls style="max-width: 100%; margin-top: 10px;"></video>
        </div>
        
    </div>
    
   
</template>

<script>
import { reactive, ref } from 'vue';
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 引入 ElMessage

export default {
    data() {
        return {
            img: null,
            selectedImageUrl: null,
            selectedVideoUrl: null
        };
    },
    methods: {
    submitUpload() {
      if (this.$refs.uploadRef) {
        console.log('准备提交上传');
        this.$refs.uploadRef.submit();
      } else {
        console.log('uploadRef 未正确绑定');
      }
    },
    submitUpload2() {
      if (this.$refs.uploadRef2) {
        console.log('准备提交上传');
        this.$refs.uploadRef2.submit();
      } else {
        console.log('uploadRef2 未正确绑定');
      }
    },
    handleUploadSuccess(response, file, fileList) {
      ElMessage.success('上传成功!');
    },
    handleUploadError(error, file, fileList) {
      ElMessage.error('上传失败!');
    },
    beforeUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      return true;
    },
    beforeUpload2(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedVideoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      return true;
    }
  }
};
</script>
<style scoped>
.display-container {
    display: flex;
    flex-grow: 1; /* 展示区域撑满剩余空间 */
}
</style>

