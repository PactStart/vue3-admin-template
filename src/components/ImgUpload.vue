<template>
    <a-upload listType="picture-card" :customRequest="customRequest" :beforeUpload="beforeUpload" className="avatar-uploader" :showUploadList="false">
        <img v-if="props.imageUrl" :src="props.imageUrl" style="width: 100%" />
        <PlusOutlined v-show="!props.imageUrl"/>
        <div v-if="!imageUrl">{{props.uploadText}}</div>
        <LoadingOutlined v-if="loading"/>
    </a-upload>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { watchEffect } from 'vue';
import { ref } from 'vue';
import { uploadImageFile} from '@/api/upload'

const props = defineProps({
    imageUrl: String,
    onUploadSuccess: Function,
    uploadText: String,
});

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只支持JPG/PNG格式的图片');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片文件需在2M以内');
  }
  return isJpgOrPng && isLt2M;
}

const loading = ref(false)
const customRequest = obj => {
    loading.value = true
    // https://github.com/react-component/upload#customrequest
    // 准备要上传的文件，这里假设file是一个File对象
    // 例如，你可以从<input type="file">元素中获取
    const formData = new FormData();
    // 使用append方法添加文件，第一个参数是字段名，第二个参数是文件对象
    formData.append('file', obj.file);
    uploadImageFile(formData).then(res => {
        if(!res.code) {
            console.log(res.data)
            obj.onSuccess()
            props.onUploadSuccess(res.data.url)
        }
        loading.value = false
    })
}
</script>
<style scoped>
    .avatar-uploader > .ant-upload {
        width: 128px;
        height: 128px;
    }
</style>