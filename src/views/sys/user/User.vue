<template>
    <div>
        <a-card title="用户管理">
            <template #extra>
                <a v-show="showAddBtn" @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="queryForm.keyword" style="width: 400px" placeholder="模糊搜索昵称、用户名、手机号、邮箱" enter-button="查询" size="large"
                @search="handleQueryUser" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                        <span>
                            {{ record.status == 1 ? '正常' : '禁用' }}
                        </span>
                    </template>
                    <template v-if="column.key === 'wechat'">
                        <span>
                            {{ record.wechat }} {{ record.wechatNickname ? '('+record.wechatNickname+')' : ''}}
                        </span>
                    </template>
                    <template v-if="column.key === 'lastLoginTime'">
                        <span>
                            {{ formatTimestamp(record.lastLoginTime) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'createdAt'">
                        <span>
                            {{ formatTimestamp(record.createdAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a v-show="showRestPwdBtn" @click="onResetPwdBtnClick(record.id)">重置密码</a>
                            <a-divider type="vertical" />
                            <a v-if="showActiveBtn && record.status == 1 && !record.superAdmin" @click="onDisableBtnClick(record.id)">禁用</a>
                            <a v-if="showDisableBtn && record.status == 2" @click="onActiveBtnClick(record.id)">启用</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="添加用户" :width="500" :visible="showUserAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose()">
        <UserAdd :onSuccess="onAddUserSuccess" />
    </a-drawer>
    <a-modal v-model:visible="showResetPwdModal" title="重置密码" @ok="onResetPwdConfirmClick" ok-text="提交"
        cancel-text="取消">
        <span>
            <WarningOutlined />系统将给该用户生成新的随机密码，建议用户登录后自行修改密码
        </span>
    </a-modal>
</template>
<script setup>
import { queryUser, resetPassword, updateUserStatus } from '@/api/user';
import { message, Modal } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, createVNode, reactive, computed } from 'vue';
import UserAdd from './components/UserAdd.vue';
import { formatTimestamp } from '@/utils/time';
import { isContainsAny } from '@/utils/util';
import { useStore } from 'vuex';
const store = useStore();
const showAddBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:user:*','btn:user:add')
});
const showActiveBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:user:*','btn:user:active')
});
const showDisableBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:user:*','btn:user:disable')
});
const showRestPwdBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:user:*','btn:user:resetPassword')
});

const dataSource = ref([]);
const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
    },
    {
        title: '邮箱',
        dataIndex: 'mail',
        key: 'mail',
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '微信',
        dataIndex: 'wechat',
        key: 'wechat',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '上次登录时间',
        dataIndex: 'lastLoginTime',
        key: 'lastLoginTime',
    },
    {
        title: '上次登录ip',
        dataIndex: 'lastLoginIp',
        key: 'lastLoginIp',
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: '操作',
        key: 'action',
    }
]);
const pagination = ref({
    position: ['bottomRight'],
    showSizeChanger: true,
    showTotal: (total, range) => {
        return '总共' + total + '条'
    },
    current: 1,
    pageSize: 10,
    total: 0
});
const queryForm = ref({
    keyword: null,
    idOrder: "desc"
});
const showUserAddDrawer = ref(false);
const showResetPwdModal = ref(false);
const resetPwdForm = ref({
    id: null
})

onMounted(() => {
    handleQueryUser();
});
const handleQueryUser = () => {
    queryUser({
        pageNum: pagination.value.current,
        pageSize: pagination.value.pageSize,
        ...queryForm.value
    }).then(res => {
        if(!res.code) {
            dataSource.value = res.data.list;
            pagination.value.total = res.data.total;
        }
    });
}
const onAddUserSuccess = (user) => {
    handleQueryUser();
    showUserAddDrawer.value = false;
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryUser();
}
const onAddClick = () => {
    showUserAddDrawer.value = true;
};
const onResetPwdBtnClick = (id) => {
    showResetPwdModal.value = true;
    resetPwdForm.value.id = id;
};
const onDisableBtnClick = (id) => {
    Modal.confirm({
        title: '确定禁用吗?',
        icon: createVNode(WarningOutlined),
        content: '禁用后该用户会下线，且无法再登录',
        onOk() {
            return new Promise((resolve, reject) => {
                updateUserStatus({ id: id, status: 2}).then((res) => {
                    if (!res.code) {
                        message.success("禁用成功")
                        handleQueryUser();
                        resolve();
                    }
                })
            }).catch(() => console.log('Oops errors!'));
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() { },
    });
};
const onActiveBtnClick = (id) => {
    updateUserStatus({ id: id, status: 1}).then((res) => {
        if (!res.code) {
            message.success("启用成功")
            handleQueryUser();
        }
    })
};
const onResetPwdConfirmClick = () => {
    resetPassword(resetPwdForm.value).then(res => {
        if (!res.code) {
            showResetPwdModal.value = false;
            resetPwdForm.value.id = null
            message.success('重置成功,新的密码为: ' + res.data.newPassword,30,() => {
                console.log('关闭后的回调函数');
            });
        }
    });
}

const onClose = () => {
    showUserAddDrawer.value = false;
}
</script>
<style lang='less' scoped>
    .search-wrapper {
        margin-bottom: 20px;
    }
</style>