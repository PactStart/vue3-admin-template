import request from "../utils/request";

/**
 * 添加权限
 */
 export const addPermission = (data) => {
  return request({ method: "post", url: "/api/v1/sys/permission/add", data });
};

/**
 * 分页查询权限
 */
 export const queryPermission = (data) => {
  return request({ method: "post", url: "/api/v1/sys/permission/page_query", data });
};

/**
 * 修改权限
 */
 export const updatePermission = (data) => {
  return request({ method: "post", url: "/api/v1/sys/permission/update", data });
};

/**
 * 删除权限
 */
 export const deletePermission = (data) => {
  return request({ method: "post", url: "/api/v1/sys/permission/delete", data });
};


/**
 * 批量导入权限
 */
 export const batchImportPermission = (data) => {
  return request({ method: "post", url: "/api/v1/sys/permission/batch_import", data });
};


/**
 * 获取权限树
 */
export const getTree = (data) => {
  return request({ method: "post", url: "/api/v1/sys/role/get_tree", data });
};