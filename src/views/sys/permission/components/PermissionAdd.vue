<template>
    <div>
        <a-form :model="permissionForm" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
            autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="上级ID" name="parentId" :rules="[{ required: true, message: 'Please input parentId!' }]">
                <a-input-number v-model:value="permissionForm.parentId" :min="0" placeholder="请输入上级权限ID，无则为0"
                    style="width: 100%;" />
            </a-form-item>
            <a-form-item label="类型" name="type" :rules="[{ required: true, message: 'Please choose type!' }]">
                <a-radio-group v-model:value="permissionForm.type">
                    <a-radio value="API">API</a-radio>
                    <a-radio value="Page">页面</a-radio>
                    <a-radio value="Button">按钮</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="名字" name="name" :rules="[{ required: true, message: 'Please input name!' }]">
                <a-input v-model:value="permissionForm.name" placeholder="唯一，不可重复" />
            </a-form-item>

            <a-form-item label="描述" name="description">
                <a-textarea v-model:value="permissionForm.description" :rows="4" placeholder="限制50个字符"
                    :maxlength="50" />
            </a-form-item>

            <a-form-item label="是否可匿名访问" name="anon" :rules="[{ required: true, message: 'Please choose anon!' }]">
                <a-radio-group v-model:value="permissionForm.anon">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="是否需要鉴权" name="auth" :rules="[{ required: true, message: 'Please choose auth!' }]">
                <a-radio-group v-model:value="permissionForm.auth">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { addPermission } from '@/api/permission';
import { ref } from 'vue';
export default {
    props: ["onSuccess"],
    setup(props) {
        const permissionForm = ref({
            parentId: 0,
            type: null,
            name: '',
            description: '',
            anon: null,
            auth: null
        });
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        const onFinish = () => {
            addPermission({
                ...permissionForm.value
            }).then(res => {
                if (!res.code) {
                    props.onSuccess();
                    permissionForm.value = {
                        parentId: 0,
                        type: null,
                        name: '',
                        description: '',
                        anon: null,
                        auth: null
                    };
                }
            });
        };
        return {
            permissionForm,
            onFinishFailed,
            onFinish
        }
    }
}
</script>
<style lang='less' scoped>

</style>