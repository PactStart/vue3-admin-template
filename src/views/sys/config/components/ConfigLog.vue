<template>
    <div>
        <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'name'">
                        <span>
                            {{ props.config.name }}
                        </span>
                    </template>
                    <template v-if="column.key === 'createdAt'">
                        <span>
                            {{ formatTimestamp(record.createdAt) }}
                        </span>
                    </template>
                </template>
            </a-table>
    </div>
</template>
<script setup>
import { queryConfigLog} from '@/api/config';
import { reactive, onMounted, ref, watchEffect} from 'vue';
import { formatTimestamp } from '@/utils/time';

const props = defineProps({
    config: Object,
});
const dataSource = ref([]);
const columns = reactive([
{
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '旧值',
        dataIndex: 'oldValue',
        key: 'oldValue',
    },
    {
        title: '新值',
        dataIndex: 'newValue',
        key: 'newValue',
    },
    {
        title: '操作人',
        dataIndex: 'createdBy',
        key: 'createdBy',
    },
    {
        title: '操作时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
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
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryConfigLog();
}
const handleQueryConfigLog = ()=> {
    queryConfigLog({
        page: pagination.value.current,
        size: pagination.value.pageSize,
        configId: props.config.id
    }).then(res => {
        if(!res.code) {
            dataSource.value = res.data.list;
            pagination.value.total = res.data.total;
        }
    })
};
onMounted(() => {
    handleQueryConfigLog()
});
// 监听属性的变化并调用函数
watchEffect(() => {
    handleQueryConfigLog();
});
</script>