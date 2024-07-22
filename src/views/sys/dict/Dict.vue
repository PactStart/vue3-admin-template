<template>
    <div>
        <a-card title="字典管理">
            <template #extra>
                <a v-show="showAddBtn" @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="queryForm.keyword" style="width: 400px" placeholder="模糊搜类型、标签、描述等" enter-button="查询" size="large"
                @search="handleQueryDict" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'createdAt'">
                        <span>
                            {{ formatTimestamp(record.createdAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'updatedAt'">
                        <span>
                            {{ formatTimestamp(record.updatedAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <span>
                                <a v-show="showEditBtn" @click="onEditClick(record)">编辑</a>
                                <a-divider type="vertical" />
                                <a v-show="showDelBtn" @click="onDelClick(record)">删除</a>
                                <a-divider type="vertical" />
                                <a v-show="showDetailDtn" @click="onDetailClick(record)">详情</a>
                            </span>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="添加字典类型" :width="500" :closable="true" :visible="showDictAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose()">
        <DictAdd :onSuccess="onSuccess" />
    </a-drawer>
    <a-drawer title="修改字典类型" :width="500" :closable="true" :visible="showDictEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose()">
        <DictEdit :onSuccess="onSuccess" :dict="currentSelectedDict"/>
    </a-drawer>
    <a-drawer title="字典详情" :width="1000" :closable="true" :visible="showDictDetailDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose()">
        <DictDetail :dict="currentSelectedDict"/>
    </a-drawer>
</template>

<script setup>
import { queryDict,deleteDict } from '@/api/dict';
import { ref, onMounted, createVNode, reactive, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { formatTimestamp } from '@/utils/time';
import { useStore } from 'vuex';
import DictAdd from './components/DictAdd.vue';
import DictEdit from './components/DictEdit.vue';
import DictDetail from './DictDetail.vue';
import { isContainsAny } from '@/utils/util';
const store = useStore();

const showAddBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:dict:*','btn:dict:add')
});
const showEditBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:dict:*','btn:dict:edit')
});
const showDelBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:dict:*','btn:dict:del')
});
const showDetailDtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:dict:*','btn:dict:detail')
});

const dataSource = ref([]);
const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '类型',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '标签',
        dataIndex: 'label',
        key: 'label',
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
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
const showDictAddDrawer = ref(false);
const showDictEditDrawer = ref(false);
const showDictDetailDrawer = ref(false);
const currentSelectedDict = ref({})

onMounted(() => {
    handleQueryDict();
});
const handleQueryDict = () => {
    queryDict({
        pageNum: pagination.value.current,
        pageSize: pagination.value.pageSize,
        dictIdOrder: "desc",
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
    handleQueryDict();
}
const onSuccess = () => {
    handleQueryDict();
    showDictAddDrawer.value = false;
    showDictEditDrawer.value = false;
    showDictDetailDrawer.value = false;
}
const onAddClick = () => {
    showDictAddDrawer.value = true;
};
const onEditClick = (record) => {
    currentSelectedDict.value = record
    showDictEditDrawer.value = true;
}
const onDetailClick = (record) => {
    currentSelectedDict.value = record
    showDictDetailDrawer.value = true;
}
const onDelClick = (record) => {
    Modal.confirm({
        title: '确定删除该字典类型吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteDict({ id :record.id}).then((res) => {
                    if (!res.code) {
                        handleQueryDict();
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
    showDictAddDrawer.value = false;
    showDictEditDrawer.value = false;
    showDictDetailDrawer.value = false;
}
</script>
<style lang='less' scoped>
    .search-wrapper {
        margin-bottom: 20px;
    }
</style>./DictDetail.vue