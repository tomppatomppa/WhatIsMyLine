import axios from "axios";
import { BASE_URI } from "../config";
import { getCookie } from "../utils/helpers";
import { httpClient } from "../utils/axiosClient";

export const uploadfile = async (file: FormData) => {
  const { data } = await axios.post(`${BASE_URI}/v3/upload`, file, {
    withCredentials: true,
    headers: {
      "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    },
  });
  return data;
};

export const uploadfileV4 = async (file: FormData) => {
  const { data } = await httpClient.post(`${BASE_URI}/v4/upload`, file, {
    withCredentials: true,
    headers: {
      "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    },
  });
  return data;
};


export const getFile = async (uuid: string) => {
  const response = await httpClient.get(`${BASE_URI}/script/file/${uuid}`, {
    responseType: "blob", // <-- Important! tells Axios to treat response as binary
  });

  return response.data; // this is now a Blob
};