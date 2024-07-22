import request from "../utils/request";
/**
 * 查询短信记录
 */
export const querySmsLog = (data) => {
    return request({ method: "post", url: "/api/v1/sys/sms/page_query", data });
};

/**
 * 发送短信
 */
export const sendSms = (data) => {
    return request({ method: "post", url: "/api/v1/sys/sms/send", data });
};

/**
 * 发送短信
 */
export const sendSmsToMySelf = (data) => {
    return request({ method: "post", url: "/api/v1/sys/sms/send_to_myself", data });
};