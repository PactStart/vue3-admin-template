import router from "@/router/index";
import axios from "axios";
import { message } from "ant-design-vue";
/**
 * 创建axios实例
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: "3000",
});

/**
 * 请求拦截
 */
service.interceptors.request.use((config) => {
  if (config.url.indexOf("login") < 0) {
    config.headers.token = localStorage.getItem("token");
  }
  return config;
});

/**
 * 响应拦截
 */
service.interceptors.response.use(
  (res) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const { code, msg } = res.data;
    if (code === 0) {
      return res.data;
    } else {
      message.error(msg);
      if (code == 401 || (code >= 1501 && code <= 1507)) {
        localStorage.removeItem('token')
        router.push("/login");
      }
      return res.data;
    }
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    message.error('接口请求失败');
    return Promise.reject(error);
  }
);

/**
 * 封装请求函数
 */
const request = (options) => {
  if (options.method === "get") {
    options.params = options.data;
  }
  return service(options);
};

export default request;
