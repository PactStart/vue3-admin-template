<template>
    <div>
        <a-card title="短信发送记录">
            <div class="search-wrapper">
                <a-form>
                    <a-row :gutter="24">
                        <a-col :span="4">
                            <a-form-item label="短信模板" name="templateCode">
                                <a-select v-model:value= "queryForm.templateCode"  size="large" allowClear>
                                    <a-select-option  v-for="option in templateCodeOptions" :key="option.itemValue" :value="option.itemValue" >
                                    {{ option.itemLabel }}
                                </a-select-option>
                            </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="发送状态" name="status">
                                <a-select v-model:value= "queryForm.status"  size="large" allowClear>
                                    <a-select-option  v-for="option in statusOptions" :key="option.itemValue" :value="option.itemValue" >
                                    {{ option.itemLabel }}
                                </a-select-option>
                            </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col>
                            <a-form-item label="发送时间范围" style="width: 500px" name="dateRange">
                                <a-range-picker
                                    v-model:value="queryForm.dateRange"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    :showTime="true"
                                    size="large"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="5">
                            <a-form-item label="手机号" name="phone">
                                <a-input-search v-model:value="queryForm.phone" style="width: 350px" placeholder="手机号"
                                    enter-button="查询" @search="handleQuerySmsLog" size="large"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                        <span>
                            {{ getDictLabel(record.status,statusOptions) }}
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
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup>
import { querySmsLog } from '@/api/sms';
import { batchGetDictItems } from '@/api/dict';
import { ref, onMounted, createVNode, reactive, computed } from 'vue';
import { formatTimestamp } from '@/utils/time';
import { getDictLabel } from '@/utils/util';
import { useStore } from 'vuex';
const store = useStore();

const dataSource = ref([]);
const statusOptions = ref([]);
const templateCodeOptions = ref([]);

const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '场景',
        dataIndex: 'scene',
        key: 'scene',
    },
    {
        title: '模板',
        dataIndex: 'templateCode',
        key: 'templateCode',
    },
    {
        title: '服务商',
        dataIndex: 'vendor',
        key: 'vendor',
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
    },
    {
        title: '发送时间',
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
const queryForm = ref({
    status: null,
    phone: null,
    dateRange: [],
    idOrder: "desc"
});

onMounted(() => {
    handleQuerySmsLog();
    batchGetDictItems({
        names: ["sys_sms_log_status","sys_sms_log_template_code"]
    }).then(res => {
        statusOptions.value = res.data["sys_sms_log_status"]
        templateCodeOptions.value = res.data["sys_sms_log_template_code"]
    })
});
const handleQuerySmsLog = () => {
    console.log(queryForm.value)
    let params = {
        pageNum: pagination.value.current,
        pageSize: pagination.value.pageSize,
        status: queryForm.value.status,
        phone: queryForm.value.phone,
        idOrder: queryForm.value.idOrder
    }
    if(queryForm.value.dateRange && queryForm.value.dateRange.length == 2) {
        params.createdAtStart = queryForm.value.dateRange[0].valueOf()
        params.createdAtEnd = queryForm.value.dateRange[1].valueOf()
    }
    querySmsLog(params).then(res => {
        if(!res.code) {
            dataSource.value = res.data.list;
            pagination.value.total = res.data.total;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQuerySmsLog();
}
</script>
<style lang='less' scoped>
    .search-wrapper {
        margin-bottom: 20px;
    }
</style>