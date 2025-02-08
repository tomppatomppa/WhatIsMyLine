import { z } from "zod";
import { BASE_URI } from "../config";
import { httpClient } from "../utils/axiosClient";

export const getUser = async () => {
  const { data } = await httpClient.get(`${BASE_URI}/user`, {});

  return userDataSchema.parse(data);
};

// User Data Schema
const userDataSchema = z.object({
  picture: z.string().url().nullable(), // Validate URL and allow null
  email: z.string().email(),
  is_admin: z.boolean().nullable(),
  registered_on: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
});
