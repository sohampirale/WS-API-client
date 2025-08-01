import { z } from "zod";
/**
 * .request() options schema
 */
export declare const requestSchema: z.ZodObject<{
    route: z.ZodString;
    method: z.ZodString;
}, z.core.$strip>;
