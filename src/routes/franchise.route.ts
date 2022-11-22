import { Router } from "express";
import rateLimit, { Options, MemoryStore } from "express-rate-limit";

import { franchiseSchema, loginSchema } from "../helpers/yup-schemas";
import FranchiseController from "../controllers/franchise.controller";
import validateMiddleware from "../middleware/validate";
import authMiddleware from "../middleware/authentication";

const franchiseRoutes = Router();

const rateLimitConfig: Partial<Options> = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  handler: (req, res) => {
    res.status(429).json({ error: true, message: "Too many requests" });
  },
};

franchiseRoutes.post(
  "/franchise",
  rateLimit(rateLimitConfig),
  validateMiddleware(franchiseSchema),
  FranchiseController.create
);
franchiseRoutes.post(
  "/franchise/login",
  rateLimit(rateLimitConfig),
  validateMiddleware(loginSchema),
  FranchiseController.login
);
franchiseRoutes.get("/franchises", FranchiseController.getFranchises);
franchiseRoutes.put(
  "/franchise/:id",
  authMiddleware,
  FranchiseController.updateFranchise
);
franchiseRoutes.post(
  "/franchise/forgot-password",
  rateLimit(rateLimitConfig),
  FranchiseController.forgotPassword
);
franchiseRoutes.post(
  "/franchise/reset-password",
  rateLimit(rateLimitConfig),
  FranchiseController.resetPassword
);

export default franchiseRoutes;
