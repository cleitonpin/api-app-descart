import { Request, Response } from "express";
import franchiseService, {
  IFranchiseService,
} from "../services/franchise.service";
import jwt from "jsonwebtoken";

interface ITokenPayload {
  userId: string;
  iat: number;
  exp: number;
  sub: string;
}
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
      return res.status(400).json({ error: true, message: error.message });
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
      return res
        .status(400)
        .json({ error: true, message: "Email/Senha incorretos" });
    }
  };

  getFranchises = async (req: Request, res: Response) => {
    const order = req.query.order as string;

    const franchises = await this.franchiseService.getFranchises(order || "");

    return res.json({ franchises });
  };

  getFranchise = async (req: Request, res: Response) => {
    const franchise = await this.franchiseService.getFranchise(req.params.id);

    return res.json({ franchise });
  };

  updateFranchise = async (req: Request, res: Response) => {
    const franchise = await this.franchiseService.updateFranchise(
      req.params.id,
      req.body
    );

    return res.json({ franchise });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
      await this.franchiseService.forgotPassword(email, req.headers.origin);

      return res.json({
        error: false,
        message:
          "Se existir uma conta com esse usuário, então um e-mail será encaminhado com detalhes para o processo de recuperação",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    const authToken = req.headers.authorization;

    const [tokenSchema, token] = authToken.split(" ");

    if (!/^Bearer$/i.test(tokenSchema)) {
      return res.status(400).json({
        error: true,
        message: "Token em formato errado",
      });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = data as ITokenPayload;

    const { password, passwordConfirmation } = req.body;

    try {
      await this.franchiseService.resetPassword(userId, password, token);

      return res.json({
        error: false,
        message: "Senha alterada com sucesso",
      });
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  };
}

export default new FranchiseController(franchiseService);
