import axiosPlus from "@/api/index";

export async function getSystemInfo() {
  const response = await axiosPlus<"/api/system/info", "get">({
    method: "get",
    url: `/api/system/info`,
  });
  return response.data;
}
