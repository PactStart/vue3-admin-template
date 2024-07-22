export default [
  {
    path: "/home",
    name: "home",
    component: () => import("../views/Home.vue"),
    meta: {
      auth: true,
      title: "页面权限",
    },
    children: [
      {
        path: "/sys",
        name: "sys",
        meta: {
          auth: true,
          title: "系统管理",
          open: true,
          iconfont: 'icon-system'
        },
        children: [
          {
            path: "/sys/user/personnel_center",
            component: () => import("../views/sys/user/PersonnelCenter.vue"),
            meta: {
              auth: true,
              title: "个人中心",
              hideInMenu: true,
            },
          },
          {
            path: "/sys/user",
            name: "user",
            component: () => import("../views/sys/user/User.vue"),
            meta: {
              auth: true,
              title: "用户管理",
              icon: 'UserOutlined'
            },
          },
          {
            path: "/sys/role",
            name: "role",
            component: () => import("../views/sys/role/Role.vue"),
            meta: {
              auth: true,
              title: "角色管理",
              iconfont: 'icon-role'
            },
          },
          {
            path: "/sys/permission",
            name: "permission",
            component: () => import("../views/sys/permission/Permission.vue"),
            meta: {
              auth: true,
              title: "权限管理",
              icon: 'ApiOutlined'
            },
          },
          {
            path: "/sys/authorize",
            name: "authorize",
            component: () => import("../views/sys/authorize/Authorize.vue"),
            meta: {
              auth: true,
              title: "授权管理",
              icon: 'SafetyOutlined'
            },
          },
          {
            path: "/sys/config",
            name: "config",
            component: () => import("../views/sys/config/Config.vue"),
            meta: {
              auth: true,
              title: "系统配置",
              icon: 'SettingOutlined'
            },
          },
          {
            path: "/sys/dict",
            name: "dict",
            component: () => import("../views/sys/dict/Dict.vue"),
            meta: {
              auth: true,
              title: "数据字典",
              icon: 'DatabaseOutlined'
            },
          },
          {
            path: "/sys/sms",
            name: "sms",
            component: () => import("../views/sys/sms/Sms.vue"),
            meta: {
              auth: true,
              title: "短信记录",
              hideInMenu: true,
            },
          },
          {
            path: "/sys/weixin/authorizer",
            name: "authorizer",
            component: () => import("../views/sys/authorizer/Authorizer.vue"),
            meta: {
              auth: true,
              title: "授权公众号",
              hideInMenu: false,
              iconfont: 'icon-wechat',
            },
          },
        ],
      },
    ],
  },
];
