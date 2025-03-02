import axios from "axios";
import type {
  Method,
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { paths } from "@/types/openapi"; //由openapi-typescript自动生成的类型
import { message } from "ant-design-vue";

export type NewRequest<U extends keyof paths, M extends keyof paths[U]> = {
  url: U;
  method: M;
  headers?: paths[U][M] extends { parameters: { header?: infer H } }
    ? Partial<H>
    : never;
  path?: paths[U][M] extends { parameters: { path?: infer P } } ? P : never;
  params?: paths[U][M] extends { parameters: { query?: infer Q } } ? Q : never;
  data?: paths[U][M] extends {
    requestBody: { content: { "application/json": infer B } };
  }
    ? B
    : never;
};

export type NewResponse<U extends keyof paths, M extends keyof paths[U]> = {
  data: paths[U][M] extends {
    responses: { 200: { content: { "application/json": infer T } } };
  }
    ? T
    : never;
  headers: paths[U][M] extends { responses: { 200: { headers: infer H } } }
    ? H
    : never;
};

type AxiosPlus = <U extends keyof paths, M extends Lowercase<Method>>(
  axiosConfig: Omit<
    AxiosRequestConfig,
    "url" | "method" | "headers" | "path" | "params" | "data"
  > &
    NewRequest<U, Extract<M, keyof paths[U]>>,
  // customOptions?: Record<string, unknown>,
  // loadingOptions?: Record<string, unknown>,
) => Promise<
  Omit<AxiosResponse, "data" | "headers"> &
    NewResponse<U, Extract<M, keyof paths[U]>>
>;

/** @description  axios 实例 */
const service = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10_000,
});

const axiosPlus: AxiosPlus = async (
  axiosConfig,
  /*  customOptions,
  loadingOptions, */
) => {
  const applyInterceptors = interceptors(service);
  return await applyInterceptors(axiosConfig);
};

function interceptors(service: AxiosInstance) {
  /** @description 添加请求拦截器 */
  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig & { path?: Record<string, any> }) => {
      let _url = config.url;
      if (!_url) {
        throw new Error("url is required");
      }
      const path = config.path;
      if (typeof path === "object" && path) {
        for (const [key, value] of Object.entries(path)) {
          _url = _url.replace(`{${key}}`, String(value));
        }
        config.url = _url;
        console.log({ config });
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );
  /** @description 添加响应拦截器 */
  service.interceptors.response.use(
    function (response) {
      if (response.status === 200) {
        return response;
      } else {
        if (response.data && response.data.message) {
          message.error(response.data.message);
        }
        return Promise.reject(response);
      }
    },
    function (error) {
      return Promise.reject(error);
    },
  );
  return service;
}
export default axiosPlus;
