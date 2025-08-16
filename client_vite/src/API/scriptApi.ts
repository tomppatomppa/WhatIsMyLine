import { Script } from "../components /ReaderV3/reader.types";
import { BASE_URI } from "../config";
import { httpClient } from "../utils/axiosClient";

export const getScripts = async (): Promise<Script[]> => {
  const { data } = await httpClient.get(`${BASE_URI}/scripts`);
  return data;
};

export const getScript = async (id: string): Promise<Script> => {
  const { data } = await httpClient.get(`${BASE_URI}/script/${id}`);
  return data;
};

interface GetScriptResponse {
  id: number,
  filename: string,
  markdown: string
}
export const getScriptMarkdown = async (id: number): Promise<GetScriptResponse> => {
  const { data } = await httpClient.get(`${BASE_URI}/script/markdown-test/${id}`);
  // const { data } = await httpClient.get(`${BASE_URI}/script/markdown-docling-test`, {
  //   timeout: 1000*200
  // });
  return data;
};

export const createScriptMarkdown = async (params: {id: undefined | number, markdown: string, filename: string}): Promise<GetScriptResponse> => {
  const { data } = await httpClient.post(`${BASE_URI}/script/markdown-test`, {...params});
  
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
