<template>
    <div>
        <a-card title="授权公众号">
            <template #extra>
                <a-button type="primary" @click="onAuthorizeClick" size="large">授权</a-button>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="queryForm.keyword" style="width: 350px" placeholder="公众号名称或认证主体模糊搜索" enter-button="查询" size="large"
                @search="handleQueryAuthorizer" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'headImg'">
                        <span>
                            <a-avatar size="large" :src="record.headImg" />
                        </span>
                    </template>
                    <template v-if="column.key === 'qrcodeUrl'">
                        <a @click="onViewAurhtorizerQrCodeClick(record.qrcodeUrl)">查看</a>
                    </template>
                    <template v-if="column.key === 'createdAt'">
                        <span>
                            {{ formatTimestamp(record.createdAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a @click="onSyncInfoClick(record)">同步</a>
                            <a-divider type="vertical" />
                            <a @click="onKfManageClick(record)">客服管理</a>
                            <a-divider type="vertical" />
                            <a @click="onClearMenuClick(record)">清空菜单</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-modal title="公众号二维码" :width="350" :visible="showQrCodeModal" :onOk="closeQRCodeModal" :onCancel="closeQRCodeModal">
       <img :src="authorizerQrCode" style="width:100%" />
    </a-modal>
    <a-modal title="微信扫码授权" :width="500" :visible="showScanQRCodeModal" :onOk="closeScanQRCodeModal" :onCancel="closeScanQRCodeModal">
        <a-row type="flex" justify="space-around">
            <vue-qrcode :value="authorizeInfo.url" :options="{ width: 300 }"></vue-qrcode>
        </a-row>
        <a-row type="flex" justify="space-around">请使用服务号管理员的微信扫码上方二维码，选择微信服务号进行授权</a-row>
    </a-modal>
    <a-modal title="创建客服" :width="500" :visible="showCreateKfModal" :onOk="handleCreateKf" :onCancel="closeCreateKfModal">
        <a-form :model="kfForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
        @finish="handleCreateKf" @finishFailed="onFinishFailed">
        <a-form-item label="客服账号" name="account"
            :rules="[{ required: true, message: 'Please input account!' }]">
            <a-input v-model:value="kfForm.account" />
        </a-form-item>
        <a-form-item label="客服昵称" name="nickname"
            :rules="[{ required: true, message: 'Please input nickname!' }]">
            <a-textarea v-model:value="kfForm.nickname" :rows="4" placeholder="限制50个字符" :maxlength="50" />
        </a-form-item>
    </a-form>
    </a-modal>
    <a-drawer title="客服列表" :width="500" :visible="showKfListDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="closeKfListDrawer()">
        <template #extra>
            <a @click="onCreateKfClick">创建客服</a>
        </template>
        <a-list itemLayout="horizontal" :dataSource="kfList">
            <template #renderItem="{ item }" >
                <a-list-item>
                    <template #actions>
                        <a @click="onKfDeleteClick(item)">删除</a>
                    </template>
                    <a-list-item-meta :title="item.kf_account" :description="item.kf_nick">
                        <template #avatar>
                            <a-avatar :src="item.kf_headimgurl" />
                        </template>
                    </a-list-item-meta>
                    <div>{{ item.kf_wx }}</div>
                </a-list-item>
            </template>
        </a-list>
    </a-drawer>
</template>
<script setup>
import { queryAuthorizer,getAuthorizeUrl,syncAuthorizerInfo,getAllKfAccounts,createKfAccount,deleteKfAccount,clearMenus } from '@/api/authorizer';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive, computed } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { formatTimestamp } from '@/utils/time';
import { isContainsAny } from '@/utils/util';
import { useStore } from 'vuex';
const store = useStore();

const dataSource = ref([]);
const columns = reactive([
    {
        title: 'appId',
        dataIndex: 'authorizerAppid',
        key: 'authorizerAppid',
    },
    {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
    },
    {
        title: '头像',
        dataIndex: 'headImg',
        key: 'headImg',
    },
    {
        title: '原始ID',
        dataIndex: 'userName',
        key: 'userName',
    },
    // {
    //     title: '二维码',
    //     dataIndex: 'qrcodeUrl',
    //     key: 'qrcodeUrl',
    // },
    // {
    //     title: '服务类型',
    //     dataIndex: 'serviceType',
    //     key: 'serviceType',
    // },
    // {
    //     title: '认证类型',
    //     dataIndex: 'verifyType',
    //     key: 'verifyType',
    // },
    {
        title: '主体名称',
        dataIndex: 'principalName',
        key: 'principalName',
    },
    {
        title: '授权时间',
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
    keyword: null
});

onMounted(() => {
    handleQueryAuthorizer();
});
const handleQueryAuthorizer = () => {
    queryAuthorizer({
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

const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryAuthorizer();
}

const onSyncInfoClick = record => {
    syncAuthorizerInfo({id: record.id}).then(res => {
        if(!res.code) {
            message.success('同步成功')
            handleQueryAuthorizer()
        }
    })
}

const showQrCodeModal = ref(false)
const authorizerQrCode = ref("")
const onViewAurhtorizerQrCodeClick = url => {
    authorizerQrCode.value = url;
    console.log(authorizerQrCode.value)
    showQrCodeModal.value = true;
}
const closeQRCodeModal = () => {
    showQrCodeModal.value = false;
}

const showScanQRCodeModal = ref(false)
const authorizeInfo = ref({})
const onAuthorizeClick = () => {
    getAuthorizeUrl().then(res => {
        if(!res.code) {
            authorizeInfo.value = res.data
            showScanQRCodeModal.value = true;
        }
    })
}
const closeScanQRCodeModal = () => {
    showScanQRCodeModal.value = false;
}

const kfList = ref([])
const showKfListDrawer = ref(false)
const appId = ref(null)
const onKfManageClick = (record) => {
    appId.value = record.authorizerAppid
    handleGetAllKfAccounts()
}

const handleGetAllKfAccounts = () => {
    getAllKfAccounts({
        appId: appId.value
    }).then(res => {
        if(!res.code) {
            kfList.value = res.data.kf_list
            showKfListDrawer.value = true
        } else if(res.code == 65400) {
            message.error('公众号尚未开通客服功能，请管理员或者运营人员登录微信公众平台后台开通',10)
        }
    })
}

const onKfDeleteClick = (item) => {
    deleteKfAccount({
        appId: appId.value,
        account: item.kf_account
    }).then(res => {
        if(!res.code) {
            message.success('删除成功')
            handleGetAllKfAccounts()
        }
    })
}

const closeKfListDrawer = () => {
    showKfListDrawer.value = false
}

const kfForm = ref({})
const showCreateKfModal = ref(false)
const onCreateKfClick = () => {
    showCreateKfModal.value = true
}
const handleCreateKf = () => {
    createKfAccount({
        ...kfForm.value,
        appId: appId.value,
    }).then(res => {
        if(!res.code) {
            message.success('创建成功')
            handleGetAllKfAccounts()
            showCreateKfModal.value = false
        }
    })
}

const closeCreateKfModal = () => {
    showCreateKfModal.value = false
}

const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};

const onClearMenuClick = (record) => {
    console.log(record)
    clearMenus({
        appId: record.authorizerAppid
    }).then(res => {
        if(!res.code) {
            message.success('菜单已清空')
        }
    })
}

</script>
<style lang='less' scoped>
    .search-wrapper {
        margin-bottom: 20px;
    }
</style>