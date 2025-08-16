import axios from "axios";
import { BASE_URI } from "../config";
import { getCookie } from "../utils/helpers";

export const getAuth = async () => {
  const { data } = await axios.get(`${BASE_URI}/auth`);
  return data;
};

export const logout = async () => {
  const { data } = await axios.post(`${BASE_URI}/auth/logout`,  null, { withCredentials: true });
  return data;
};

export const refreshToken = async () => {
  const csrfToken = getCookie("csrf_refresh_token"); 

  const response = await axios.post(`${BASE_URI}/auth/refresh-cookie`, {}, {
    withCredentials: true,  
    headers: {
      "X-CSRF-TOKEN": csrfToken
    }
  });

  return response.data; 
};