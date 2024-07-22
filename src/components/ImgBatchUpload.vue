<template>
    <div className="clearfix">
        <a-upload listType="picture-card" :fileList="showFileList" :customRequest="customRequest" :beforeUpload="beforeUpload"  :multiple=true 
        :onPreview="handlePreview" :onChange="handleChange" :onRemove="handleRemove" :onDownload="handleDownload2" :showUploadList="showUploadList">
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">点击或拖拽上传图片</div>
                <a-progress v-if="showUploadProgress" :percent="uploadProgress" />
            </div>
        </a-upload>
        <a-modal :visible=previewVisible :onCancel=handleCancelPreview :okText="props.onSelectText" :onOk="props.onSelect(previewImage)">
            <img alt="" style="width: 100%;" :src=previewImage />
        </a-modal>
    </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { uploadImageFile } from '@/api/upload'
import OSS from 'ali-oss'
import { newGuid, getFileExtension, getFilenameFromUrl } from '@/utils/util';
import ossConfig from '@/upload.config.ts'

const props = defineProps({
    fileList: Array,
    category: String,
    onSelect: Function,
    onSelectText: String,
});

const showUploadList = ref({
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: true,
})

const showFileList = computed(() => {
    return props.fileList.filter(item => item.category == props.category)
});

const previewVisible = ref(false)
const previewImage = ref(null)

const handleCancelPreview = () => {
    previewVisible.value = false;
}

const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
};

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const handleChange = ({ fileList }) => {
    props.fileList = fileList
}

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

const uploadProgress = ref(0)
const showUploadProgress = ref(false)
const customRequest = obj => {
    console.log(obj)
    let client = new OSS(ossConfig)  
    //生成guid
    const fileGuid = newGuid()
    console.log('打印生成的文件名称', fileGuid)
    //获取上传文件的后缀
    const fileSuffix = getFileExtension(obj.file)
    console.log('打印获取的文件后缀', fileSuffix)
    //生成新文件名
    const newFileName = "xxxjz-admin/"+import.meta.env.VITE_NODE_ENV + "/" + fileGuid + '.' + fileSuffix
    console.log('生成新文件名', newFileName)

    showUploadProgress.value = true
    client.multipartUpload(newFileName, obj.file, {
        progress: function (p) {
            uploadProgress.value =  Math.floor(p * 100);
            console.log(uploadProgress.value)
        }
    }).then(res => {
        console.log(res)
        res.res.requestUrls.forEach(url => props.fileList.push({
            url: ossConfig.domain + "/" + newFileName,
            category: props.category,
            name: obj.file.name,
            status: 'done'
        }));
        console.log(props.fileList)

    }).catch(err => {
        message.error('上传失败!')
    }).finally(() => {
        showUploadProgress.value = false
    })
}

const handleRemove = file => {
    console.log(file)
    // 使用 findIndex 方法找到要删除的元素的索引
    const indexToRemove = props.fileList.findIndex(item => {
        return item.id === file.id && item.url === file.url && item.category === props.category
    });

    if (indexToRemove !== -1) {
        props.fileList.splice(indexToRemove, 1);
    }
    return true
}

const handleDownload = file => {
    console.log(file)
    // 创建一个临时的<a>元素
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none'
    tempLink.setAttribute('href', file.url); // 设置图片URL
    tempLink.setAttribute('download', getFilenameFromUrl(file.url)); 
    console.log(tempLink)
    // 模拟点击<a>元素
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink); // 清理DOM
}

// 如果file.url使用cdn，例如阿里云，需要在cdn的缓存配置，节点http响应配置中加上下面响应头，否则fetch请求会出现CORS错误
// Access-Control-Allow-Origin *
// Access-Control-Allow-Methods POST,GET
// Access-Control-Allow-Headers *
const handleDownload2 = async file => {
  console.log(file.url)
  try {
    // 使用fetch获取图片数据
    const response = await fetch(file.url);
    console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();

    // 创建一个指向Blob的URL
    const blobUrl = URL.createObjectURL(blob);

    // 创建一个临时的<a>元素，使用blobUrl下载
    const tempLink = document.createElement('a');
    tempLink.href = blobUrl;
    tempLink.download = getFilenameFromUrl(file.url); // 设置下载后的文件名

    // 模拟点击<a>元素
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink); // 清理DOM

    // 释放blob URL
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
  }
}

</script>
<style scoped>
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>