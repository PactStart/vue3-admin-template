import request from "../utils/request";

/**
 * 添加角色
 */
 export const addRole = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/add", data });
};

/**
 * 分页查询角色
 */
 export const queryRole = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/page_query", data });
};


/**
 * 根据名称获取角色
 */
export const getRoleByName = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/get_by_name", data });
};


/**
 * 修改角色
 */
 export const updateRole = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/update", data });
};

/**
 * 删除角色
 */
 export const deleteRole = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/delete", data });
};

/**
 * 授予角色授予权限
 */
 export const bindPermissions = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/bind_permissions", data });
};

/**
 * 列出角色的权限树
 */
export const getPermissionTree = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/get_permission_tree", data });
};

/**
 * 角色绑定用户
 */
 export const bindUsers = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/bind_users", data });
};

/**
 * 角色解绑用户
 */
 export const unbindUsers = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/unbind_users", data });
};
