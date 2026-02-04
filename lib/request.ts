import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import CryptoJS from 'crypto-js';

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg?: string;
}

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
});

// 生成签名
function generateAuthHeaders() {
  const timestamp = Date.now().toString();
  const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'default-secret-key';
  const sign = CryptoJS.SHA256(timestamp + nonce + secretKey).toString();

  return {
    'X-Timestamp': timestamp,
    'X-Nonce': nonce,
    'X-Sign': sign,
  };
}

// 请求拦截器
request.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authHeaders = generateAuthHeaders();
    Object.assign(config.headers, authHeaders);
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { code, data } = response.data;
    if (code === 200) return response.data;
    return Promise.reject(new Error(response.data.msg || '请求失败'));
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

export default request;
