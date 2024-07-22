<template>
    <a-layout>
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible style="background: #fff; padding: 0">
            <div class="logo-con">
                    <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
                    <img v-show="collapsed" :src="minLogo" key="min-logo" />
                </div>
            <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="light" mode="inline">
                <template v-for="route of availRoutes">
                    <RouteMenu :route="route" />
                </template> 
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
               <div class="header">
                    <span class="header_left">
                        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                    </span>
                    <span class="header_right">
                        <span style="padding-right: 12px;">{{ greetingText }}</span>
                        <a-dropdown placement="bottomRight">
                            <a class="ant-dropdown-link" @click.prevent>
                                <a-avatar style="background-color: #87d068" :src="user.avatar" >
                                    <template #icon>
                                        <user-outlined />
                                    </template>
                                </a-avatar>
                            </a>
                            <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a href="javascript:;" @click="goToPersonelCenter">个人中心</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;" @click="onUpdatePwdClick">修改密码</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;" @click="handleLogout">退出登录</a>
                                </a-menu-item>
                            </a-menu>
                            </template>
                        </a-dropdown>
                    </span>
               </div>
            </a-layout-header>
            <a-layout-content :style="{ padding: '0px', background: '#fff', minHeight: '850px' }">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
    <a-modal v-model:visible="showUpdatePwdModal" title="修改密码" @ok="handleUpdatePwd" ok-text="提交"
        cancel-text="取消">
        <a-form :model="updatePwdForm" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
            autocomplete="off">
            <a-form-item label="密码" name="oldPassword" :rules="[{ required: true, message: 'Please input oldPassword!' }]">
                <a-input-password v-model:value="updatePwdForm.oldPassword" />
            </a-form-item>
            <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, message: 'Please input newPassword!' }]">
                <a-input-password v-model:value="updatePwdForm.newPassword" />
            </a-form-item>

            <a-form-item label="确认新密码" name="confirmNewPassword"
                :rules="[{ required: true, message: 'Please input confirmNewPassword!' }]">
                <a-input-password v-model:value="updatePwdForm.confirmNewPassword" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup>
import {logout,getPersonalInfo, updatePassword}  from '@/api/user';
import router from '@/router';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {ref, computed } from 'vue';
import RouteMenu from "../components/RouteMenu.vue";
import menuRoutes from "../router/home";
import { useStore } from 'vuex';
import {getAvailRoutes, getGreeting} from '@/utils/util';
import minLogo from "@/assets/img/logo.png";
import maxLogo from "@/assets/img/maxlogo.png";

const selectedKeys = ref(['sys']);
const openKeys = ref(['sys','edu','weixin','jz']);
const collapsed = ref(false);

const store = useStore();

const greetingText = computed(() => {
    return getGreeting(store.state.user.nickname)
});

const user = ref({})
getPersonalInfo().then(res => {
    if(!res.code) {
        user.value = res.data.user
        store.commit('setUser',res.data.user);
        store.commit('setRoles',res.data.roles);
        store.commit('setPermissions',res.data.permissions);
    }
});

const availRoutes = computed(() => {
    const clonedMenuRoutes = JSON.parse(JSON.stringify(menuRoutes));
    return store.state.user.superAdmin ? clonedMenuRoutes[0].children : getAvailRoutes(clonedMenuRoutes[0].children,store.state.permissions);
})

const handleLogout = () => {
    logout({}).then(res => {
        if(!res.code) {
            message.success('退出成功');
            localStorage.removeItem('token');
            router.push('/login');
        }
    })
};

const showUpdatePwdModal = ref(false);
const updatePwdForm = ref({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
});

const onUpdatePwdClick = () => {
    showUpdatePwdModal.value = true;
};

const handleUpdatePwd = () => {
    if(updatePwdForm.value.newPassword != updatePwdForm.value.confirmNewPassword) {
        message.error('两次密码输入不一致')
    }
    updatePassword({
        ...updatePwdForm.value
    }).then(res => {
        if(!res.code) {
            message.success('修改密码成功');
            showUpdatePwdModal.value = false;
        }
    })
}
const goToPersonelCenter = () => {
    router.push('/sys/user/personnel_center');
};
</script >
<style lang='less' scoped>
.logo {
    height: 32px;
    line-height: 32px;
    margin: 16px;
    // background: #1890ff;
    text-align: center;
}

.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.header {
    position: relative;
    .header_left {
        float: left;
    }
    .header_right {
        float: right;
        margin-right: 32px;
    }
}
.header::after {
    content: ".";
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
    clear: both;
    overflow: hidden;
}
.logo-con {
    height: 64px;
    padding: 10px;
    img {
        height: 44px;
        width: auto;
        display: block;
        margin: 0 auto;
    }
}
</style>