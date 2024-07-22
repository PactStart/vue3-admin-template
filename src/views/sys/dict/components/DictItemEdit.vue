<template>
    <div>
        <a-form :model="configForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="标签" name="itemLabel"
                :rules="[{ required: true, message: 'Please input label!' }]">
                <a-input v-model:value="configForm.itemLabel" />
            </a-form-item>
            <a-form-item label="值" name="itemValue"
                :rules="[{ required: true, message: 'Please input value!' }]">
                <a-textarea v-model:value="configForm.itemValue" :rows="4" placeholder="限制200个字符" :maxlength="200" />
            </a-form-item>
            <a-form-item label="描述" name="description"
                :rules="[{ required: false, message: 'Please input description!' }]">
                <a-textarea v-model:value="configForm.description" :rows="4" placeholder="限制100个字符" :maxlength="50" />
            </a-form-item>
            <a-form-item label="是否默认" name="isDefault" >
                <a-checkbox @onChange="onIsDefaultChange"/>
            </a-form-item>
            <a-form-item label="排序" name="sort"
                :rules="[{ required: false, message: 'Please input sort!' }]">
                <a-input-number v-model:value="configForm.sort" :rows="4" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
    </template>
<script setup>
    import { updateDictItem} from '@/api/dict';
    import { ref , watchEffect} from 'vue';
    import { message } from 'ant-design-vue';

    const props = defineProps({
        dictItem: Object,
        onSuccess: Function
    });
    const configForm = ref({...props.dictItem});
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    const onFinish = ()=> {
        updateDictItem(configForm.value).then(res => {
            if (!res.code) {
                message.success('修改成功');
                props.onSuccess();
            }
        });
    };
    const onIsDefaultChange = e => {
        console.log(e.target.checked)
        configForm.value.isDefault = e.target.checked
    }
    watchEffect(() => {
        configForm.value = {...props.dictItem};
    });
</script>
<style lang='less' scoped>

</style>