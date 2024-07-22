<template>
    <div>
        <a-card title="字典项">
            <template #extra>
                <a v-show="showAddBtn" @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="queryForm.keyword" style="width: 400px" placeholder="模糊搜索标签、描述" enter-button="查询" size="large"
                @search="handleQueryDictItem" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                        <span>
                            {{ record.status == 1 ? '正常': '禁用' }}
                        </span>
                    </template>
                    <template v-if="column.key === 'isDefault'">
                        <span>
                            {{ record.isDefault ? '是': '否' }}
                        </span>
                    </template>
                    <template v-if="column.key === 'createdAt'">
                        <span>
                            {{ formatTimestamp(record.createdAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a v-show="showEditBtn" @click="onEditClick(record)">编辑</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
        <a-drawer title="添加字典项" :width="500" :closable="true" :visible="showDictItemAddDrawer" :body-style="{ paddingBottom: '80px' }"
            :footer-style="{ textAlign: 'right' }" @close="onClose()">
            <DicItemtAdd :onSuccess="onSuccess" :dict="currentDict"/>
        </a-drawer>
        <a-drawer title="修改字典项" :width="500" :closable="true" :visible="showDictItemEditDrawer" :body-style="{ paddingBottom: '80px' }"
            :footer-style="{ textAlign: 'right' }" @close="onClose()">
            <DictItemEdit :onSuccess="onSuccess" :dictItem="currentSelectedDictItem"/>
        </a-drawer>
    </div>
</template>
<script setup>
import { queryDictItems} from '@/api/dict';
import { reactive, onMounted, ref, watchEffect, computed} from 'vue';
import { useStore } from 'vuex';
import { formatTimestamp } from '@/utils/time';
import { isContainsAny } from '@/utils/util';
import DicItemtAdd from './components/DictItemAdd.vue';
import DictItemEdit from './components/DictItemEdit.vue';
const store = useStore();

const props = defineProps({
    dict: Object,
});
const currentDict = props.dict
const dataSource = ref([]);
const columns = reactive([
{
        title: '标签',
        dataIndex: 'itemLabel',
        key: 'itemLabel',
    },
    {
        title: '值',
        dataIndex: 'itemValue',
        key: 'itemValue',
        ellipsis: true,
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
    },
    {
        title: '是否默认',
        dataIndex: 'isDefault',
        key: 'isDefault',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
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
    sortOrder: "desc"
})
const showDictItemAddDrawer = ref(false);
const showDictItemEditDrawer = ref(false);
const currentSelectedDictItem = ref({})

const showAddBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:dict:item:*','btn:dict:item:add')
});
const showEditBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:dict:item:*','btn:dict:item:edit')
});

const onAddClick = (record) => {
    currentSelectedDictItem.value = record
    showDictItemAddDrawer.value = true;
};
const onEditClick = (record) => {
    currentSelectedDictItem.value = record
    showDictItemEditDrawer.value = true;
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryDictItem();
}
const handleQueryDictItem = ()=> {
    queryDictItems({
        pageNum: pagination.value.current,
        pageSize: pagination.value.pageSize,
        dictName: props.dict.name,
        ...queryForm.value
    }).then(res => {
        if(!res.code) {
            dataSource.value = res.data.list;
            pagination.value.total = res.data.total;
        }
    })
};
const onClose = () => {
    showDictItemAddDrawer.value = false;
    showDictItemEditDrawer.value = false;
};
const onSuccess = () => {
    handleQueryDictItem();
    showDictItemAddDrawer.value = false;
    showDictItemEditDrawer.value = false;
};
onMounted(() => {
});
// 监听属性的变化并调用函数
watchEffect(() => {
    handleQueryDictItem();
});
</script>