<template>
    <div>
        <a-form :model="roleForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
            @finish="onSubmit(roleForm)" @finishFailed="onFinishFailed">
            <a-form-item label="角色名称" name="name"
                :rules="[{ required: true, message: 'Please input name!' }]">
                <a-input v-model:value="roleForm.name" readonly/>
            </a-form-item>
    
            <a-form-item label="角色描述" name="description">
                <a-textarea v-model:value="roleForm.description" :rows="4" placeholder="限制50个字符" :maxlength="50" />
            </a-form-item>
    
            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
    </template>
    <script>
        import { reactive , watchEffect} from 'vue';
        export default {
            props:["role","onSubmit"],
            setup(props) {
                const role = props.role;
                const roleForm = reactive({
                    id: role.id,
                    name: role.name,
                    description: role.description,
                });
                watchEffect(() => {
                    roleForm.id = props.role.id;
                    roleForm.name = props.role.name;
                    roleForm.description = props.role.description;
                })
                const onFinishFailed = errorInfo => {
                    console.log('Failed:', errorInfo);
                };
                return {
                    roleForm,
                    onFinishFailed
                }
            }
        }
    </script>
    <style lang='less' scoped>
    
    </style>