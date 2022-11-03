import { Request, Response } from "express";
import franchiseService, {
  IFranchiseService,
} from "../services/franchise.service";

class FranchiseController {
  constructor(private franchiseService: IFranchiseService) {}

  create = async (req: Request, res: Response) => {
    try {
      const franchise = await this.franchiseService.createFranchise(req.body);

      return res.json({
        franchise,
        token: this.franchiseService.generateToken(franchise._id),
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const franchise = await this.franchiseService.login(req.body);

      return res.json({
        franchise,
        token: this.franchiseService.generateToken(franchise._id),
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  getFranchises = async (req: Request, res: Response) => {
    const order = req.query.order as string;

    const franchises = await this.franchiseService.getFranchises(order || "");

    return res.json({ franchises });
  };
}

export default new FranchiseController(franchiseService);
