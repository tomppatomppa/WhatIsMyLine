import axios from "axios";
import { BASE_URI } from "../config";

export const getAuth = async () => {
  const { data } = await axios.get(`${BASE_URI}/auth`);
  return data;
};


export const logout = async () => {
  const { data } = await axios.post(`${BASE_URI}/auth/logout`, null)
  return data
}
