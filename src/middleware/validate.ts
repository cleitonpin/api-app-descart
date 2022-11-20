import { NextFunction, Request, Response } from "express";
import * as yup from "yup";

export default (schema: yup.AnyObjectSchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors = err.inner.map((error) => {
        return {
          path: error.path,
          message: error.message,
        };
      });

      return res.status(400).json({ errors });
    }

    res.status(400).json({ error: err.message });
  }
};
