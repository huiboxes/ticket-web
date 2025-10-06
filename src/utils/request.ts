import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // 后端网关地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('access_token');
    // if (token) {
    //   config.headers['Authorization'] = 'Bearer ' + token;
    // }
    console.log('请求参数', config)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    
    // 如果返回的状态码为200，说明接口请求成功
    if (response.status === 200) {
      return res;
    } else {
      // 统一处理错误
      console.error('响应错误:', res.message);
      return Promise.reject(new Error(res.message || 'Error'));
    }
  },
  (error) => {
    // 对响应错误做些统一处理
    console.error('网络错误:', error);
    return Promise.reject(error);
  }
);

console.log('环境：', process.env.NODE_ENV)
console.log('服务器地址：', process.env.VUE_APP_API_URL)

export default service;