<template>
    <div>
        <a-form :model="configForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="标签" name="label"
                :rules="[{ required: true, message: 'Please input label!' }]">
                <a-input v-model:value="configForm.label" />
            </a-form-item>
            <a-form-item label="名称" name="name"
                :rules="[{ required: true, message: 'Please input name!' }]">
                <a-input v-model:value="configForm.name" />
            </a-form-item>
            <a-form-item label="描述" name="description"
                :rules="[{ required: false, message: 'Please input description!' }]">
                <a-textarea v-model:value="configForm.description" :rows="4" placeholder="限制100个字符" :maxlength="50" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
    </template>
    <script>
        import { addDict} from '@/api/dict';
        import { onMounted, ref } from 'vue';
        import { message } from 'ant-design-vue';
        export default {
            props:["onSuccess"],
            setup(props) {
                const configForm = ref({
                    label: '',
                    name: '',
                    description: '',
                });
                const onFinishFailed = errorInfo => {
                    console.log('Failed:', errorInfo);
                };
                const onFinish = ()=> {
                    addDict(configForm.value).then(res => {
                        if (!res.code) {
                            message.success('添加成功');
                            props.onSuccess();
                            configForm.value = {
                                label: '',
                                name: '',
                                description: '',
                            }
                        }
                    });
                };
                onMounted(() => {
                    
                });
                return {
                    configForm,
                    onFinishFailed,
                    onFinish
                }
            }
        }
    </script>
    <style lang='less' scoped>
    
    </style>