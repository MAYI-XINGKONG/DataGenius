import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";

const service = axios.create({
    baseURL: "http://localhost:5173"
});

// 请求拦截器

// axios.interceptors.request.use();
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {

    // 给headers增加自定义属性token
    config.headers.token = sessionStorage.getItem("token");


    return config;
});

// 响应拦截器
service.interceptors.response.use((res: AxiosResponse) => {
 

    return res;
});

export default service;