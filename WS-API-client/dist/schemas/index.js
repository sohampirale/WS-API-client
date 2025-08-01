import { z } from "zod";
/**
 * .request() options schema
 */
export const requestSchema = z.object({
    route: z.string(),
    method: z.string()
});
