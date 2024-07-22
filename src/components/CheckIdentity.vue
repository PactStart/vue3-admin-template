<template>
    <a-modal :visible="shouldCheckData.shouldCheck"  title="身份验证" :onOk="onCheckBtnClick" :onCancel="onCancelCheckBtnClick">
        <a-form :model="checkForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off">
            <a-form-item label="验证方式" name="checkType" :rules="[{ required: true, message: 'Please select checkType!' }]">
                <a-radio-group v-model:value= "checkForm.checkType">
                    <a-radio-button  v-for="checkType in shouldCheckData.checkTypes" :key="checkType" :value="checkType" >
                    {{ getCheckTypeName(checkType) }}
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="手机号" name="phone" v-show="checkForm.checkType == 'phone'">
                {{ phone }}
            </a-form-item>
            <a-form-item label="邮箱" name="email" v-show="checkForm.checkType == 'email'">
                {{ email }}
            </a-form-item>
            <a-form-item label="验证码" name="code" :rules="[{ required: true, message: 'Please input code!' }]" v-show="checkForm.checkType == 'phone' || checkForm.checkType == 'email'">
                <div class="input-wrapper">
                    <a-input v-model:value="checkForm.code" size="large" class="input-field" />
                    <a-button type="primary" size="large" @click="onSendCodeBtnClick">发送</a-button>
                </div>
            </a-form-item>
            <a-form-item label="验证码" name="mfaCode" :rules="[{ required: true, message: 'Please input code!' }]" v-show="checkForm.checkType == 'mfa'">
                <div class="input-wrapper">
                    <a-input v-model:value="checkForm.mfaCode" size="large" class="input-field" />
                </div>
            </a-form-item>
            <a-form-item label="密码" name="password" :rules="[{ required: true, message: 'Please input password!' }]"  v-show="checkForm.checkType == 'password'">
              <a-input-password v-model:value="checkForm.password" />
          </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup>
    import { ref, watchEffect, computed} from 'vue';
    import { useStore } from 'vuex';
    import { message } from 'ant-design-vue';
    import { shouldCheckIdentity, checkIdentity, sendVerifyEmail } from '@/api/user';
    import { sendSmsToMySelf } from '@/api/sms';

    const store = useStore();
    const props = defineProps({
        count: Number,
        operation: String,
        onSuccess: Function
    });
    const getCheckTypeName = (checkType) => {
        if (checkType == 'phone') {
            return '手机短信'
        } else if (checkType == 'email') {
            return '邮箱'
        } else if (checkType == 'password') {
            return '登录密码'
        } else if (checkType == 'mfa') {
            return 'MFA验证器'
        }
        return checkType
    };
    const phone = computed(() => {
        return store.state.user.phone
    });
    const email = computed(() => {
        return store.state.user.email
    });
    const shouldCheckData = ref({
        shouldCheck: false,
        defaultCheckType: null,
        checkTypes:[]
    })
    const checkForm = ref({
        checkType : null,
        code: null,
        password: null,
        mfaCode: null
    })
    const onSendCodeBtnClick = (e) => {
        if (checkForm.value.checkType == "phone") {
            var button = e.currentTarget;
            button.disabled = true;
            sendSmsToMySelf({
                phone: phone.value,
                scene: 'CheckIdentity'
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
                            button.innerText= '发送';
                        }
                    },1000)
                } else {
                    button.disabled = false; // 启用按钮
                    button.innerText= '发送';
                }
            })
        } else if (checkForm.value.checkType == 'email') {
            var button = e.currentTarget;
            button.disabled = true;
            sendVerifyEmail({
                email: email.value,
                scene: 'CheckIdentity'
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
                            button.innerText= '发送';
                        }
                    },1000)
                } else {
                    button.disabled = false; // 启用按钮
                    button.innerText= '发送';
                }
            })
        }
        
    }
    const onCheckBtnClick = ()=> {
        let params = {
            operation: props.operation,
            checkType: checkForm.value.checkType,
            code : checkForm.value.code
        }
        if (checkForm.value.checkType == 'password') {
            params.code = checkForm.value.password
        } else if (checkForm.value.checkType == 'mfa') {
            params.code = checkForm.value.mfaCode
        }
        checkIdentity(params).then(res => {
            if (!res.code) {
                message.success('校验通过');
                props.onSuccess();
                shouldCheckData.value.shouldCheck = false
            }
        });
    };
    const onCancelCheckBtnClick = ()=>{
        shouldCheckData.value.shouldCheck = false;
    };
    watchEffect(() => {
        console.log(props.operation,props.count)
        if (!props.operation) {
            return
        }
        shouldCheckIdentity({
            operation: props.operation
        }).then(res => {
            if(!res.code) {
                shouldCheckData.value = res.data
                checkForm.value.checkType = res.data.defaultCheckType
                console.log(shouldCheckData)
                if(!res.data.shouldCheck) {
                    props.onSuccess()
                    checkForm.value.code = null
                }
            }
        })
    })
</script>

<style lang='less' scoped>
    .input-wrapper {
        display: flex;
        align-items: center;
    }

    .input-field {
        margin-right: 0;
    }
</style>