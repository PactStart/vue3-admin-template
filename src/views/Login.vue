<template>
    <div class="login_container">
        <div class="login_form">
            <a-card title="欢迎登录点外卖返现后台管理系统" style="width: 500px; height: 400px;">
                <a-tabs v-model:activeKey="activeTab" :onTabClick="onTabClick">
                    <a-tab-pane key="1" tab="账号密码登录">
                        <a-form :model="loginByPasswordForm" name="loginByPasswordForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }" autocomplete="off" style="padding-top: 24px;"
                            @finish="onFinish" @finishFailed="onFinishFailed">
                            <a-form-item label="用户名" name="username"
                                :rules="[{ required: true, message: 'Please input your username!' }]">
                                <a-input v-model:value="loginByPasswordForm.username" size="large"/>
                            </a-form-item>

                            <a-form-item label="密码" name="password"
                                :rules="[{ required: true, message: 'Please input your password!' }]">
                                <a-input-password v-model:value="loginByPasswordForm.password" size="large"/>
                            </a-form-item>

                            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                                <a-button type="primary" html-type="submit" size="large">登录</a-button>
                            </a-form-item>
                        </a-form>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="手机号登录">
                        <a-form :model="loginByPhoneForm" name="loginByPhoneForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }"  autocomplete="off" style="padding-top: 24px;"
                            @finish="onFinish" @finishFailed="onFinishFailed">
                            <a-form-item label="手机号" name="phone"
                                :rules="[{ required: true, message: 'Please input your phone!' }]">
                                <a-input v-model:value="loginByPhoneForm.phone" size="large"/>
                            </a-form-item>

                            <a-form-item label="短信验证码" name="smsCode"
                                :rules="[{ required: true, message: 'Please input sms code!' }]" >
                                <div class="input-wrapper">
                                    <a-input v-model:value="loginByPhoneForm.smsCode" size="large" class="input-field" />
                                    <a-button type="primary" size="large" @click="onSendSmsBtnClick">发送</a-button>
                                </div>
                            </a-form-item>
                            <a-form-item :wrapper-col="{ offset: 5, span: 18 }">
                                <a-button type="primary" html-type="submit" size="large">登录</a-button>
                            </a-form-item>
                        </a-form>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="扫码登录">
                        <a-row type="flex" justify="space-around">
                            <vue-qrcode :value="wxLoginObj.url" :options="{ width: 200 }"></vue-qrcode>
                        </a-row>
                        <a-row type="flex" justify="space-around">
                            请使用微信扫码上方二维码
                        </a-row>
                    </a-tab-pane>
                </a-tabs>
            </a-card>
        </div>
    </div>
    
</template>
<script setup>
import { ref, defineComponent, reactive } from 'vue';
import { loginByPassword,loginByPhone ,getWxLoginUrl,getWxLoginResult} from '@/api/user'
import { sendSms } from '@/api/sms'

import router from '../router/index';
import { message } from 'ant-design-vue';

const loginByPasswordForm = reactive({
    username: '',
    password: '',
});
const loginByPhoneForm = reactive({
    phone: '',
    smsCode: '',
});
const onSendSmsBtnClick = (e) => {
    var button = e.currentTarget;
    button.disabled = true;

    sendSms({
        phone: loginByPhoneForm.phone,
        scene: 'LoginByPhone'
    }).then(res => {
        if(!res.code) {
            message.success('发送成功')
            var countdown = 60;
            var timer =  setInterval(()=> {
                countdown = countdown - 1;
                button.innerText = countdown+'s';
                if (countdown <= 0) {
                    clearInterval(timer);
                    button.disabled = false; // 启用按钮
                }
            },1000)
        } else {
            button.disabled = true; // 启用按钮
        }
    })
}
const activeTab = ref('1')
const wxLoginObj = ref({})
const onFinish = values => {
    if(activeTab.value == '1') {
        loginByPassword(loginByPasswordForm).then(res => {
            if (res?.data?.token) {
                localStorage.setItem('token', res?.data?.token)
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                message.success('登录成功')
                router.push('/sys/user')
            }
        })
    } else if(activeTab.value == '2') {
        loginByPhone(loginByPhoneForm).then(res => {
            if (res?.data?.token) {
                localStorage.setItem('token', res?.data?.token)
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                message.success('登录成功')
                router.push('/sys/user')
            }
        })
    }
};
let intervalId;
const onTabClick = (tab) => {
    console.log(tab)
    if(tab == '3' && !wxLoginObj.value.url) {
        getWxLoginUrl().then(res => {
            if (!res.code) {
                wxLoginObj.value = res.data
                intervalId = setInterval(queryWxLoginResult, 2000);
            }
        })
    }
}
const queryWxLoginResult = () => {
    getWxLoginResult({
        state: wxLoginObj.value.state
    }).then(res => {
        if(!res.code && res.data) {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            localStorage.setItem('token', res?.data?.token)
            message.success('登录成功')
            router.push('/sys/user')
        }
    })
}
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};
</script>
<style lang='less' scoped>
    .login_container {
        background-image: url('../assets/img/login-bg.jpg');
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }
    .input-wrapper {
        display: flex;
        align-items: center;
    }

    .input-field {
        margin-right: 0;
    }
</style>