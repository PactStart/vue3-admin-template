<template>
    <div>
        <a-form :model="configForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="配置名称" name="name"
                :rules="[{ required: true, message: 'Please input name!' }]">
                <a-input v-model:value="configForm.name" />
            </a-form-item>
            <a-form-item label="配置描述" name="description"
                :rules="[{ required: true, message: 'Please input description!' }]">
                <a-textarea v-model:value="configForm.description" :rows="4" placeholder="限制50个字符" :maxlength="50" />
            </a-form-item>
    
            <a-form-item label="数据类型" name="数据类型"
                :rules="[{ required: false, message: 'Please select valueType!' }]">
                <a-select v-model:value= "configForm.valueType">
                    <a-select-option  v-for="option in valueTypeOptions" :key="option.itemValue" :value="option.itemValue" >
                    {{ option.itemLabel }}
                    </a-select-option>
                </a-select>
            </a-form-item>
    
            <a-form-item label="配置值" name="value"
                :rules="[{ required: false, message: 'Please input value!' }]">
                <a-textarea v-model:value="configForm.value" :rows="4" placeholder="限制1000个字符" :maxlength="1000" />
            </a-form-item>
    
            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
    import { addConfig} from '@/api/config';
    import { getDictItems} from '@/api/dict';
    import { onMounted, ref } from 'vue';
    import { message } from 'ant-design-vue';
    export default {
        props:["onSuccess"],
        setup(props) {
            const configForm = ref({
                name: '',
                description: '',
                valueType: '',
                value: '',
            });
            let valueTypeOptions = ref([])
            const onFinishFailed = errorInfo => {
                console.log('Failed:', errorInfo);
            };
            const onFinish = ()=> {
                addConfig(configForm.value).then(res => {
                    if (!res.code) {
                        message.success('添加成功');
                        props.onSuccess();
                        configForm.value = {
                            name: '',
                            description: '',
                            valueType: '',
                            value: '',
                        }
                    }
                });
            };
            onMounted(() => {
                getDictItems({name:"sys_config_value_type"}).then(res => {
                    valueTypeOptions.value = res.data.list
                })
            });
            return {
                configForm,
                valueTypeOptions,
                onFinishFailed,
                onFinish
            }
        }
    }
</script>
<style lang='less' scoped>

</style>