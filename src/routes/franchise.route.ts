import { Router } from "express";
import { franchiseSchema, loginSchema } from "../helpers/yup-schemas";
import FranchiseController from "../controllers/franchise.controller";
import validateMiddleware from "../middleware/validate";
import authMiddleware from "../middleware/authentication";

const franchiseRoutes = Router();

franchiseRoutes.post(
  "/franchise",
  validateMiddleware(franchiseSchema),
  FranchiseController.create
);
franchiseRoutes.post(
  "/franchise/login",
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
  FranchiseController.forgotPassword
);
franchiseRoutes.post(
  "/franchise/reset-password",
  FranchiseController.resetPassword
);

export default franchiseRoutes;
