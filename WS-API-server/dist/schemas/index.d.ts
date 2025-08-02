import { z } from "zod";
export declare const functionSchema: z.core.$ZodFunction<z.core.$ZodFunctionArgs, z.core.$ZodFunctionOut>;
export declare const middlewaresSchema: z.ZodArray<z.ZodAny>;
export declare const setRouteHandlerSchema: z.ZodObject<{
    middlewares: z.ZodArray<z.ZodAny>;
    handler: z.core.$ZodFunction<z.core.$ZodFunctionArgs, z.core.$ZodFunctionOut>;
}, z.core.$strip>;
export declare const reqOptionsSchema: z.ZodObject<{
    route: z.ZodString;
    method: z.ZodString;
    data: z.ZodOptional<z.ZodAny>;
    timeout: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
