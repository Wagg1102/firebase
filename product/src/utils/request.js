// src/utils/axios.js

import axios from 'axios';

// 创建axios实例
const request = axios.create();

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在这里可以添加请求头或其他请求前的操作
    const token = localStorage.getItem('token'); // 假设你将token存储在localStorage中
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 在这里可以处理响应数据
    return response.data;
  }
);


export default request;