import franchiseModel, { FranchiseSchema } from "../models/franchise.model";
import { IFranchise, ILogin } from "../interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { orders } from "../utils";

export interface IFranchiseService {
  createFranchise: (franchise: IFranchise) => Promise<IFranchise>;
  login: (login: ILogin) => Promise<IFranchise>;
  getFranchises: (order?: string) => Promise<any[]>;
  generateToken: (id: string) => string;
}

class FranchiseService implements IFranchiseService {
  public async createFranchise(franchise: IFranchise) {
    const exists = await franchiseModel.findOne({
      $or: [{ email: franchise.email }, { cnpj: franchise.cnpj }],
    });

    if (exists) {
      throw new Error("Email or CNPJ already exists");
    }

    return franchiseModel
      .create({
        email: franchise.email,
        cnpj: franchise.cnpj,
        companyName: franchise.companyName,
        password: franchise.password,
        address: franchise.address,
        type: franchise.type,
      })
      .then((data: IFranchise) => {
        return data;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async login(login: ILogin) {
    const franchise = await franchiseModel
      .findOne({ email: login.email })
      .lean();

    if (!franchise) {
      throw new Error("Email or password is incorrect");
    }

    const isValid = await bcrypt.compare(login.password, franchise.password);

    if (!isValid) {
      throw new Error("Email or password is incorrect");
    }

    delete franchise.password;

    return franchise;
  }

  public async getFranchises(order?: string) {
    const franchises = await franchiseModel.find({}).sort(orders[order]).lean();

    const coordinates = franchises.map((franchise) => {
      return {
        latitude: franchise.address.coordinates.latitude,
        longitude: franchise.address.coordinates.longitude,
        street: franchise.address.street,
        companyName: franchise.companyName,
      };
    });

    return coordinates;
  }

  public generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  }
}

export default new FranchiseService();
