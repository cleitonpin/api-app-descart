import { Router } from "express";
import FranchiseController from "../controllers/franchise.controller";
import authMiddleware from "../middleware/authentication";

const franchiseRoutes = Router();

franchiseRoutes.post("/franchise", FranchiseController.create);
franchiseRoutes.post("/franchise/login", FranchiseController.login);
franchiseRoutes.get("/franchises", FranchiseController.getFranchises);
franchiseRoutes.put(
  "/franchise/:id",
  authMiddleware,
  FranchiseController.updateFranchise
);

export default franchiseRoutes;
