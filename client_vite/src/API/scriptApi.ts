import { Script } from "../components /ReaderV3/reader.types";
import { BASE_URI } from "../config";
import { httpClient } from "../utils/axiosClient";

export const fetchAllUserScripts = async (): Promise<Script[]> => {
  const { data } = await httpClient.get(`${BASE_URI}/script`);

  return data;
};

export const getScript = async (id: number): Promise<Script> => {
  const { data } = await httpClient.get(`${BASE_URI}/script/${id}`);

  return data;
};

export const addScript = async (script: Script) => {
  const { data } = await httpClient.post(`${BASE_URI}/script`, {
    ...script,
  });

  return data;
};

export const updateScript = async (script: Script) => {
  const { data } = await httpClient.put(
    `${BASE_URI}/script/${script.script_id}`,
    {
      ...script,
    }
  );

  return data;
};
export const deleteScriptById = async (id: string) => {
  const { data } = await httpClient.delete(`${BASE_URI}/script/${id}`);

  return data;
};
