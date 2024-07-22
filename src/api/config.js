import request from "../utils/request";

/**
 * 添加配置
 */
export const addConfig = (data) => {
    return request({ method: "post", url: "/api/v1/sys/config/add", data });
};
  
/**
 * 分页查询配置
 */
export const queryConfig = (data) => {
    return request({ method: "post", url: "/api/v1/sys/config/page_query", data });
};
  
/**
 * 修改配置
 */
export const updateConfig = (data) => {
    return request({ method: "post", url: "/api/v1/sys/config/update", data });
};
  
/**
 * 删除配置
 */
export const deleteConfig = (data) => {
    return request({ method: "post", url: "/api/v1/sys/config/delete", data });
};

/**
 * 分页查询配置日志
 */
export const queryConfigLog = (data) => {
    return request({ method: "post", url: "/api/v1/sys/config/page_query_log", data });
};
