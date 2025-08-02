import { z } from "zod";
export const functionSchema = z.any();
// export const middlewaresSchema=z.array(functionSchema);
export const middlewaresSchema = z.array(z.any());
export const setRouteHandlerSchema = z.object({
    middlewares: middlewaresSchema,
    handler: functionSchema
});
export const reqOptionsSchema = z.object({
    route: z.string(),
    method: z.string(),
    data: z.any().optional(),
    timeout: z.string().optional()
});
