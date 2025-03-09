import axiosPlus, { type AxiosConfig } from "@/api/index";

export async function addCase(
  axiosConfig: Omit<AxiosConfig<"/api/case/add", "post">, "url" | "method">,
) {
  const response = await axiosPlus<"/api/case/add", "post">({
    url: `/api/case/add`,
    method: "post",
    ...axiosConfig,
  });
  return response.data;
}

export async function getCase(
  axiosConfig: Omit<AxiosConfig<"/api/case/get/{id}", "get">, "url" | "method">,
) {
  const response = await axiosPlus<"/api/case/get/{id}", "get">({
    method: "get",
    url: `/api/case/get/{id}`,
    ...axiosConfig,
  });
  if (!response.data) throw new Error("not ok");
  return response.data;
}

export const getCaseList = async (
  axiosConfig: Omit<AxiosConfig<"/api/case/list", "post">, "url" | "method">,
) => {
  const response = await axiosPlus<"/api/case/list", "post">({
    method: "post",
    url: `/api/case/list`,
    ...axiosConfig,
  });
  return response.data;
};

export async function updateCase(
  axiosConfig: Omit<
    AxiosConfig<"/api/case/update/{id}", "post">,
    "url" | "method"
  >,
) {
  const response = await axiosPlus<"/api/case/update/{id}", "post">({
    url: `/api/case/update/{id}`,
    method: "post",
    ...axiosConfig,
  });
  return response.data.ok;
}

export async function deleteCase(
  axiosConfig: Omit<
    AxiosConfig<"/api/case/delete/{id}", "delete">,
    "url" | "method"
  >,
) {
  const response = await axiosPlus<"/api/case/delete/{id}", "delete">({
    url: `/api/case/delete/{id}`,
    method: "delete",
    ...axiosConfig,
  });
  return response.data.ok;
}
