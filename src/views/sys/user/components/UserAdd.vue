<template>
<div>
    <a-form :model="userForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="账号" name="username"
            :rules="[{ required: true, message: 'Please input username!' }]">
            <a-input v-model:value="userForm.username" />
        </a-form-item>
        <a-form-item label="真实姓名" name="realName"
            :rules="[{ required: false, message: 'Please input realName!' }]">
            <a-input v-model:value="userForm.realName" />
        </a-form-item>
        <a-form-item label="昵称" name="nickname"
            :rules="[{ required: false, message: 'Please input nickname!' }]">
            <a-input v-model:value="userForm.nickname" />
        </a-form-item>

        <a-form-item label="手机号" name="phone"
            :rules="[{ required: false, message: 'Please input phone!' }]">
            <a-input v-model:value="userForm.phone" />
        </a-form-item>

        <a-form-item label="邮箱" name="email"
            :rules="[{ required: false, message: 'Please input email!' }]">
            <a-input v-model:value="userForm.email" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
            <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
    </a-form>
</div>
</template>
<script>
    import { addUser} from '@/api/user';
    import { reactive } from 'vue';
    import { message, Modal } from 'ant-design-vue';
    export default {
        props:["onSuccess"],
        setup(props) {
            const userForm = reactive({
                username: '',
                realName: '',
                phone: '',
                email: '',
            });
            const onFinishFailed = errorInfo => {
                console.log('Failed:', errorInfo);
            };
            const onFinish = ()=> {
                addUser(userForm).then(res => {
                    if (!res.code) {
                        message.success('添加成功,用户名: '+userForm.username+' ,初始密码：'+ res.data.initPassword,0);
                        props.onSuccess();
                        userForm.username = '';
                        userForm.realName = '';
                        userForm.phone = '';
                        userForm.email = '';
                    }
                });
            };
            return {
                userForm,
                onFinishFailed,
                onFinish
            }
        }
    }
</script>
<style lang='less' scoped>

</style>