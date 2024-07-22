import request from "../utils/request";

/**
 * 添加字典
 */
export const addDict = (data) => {
    return request({ method: "post", url: "/api/v1/sys/dict/add", data });
};
  
/**
 * 分页查询字典
 */
export const queryDict = (data) => {
    return request({ method: "post", url: "/api/v1/sys/dict/page_query", data });
};
  
/**
 * 修改字典
 */
export const updateDict = (data) => {
    return request({ method: "post", url: "/api/v1/sys/dict/update", data });
};
  
/**
 * 删除字典
 */
export const deleteDict = (data) => {
    return request({ method: "post", url: "/api/v1/sys/dict/delete", data });
};

/**
 * 添加字典项
 */
export const addDictItem = (data) => {
    return request({ method: "post", url: "/api/v1/sys/dict/item/add", data });
};

/**
 * 修改字典项
 */
export const updateDictItem = (data) => {
    return request({ method: "post", url: "/api/v1/sys/dict/item/update", data });
};

/**
 * 获取字典项目
 */
export const getDictItems = (data) => {
    return request({ method: "post", url: "/api/v1/sys/dict/item/get_by_name", data });
};

/**
 * 批量获取字典项目
 */
export const batchGetDictItems = (data) => {
    return request({ method: "post", url: "/api/v1/sys/dict/item/batch_get_by_names", data });
};

/**
 * 分页查询字典项目
 */
export const queryDictItems = (data) => {
    return request({ method: "post", url: "/api/v1/sys/dict/item/page_query", data });
};


