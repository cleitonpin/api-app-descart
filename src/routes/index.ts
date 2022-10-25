import { TRoutesInput } from "../types/routes";
import {
  CreateFranchise,
  GetFranchises,
  Login,
} from "../controllers/user.controller";

export default ({ app }: TRoutesInput) => {
  app.post("/api/franchise", async (req, res) => {
    const franchise = await CreateFranchise({
      email: req.body.email,
      cnpj: req.body.cnpj,
      companyName: req.body.companyName,
      password: req.body.password,
      address: {
        ...req.body.address,
        coordinates: {
          latitude: req.body.address.coordinates.latitude,
          longitude: req.body.address.coordinates.longitude,
        },
      },
    });

    return res.send({ franchise });
  });

  app.post("/api/franchise/login", async (req, res) => {
    const franchise = await Login({
      email: req.body.email,
      password: req.body.password,
    });

    return res.send({ franchise });
  });

  app.get("/api/franchises", async (req, res) => {
    const franchises = await GetFranchises(req.query.order || {});

    return res.send({ franchises });
  });
};
