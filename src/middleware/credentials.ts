import { Request, Response, NextFunction } from "express";

import { allowlist } from "../config/allowedOrigins";

export default (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowlist.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
    req.origin = origin;
  } else {
    res.removeHeader("Access-Control-Allow-Credentials");
  }

  next();
};
