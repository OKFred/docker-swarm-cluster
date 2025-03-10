/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/case/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 添加 case
         * @description 添加 case
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["caseAddReq"];
                };
            };
            responses: {
                /** @description 成功 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["caseAddRes"];
                    };
                };
                /** @description 校验失败 */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorInvalidRequest"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/case/get/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 查询 case
         * @description 查询 case
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description caseToken
                     * @example example
                     */
                    caseToken?: string;
                    /**
                     * @description caseName
                     * @example example
                     */
                    caseName?: string;
                };
                header?: never;
                path: {
                    /** @description case id */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description 成功 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["caseGetRes"];
                    };
                };
                /** @description 校验失败 */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorInvalidRequest"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/case/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 查询 case列表
         * @description 查询 case列表
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["caseListReq"];
                };
            };
            responses: {
                /** @description 成功 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["caseListRes"];
                    };
                };
                /** @description 校验失败 */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorInvalidRequest"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/case/update/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 更新 case
         * @description 更新 case
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description case id */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["caseUpdateReq"];
                };
            };
            responses: {
                /** @description 成功 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["caseUpdateRes"];
                    };
                };
                /** @description 校验失败 */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorInvalidRequest"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/case/delete/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * 删除 case
         * @description 删除 case
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description case id */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["caseDeleteReq"];
                };
            };
            responses: {
                /** @description 成功 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["caseAddRes"];
                    };
                };
                /** @description 校验失败 */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorInvalidRequest"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 获取系统信息
         * @description 获取系统信息
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description 成功 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["systemInfoRes"];
                    };
                };
                /** @description 未知异常 */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorInvalidRequest"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ErrorInvalidRequest: {
            ok: boolean;
            message: string;
            errors?: {
                instanceLocation?: string;
                keyword?: string;
                keywordLocation?: string;
                error?: string;
            }[];
        };
        caseAddReq: {
            caseName: string;
            caseToken: string;
            caseTimeout: number;
            returnTime: number;
            serviceOptions?: {
                Name?: string;
                Labels?: Record<string, never>;
                TaskTemplate?: Record<string, never>;
                Mode?: Record<string, never>;
                UpdateConfig?: Record<string, never>;
                RollbackConfig?: Record<string, never>;
                Networks?: unknown[];
                EndpointSpec?: Record<string, never>;
            };
            terminateTimeout?: number;
        };
        caseAddRes: {
            ok: boolean;
            /** @description case id */
            data: number;
            message?: string;
        };
        caseGetReq: {
            caseName?: string;
            caseToken: string;
        };
        caseGetRes: {
            ok: boolean;
            data: {
                id?: number;
                caseName?: string;
                caseToken?: string;
                caseTimeout?: number;
                returnTime?: number;
                caseSucceed?: boolean;
                caseFinished?: boolean;
                createTime?: string;
                updateTime?: string | null;
                expectedTime?: string | null;
                serviceId?: string | null;
                retryCount?: number | null;
                maxRetry?: number | null;
            };
            message?: string;
        };
        caseListReq: {
            /** @enum {string} */
            orderBy?: "id" | "caseName" | "caseToken" | "caseTimeout" | "returnTime";
            descend?: boolean;
            /** @default 1 */
            pageNo: number;
            /** @default 10 */
            pageSize: number;
            keyword?: string;
        };
        caseListRes: {
            ok: boolean;
            data: {
                list: {
                    id?: number;
                    caseName?: string;
                    caseToken?: string;
                    caseTimeout?: number;
                    returnTime?: number;
                    caseSucceed?: boolean;
                    caseFinished?: boolean;
                    createTime?: string;
                    updateTime?: string | null;
                    expectedTime?: string | null;
                    serviceId?: string | null;
                    retryCount?: number | null;
                    maxRetry?: number | null;
                }[];
                total?: number;
                currentPage?: number;
                totalPage?: number;
                pageNo?: number;
                pageSize?: number;
            };
            message?: string;
        };
        caseUpdateReq: {
            expectedTime: string;
            caseToken: string;
            caseSucceed: boolean;
        };
        caseUpdateRes: {
            ok: boolean;
            /** @description case id */
            data: number;
            message?: string;
        };
        caseDeleteReq: {
            caseToken: string;
        };
        caseDeleteRes: {
            ok: boolean;
            /** @description case id */
            data: number;
            message?: string;
        };
        systemInfoReq: Record<string, never>;
        systemInfoRes: {
            ok: boolean;
            data: {
                node: string;
                platform: string;
                arch: string;
                cpus: number;
                memory: number;
                uptime: number;
                loadavg: unknown[];
                totalmem: number;
                freemem: number;
                hostname: string;
                type: string;
                release: string;
                networkInterfaces: Record<string, never>;
            };
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
