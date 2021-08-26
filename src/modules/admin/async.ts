import axios from "../common/request";

// UserManagement
export const getRoles = async () => {
  const url = `/api/values/userManagement/allRoles`;
  const result = await axios.get(url);

  return result;
};

export const getAllAdmins = async (
  data: any,
  roleList: any,
  isActiveList: any
) => {
  let isActiveParam = "?";
  isActiveList.forEach((i: any) => {
    isActiveParam += "IsActiveList=" + i + "&";
  });
  let roleParam = "";
  roleList.forEach((i: any) => {
    roleParam += "RoleList=" + i + "&";
  });
  const url = `/api/values/userManagement/all/${isActiveParam}${roleParam}`;
  const result = await axios.get(url, {
    params: data,
  });

  return result;
};

export const createAdmin = async (data: any) => {
  const url = "/api/values/userManagement/create";

  return axios.post(url, data, {
    withCredentials: true,
  });
};

export const editAdmin = async (data: any) => {
  const url = "/api/values/userManagement/edit";

  return axios.post(url, data, {
    withCredentials: true,
  });
};

export const deactivateAdmin = async (data: any) => {
  const url = "/api/values/userManagement/deactivate";

  return axios.post(url, data, {
    withCredentials: true,
  });
};

export const getUserFromAdByNk = async (nk: any) => {
  const url = `/api/values/userManagement/getUserFromAdByNk/${nk}`;
  const result = await axios.get(url);

  return result;
};

export const getAdminHistory = async (id: string) => {
  const url = `/api/values/userManagement/history/${id}`;
  const result = await axios.get(url);

  return result;
};
