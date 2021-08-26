import axios from "axios";
import decode from "jwt-decode";
import { isNullOrUndefined } from "util";
import { UserInfo } from "./models";
const roleUrl = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export const generateJwt = async () => {
  let token = localStorage.getItem("auth_token");
  const isHaveToken = isNullOrUndefined(token)
    ? false
    : isTokenValid(token)
    ? !isTokenExpired(token!)
    : false;

  if (isHaveToken) {
    token = localStorage.getItem("auth_token");
  } else {
    localStorage.removeItem("auth_token");
    try {
      const response = await axios.get("/api/values/getToken", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const result = response && response.data && response.data.data;
      token = result.auth_token;
      if (isTokenValid(token!)) {
        localStorage.setItem("auth_token", token!);
      }
    } catch (error) {
      console.error(error.ToString());
    }
  }

  return token;
};

const isTokenExpired = (token: string): boolean => {
  const decoded: any = decode(token);
  if (decoded.exp < Date.now() / 1000) {
    return true;
  } else {
    return false;
  }
};

const isTokenValid = (token: string): boolean => {
  try {
    decode(token!);

    return true;
  } catch (err) {
    console.log("Invalid token", err);

    return false;
  }
};

export const getUserInfo = (): UserInfo => {
  const info: any = decode(localStorage.getItem("auth_token") as string);
  const array: any[] = [];
  info.Roles = array.concat(info[roleUrl]);

  return info;
};

export const removeTokenFromLocalStorage = () => {
  return localStorage.removeItem("auth_token");
};
