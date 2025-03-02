import axios from "axios";

const SERVER_URL = "http://localhost:3000"; // 服务器地址

/**
 * 获取健康度
 * @returns {Promise<Object>} 返回健康度数据
 */
export async function getHealth() {
  const response = await axios.get(`${SERVER_URL}`);
  if (response.data.ok === false) throw new Error("not ok");
  return response.data.data;
}

export async function getSystemInfo() {
  const response = await axios.get(`${SERVER_URL}/api/system/info`);
  if (response.data.ok === false) throw new Error("not ok");
  return response.data.data;
}

/**
 * 添加 case
 * @param {Object} newCase 新 case 数据
 * @returns {Promise<number>} 返回新增 case 的 ID
 */
export async function addCase(newCase: {
  caseName: string;
  caseToken: string;
  caseTimeout: number;
  returnTime: number;
}) {
  const response = await axios.post(`${SERVER_URL}/api/case/add`, newCase);
  if (response.data.ok === false) throw new Error("not ok");
  return response.data.data;
}

/**
 * 获取 case 详情
 * @param {number} id case ID
 * @returns {Promise<Object>} 返回 case 详情
 */
export async function getCase(id: any) {
  const response = await axios.get(`${SERVER_URL}/api/case/get/${id}`);
  if (response.data.ok === false) throw new Error("not ok");
  return response.data.data;
}

/**
 * 更新 case（回调）
 * @param {number} id case ID
 * @param {Object} callbackBody 回调数据
 * @returns {Promise<Object>} 返回更新结果
 */
export async function updateCase(
  id: any,
  callbackBody: { caseToken: any; caseSucceed: boolean },
) {
  const response = await axios.post(
    `${SERVER_URL}/api/case/update/${id}`,
    callbackBody,
  );
  if (response.data.ok === false) throw new Error("not ok");
  return response.data.data;
}

/**
 * 删除 case
 * @param {number} id case ID
 * @returns {Promise<Object>} 返回删除结果
 */
export async function deleteCase(id: any) {
  const response = await axios.delete(`${SERVER_URL}/api/case/delete/${id}`);
  if (response.data.ok === false) throw new Error("not ok");
  return response.data.data;
}
