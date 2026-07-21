import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validate =
    (schema: ZodTypeAny) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const parsed = schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });

                // overwrite req with validated data (important)
                req.body = parsed.body;
                req.query = parsed.query;
                req.params = parsed.params;

                next();
            } catch (error: any) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error.errors,
                });
            }
        };