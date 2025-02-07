<template>
    <div>
        <a-card title="角色管理">
            <template #extra>
                <a v-show="showAddBtn" @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="queryForm.keyword" style="width: 350px" placeholder="模糊搜索角色名" enter-button="查询" size="large"
                @search="handleQueryRole" />
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
                            <a v-show="showEditBtn" @click="onEditClick(record)">编辑</a>
                            <a-divider type="vertical" />
                            <a v-show="showDelBtn" style="color: red;" @click="onDelClick(record.id)">删除</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="添加角色" :width="500" :visible="showRoleAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('add')">
        <RoleAdd :onSuccess="onAddRoleSuccess" />
    </a-drawer>
    <a-drawer title="编辑角色" :width="500" :visible="showRoleEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('edit')">
        <RoleEdit :role="role" :onSubmit="handleUpdateRole" />
    </a-drawer>
</template>
<script setup>
import { queryRole, updateRole, deleteRole } from '@/api/role';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive, computed } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import RoleAdd from './components/RoleAdd.vue';
import RoleEdit from './components/RoleEdit.vue';
import { formatTimestamp } from '@/utils/time';
import { isContainsAny } from '@/utils/util';
import { useStore } from 'vuex';
const store = useStore();
const showAddBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:role:*','btn:role:add')
});
const showDelBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:role:*','btn:role:delete')
});
const showEditBtn = computed(() => {
    return store.state.user.superAdmin || isContainsAny(store.state.permissions,'btn:*','btn:role:*','btn:role:edit')
});

const dataSource = ref([]);
const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '角色名',
        dataIndex: 'name',
        key: 'rolename',
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
        title: '修改者',
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
    keyword: null
});
const showRoleAddDrawer = ref(false);
const showRoleEditDrawer = ref(false);
const role = ref({});

onMounted(() => {
    handleQueryRole();
});
const handleQueryRole = () => {
    queryRole({
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
const onAddRoleSuccess = (role) => {
    message.success('添加成功');
    handleQueryRole();
    showRoleAddDrawer.value = false;
}
const handleUpdateRole = (role) => {
    updateRole(role).then(res => {
        if (!res.code) {
            message.success('修改成功');
            handleQueryRole();
            showRoleEditDrawer.value = false;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryRole();
}
const onAddClick = () => {
    showRoleAddDrawer.value = true;
};
const onEditClick = (record) => {
    showRoleEditDrawer.value = true;
    role.value = record;
};
const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该角色吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteRole({ id }).then((res) => {
                    if (!res.code) {
                        handleQueryRole();
                        resolve();
                    }
                })
            }).catch(() => console.log('Oops errors!'));
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() { },
    });
};
const onClose = (type) => {
    if (type === 'add') {
        showRoleAddDrawer.value = false;
    } else {
        showRoleEditDrawer.value = false;
    }
}
</script>
<style lang='less' scoped>
    .search-wrapper {
        margin-bottom: 20px;
    }
</style>