import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface ITokenPayload {
  id: string;
  iart: Number;
  exp: number;
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  {
    const { authorization } = req.headers;

    if (!authorization) return res.sendStatus(401);

    const token = authorization.replace("Bearer", "").trim();

    if (!token) {
      return res.status(401).json({
        message: "Token no providede",
      });
    }
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);

      const { id } = data as ITokenPayload;

      req.userId = id;

      return next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: "Token invalid!",
      });
    }
  }
}
