import request from "../utils/request";

/**
 * 分页查询授权方
 */
export const queryAuthorizer = (data) => {
    return request({ method: "post", url: "/api/v1/wx/authorizer/page_query", data });
};

/**
 * 同步授权方信息
 */
export const syncAuthorizerInfo = (data) => {
    return request({ method: "post", url: "/api/v1/wx/authorizer/sync_info", data });
};

/**
 * 获取授权链接
 */
export const getAuthorizeUrl = (data) => {
    return request({ method: "post", url: "/api/v1/wx/authorizer/get_authorize_url", data });
};


/**
 * 获取所有的客服
 */
export const getAllKfAccounts = (data) => {
    return request({ method: "post", url: "/api/v1/wx/authorizer/get_all_kf_accounts", data });
}

/**
 * 创建客服
 */
export const createKfAccount = (data) => {
    return request({ method: "post", url: "/api/v1/wx/authorizer/create_kf_account", data });
}

/**
 * 删除客服
 */
export const deleteKfAccount = (data) => {
    return request({ method: "post", url: "/api/v1/wx/authorizer/delete_kf_account", data });
}

/**
 * 清空菜单
 */
export const clearMenus = (data) => {
    return request({ method: "post", url: "/api/v1/wx/authorizer/delete_menu", data });
}