import request from "../utils/request";
/**
 * 账号密码登录接口
 */
export const loginByPassword = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/login_by_password", data });
};

/**
 * 手机验证码登录接口
 */
export const loginByPhone = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/login_by_phone", data });
};

/**
 * 退出登录接口
 */
 export const logout = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/logout", data });
};


/**
 * 获取用户信息接口
 */
export const getPersonalInfo = () => {
  return request({ method: "post", url: "/api/v1/sys/user/get_personal_info" });
};

/**
 * 添加用户
 */
 export const addUser = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/add", data });
};

/**
 * 查询用户
 */
 export const queryUser = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/page_query", data });
};

/**
 * 修改用户状态
 */
 export const updateUserStatus = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/update_status", data });
};

/**
 * 完善信息
 */
 export const perfectInfo = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/perfect_info", data });
};

/**
 * 修改密码（需要输入原密码）
 */
 export const updatePassword = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/update_password", data });
};

/**
 * 修改密码（先进行身份验证）
 */
export const changePassword = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/change_password", data });
};

/**
 * 重置密码
 */
export const resetPassword = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/reset_password", data });
};

/**
 * 发送验证邮件
 */
export const sendVerifyEmail = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/send_verify_email", data });
};

/**
 * 绑定邮箱
 */
export const bindEmail = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/bind_email", data });
};

/**
 * 绑定手机号
 */
export const bindPhone = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/bind_phone", data });
};

/**
 * 生成MFA设备
 */
export const generateMFA = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/generate_mfa_device", data });
};

/**
 * 绑定MFA设备
 */
export const bindMFA = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/bind_mfa_device", data });
};

/**
 * 解绑MFA设备
 */
export const unbindMFA = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/unbind_mfa_device", data });
};

/**
 * 切换是否开启二次验证
 */
export const switchEnableMFA = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/switch_enable_mfa", data });
};

/**
 * 是否应该校验身份
 */
export const shouldCheckIdentity = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/should_check_identity", data });
};

/**
 * 校验身份
 */
export const checkIdentity = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/check_identity", data });
};


/**
 * 获取微信授权链接
 */
export const getAuthorizeUrl = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/get_oauth2_url", data });
};


/**
 * 获取微信登录链接
 */
export const getWxLoginUrl = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/get_wechat_login_url", data });
};

/**
 * 获取微信登录结果
 */
export const getWxLoginResult = (data) => {
  return request({ method: "post", url: "/api/v1/sys/user/get_wechat_login_result", data });
};