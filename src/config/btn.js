
export default [
    {
        name: 'btn:user:*',
        description: '所有用户操作按钮',
        children: [
            {
                name: 'btn:user:add',
                description: '添加用户按钮',
            },
            {
                name: 'btn:user:edit',
                description: '编辑用户按钮',
            },
            {
                name: 'btn:user:delete',
                description: '删除用户按钮',
            },
            {
                name: 'btn:user:resetPassword',
                description: '重置用户密码',
            }
        ]
    },
    {
        name: 'btn:role:*',
        description: '所有角色操作按钮',
        children: [
            {
                name: 'btn:role:add',
                description: '添加角色按钮',
            },
            {
                name: 'btn:role:edit',
                description: '编辑角色按钮',
            },
            {
                name: 'btn:role:delete',
                description: '删除角色按钮',
            }
        ]
    },
    {
        name: 'btn:permission:*',
        description: '所有权限操作按钮',
        children: [
            {
                name: 'btn:permission:add',
                description: '添加权限按钮',
            },
            {
                name: 'btn:permission:edit',
                description: '编辑权限按钮',
            },
            {
                name: 'btn:permission:del',
                description: '删除权限按钮',
            }
        ]
    },
    {
        name: 'btn:authorize:*',
        description: '所有授权操作按钮',
        children: [
            {
                name: 'btn:authorize:bindRoleAndUsers',
                description: '绑定用户和角色按钮',
            },
            {
                name: 'btn:authorize:unbindRoleAndUsers',
                description: '解绑用户和角色按钮',
            },{
                name: 'btn:authorize:roleAndPermissions',
                description: '绑定角色和权限按钮',
            },
        ]
    },
    {
        name: 'btn:config:*',
        description: '所有配置操作按钮',
        children: [
            {
                name: 'btn:config:add',
                description: '添加配置按钮',
            },
            {
                name: 'btn:config:edit',
                description: '编辑配置按钮',
            },
            {
                name: 'btn:config:del',
                description: '删除配置按钮',
            },
            {
                name: 'btn:config:query_log',
                description: '查看配置变更记录按钮',
            }
        ]
    },
    {
        name: 'btn:dict:*',
        description: '所有字典操作按钮',
        children: [
            {
                name: 'btn:dict:add',
                description: '添加字典按钮',
            },
            {
                name: 'btn:dict:edit',
                description: '编辑字典按钮',
            },
            {
                name: 'btn:dict:del',
                description: '删除字典按钮',
            },
            {
                name: 'btn:dict:detail',
                description: '字典字典按钮',
            },
        ]
    },
    {
        name: 'btn:dict:item:*',
        description: '所有字典项操作按钮',
        children: [
            {
                name: 'btn:dict:item:add',
                description: '添加字典项按钮',
            },
            {
                name: 'btn:dict:item:edit',
                description: '编辑字典项按钮',
            }
        ]
    },
    {
        name: 'btn:resume:*',
        description: '所有简历操作按钮',
        children: [
            {
                name: 'btn:resume:add',
                description: '添加简历按钮',
            },
            {
                name: 'btn:resume:edit',
                description: '编辑简历按钮',
            },
            {
                name: 'btn:resume:chat',
                description: '聊天按钮',
            },
            {
                name: 'btn:resume:detail',
                description: '简历详情按钮',
            },
            {
                name: 'btn:resume:completeness:save',
                description: '保存简历完善度',
            },
        ]
    },
    {
        name: 'btn:order:*',
        description: '所有订单操作按钮',
        children: [
            {
                name: 'btn:order:add',
                description: '添加订单按钮',
            },
            {
                name: 'btn:order:edit',
                description: '编辑订单按钮',
            },
            {
                name: 'btn:order:detail',
                description: '订单详情按钮',
            },
        ]
    },
    {
        name: 'btn:match:group:*',
        description: '所有匹配组操作按钮',
        children: [
            {
                name: 'btn:match:group:add',
                description: '添加匹配组按钮',
            },
            {
                name: 'btn:match:group:edit',
                description: '编辑匹配组按钮',
            },
            {
                name: 'btn:match:group:del',
                description: '删除匹配组按钮',
            },
        ]
    },
    {
        name: 'btn:match:item:*',
        description: '所有匹配项操作按钮',
        children: [
            {
                name: 'btn:match:item:add',
                description: '添加匹配项按钮',
            },
            {
                name: 'btn:match:item:edit',
                description: '编辑匹配项按钮',
            },
            {
                name: 'btn:match:item:del',
                description: '删除匹配项按钮',
            },
        ]
    },
    {
        name: 'btn:match:rule:*',
        description: '所有匹配规则操作按钮',
        children: [
            {
                name: 'btn:match:rule:add',
                description: '添加匹配规则按钮',
            },
            {
                name: 'btn:match:rule:edit',
                description: '编辑匹配规则按钮',
            },
            {
                name: 'btn:match:rule:del',
                description: '删除匹配规则按钮',
            },
        ]
    },
]