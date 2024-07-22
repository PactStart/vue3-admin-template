<template>
    <div>
        <a-card title="配置管理">
            <template #extra>
                <a v-show="showAddBtn" @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="queryForm.keyword" style="width: 400px" placeholder="模糊搜索配置名称、描述" enter-button="查询" size="large"
                @search="handleQueryConfig" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'valueType'">
                        <span>
                            {{ getDictLabel(record.valueType,valueTypeOptions) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'updatedAt'">
                        <span>
                            {{ formatTimestamp(record.updatedAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'createdAt'">
                        <span>
                            {{ formatTimestamp(record.createdAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <span>
                                <a v-show="showEditBtn" @click="onEditClick(record)">编辑</a>
                                <a-divider type="vertical" />
                                <a v-show="showDelBtn" @click="onDelClick(record)">删除</a>
                                <a-divider type="vertical" />
                                <a v-show="showLogDtn" @click="onLogBtnClick(record)">日志</a>
                            </span>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="添加配置" :width="500" :closable="true" :visible="showConfigAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose()">
        <ConfigAdd :onSuccess="onSuccess" />
    </a-drawer>
    <a-drawer title="修改配置" :width="500" :closable="true" :visible="showConfigEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose()">
        <ConfigEdit :onSuccess="onSuccess" :config="currentSelectedConfig"/>
    </a-drawer>
    <a-drawer title="日志" :width="800" :closable="true" :visible="showConfigLogDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose()">
        <ConfigLog :config="currentSelectedConfig"/>
    </a-drawer>
</template>
<script setup>
import { deleteConfig, queryConfig } from '@/api/config';
import { getDictItems} from '@/api/dict';
import {  Modal } from 'ant-design-vue';
import { ref, onMounted, reactive, computed, createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import ConfigAdd from './components/ConfigAdd.vue';
import { formatTimestamp } from '@/utils/time';
import { isContainsAny, getDictLabel } from '@/utils/util';
import { useStore } from 'vuex';
import ConfigEdit from './components/ConfigEdit.vue';
import ConfigLog from './components/ConfigLog.vue';
const store = useStore();
const showAddBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:config:*','btn:config:add')
});
const showEditBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:config:*','btn:config:edit')
});
const showDelBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:config:*','btn:config:del')
});
const showLogDtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:config:*','btn:config:query_log')
});


const dataSource = ref([]);
const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '数据类型',
        dataIndex: 'valueType',
        key: 'valueType',
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '配置名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '配置值',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: '创建人',
        dataIndex: 'createdBy',
        key: 'createdBy',
    },
    {
        title: '修改时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
    },
    {
        title: '修改人',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
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
const showConfigAddDrawer = ref(false);
const showConfigEditDrawer = ref(false);
const showConfigLogDrawer = ref(false);
const valueTypeOptions = ref([])
const currentSelectedConfig = ref({})

onMounted(() => {
    handleQueryConfig();
    getDictItems({name:"sys_config_value_type"}).then(res => {
        valueTypeOptions.value = res.data.list
    })
});
const handleQueryConfig = () => {
    queryConfig({
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
const onSuccess = () => {
    handleQueryConfig();
    showConfigAddDrawer.value = false;
    showConfigEditDrawer.value = false;
    showConfigLogDrawer.value = false;
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryConfig();
}
const onAddClick = () => {
    showConfigAddDrawer.value = true;
};
const onEditClick = (record) => {
    currentSelectedConfig.value = record
    showConfigEditDrawer.value = true;
}
const onLogBtnClick = (record) => {
    currentSelectedConfig.value = record
    showConfigLogDrawer.value = true;
}
const onDelClick = (record) => {
    Modal.confirm({
        title: '确定删除该配置吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteConfig({ id :record.id}).then((res) => {
                    if (!res.code) {
                        handleQueryConfig();
                        resolve();
                    }
                })
            }).catch(() => console.log('Oops errors!'));
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() { },
    });
};
const onClose = () => {
    showConfigAddDrawer.value = false;
    showConfigEditDrawer.value = false;
    showConfigLogDrawer.value = false;
}
</script>
<style lang='less' scoped>
    .search-wrapper {
        margin-bottom: 20px;
    }
</style>