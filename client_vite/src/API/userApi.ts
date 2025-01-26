import { z } from "zod";
import { BASE_URI } from "../config";
import { httpClient } from "../utils/axiosClient";

export const getUser = async () => {
  const { data } = await httpClient.get(`${BASE_URI}/user`, {});

  return userDataSchema.parse(data);
};

// Scene Schema (Script)
const scriptSchema = z.object({
  id: z.number().int(),
  script_id: z.string(),
  filename: z.string(),
  user_id: z.number().int(),
  created_on: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
    .transform((val) => new Date(val)),
  modified_on: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
    .transform((val) => new Date(val)),
  deleted_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
    .transform((val) => new Date(val))
    .nullable(), // Allow null values for this field
});

// User Data Schema
const userDataSchema = z.object({
  id: z.number().int(),
  picture: z.string().url().nullable(), // Validate URL and allow null
  email: z.string().email(),
  registered_on: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  scripts: z.array(scriptSchema),
});
