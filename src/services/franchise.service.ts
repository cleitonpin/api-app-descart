import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import franchiseModel from "../models/franchise.model";
import { IFranchise, ILogin } from "../interfaces";
import { orders } from "../utils";
import { resetPasswordTemplate } from "../templates/reset-password";

export interface IFranchiseService {
  createFranchise: (
    franchise: IFranchise | IFranchise[]
  ) => Promise<IFranchise>;
  login: (login: ILogin) => Promise<IFranchise>;
  getFranchises: (order?: string) => Promise<any[]>;
  getFranchise: (id: string) => Promise<IFranchise>;
  updateFranchise: (id: string, franchise: IFranchise) => Promise<IFranchise>;
  generateToken: (id: string) => string;
  forgotPassword: (id: string, origin: string) => Promise<string>;
  resetPassword: (
    id: string,
    password: string,
    token: string
  ) => Promise<IFranchise>;
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class FranchiseService implements IFranchiseService {
  public async createFranchise(franchise: IFranchise) {
    if (Array.isArray(franchise)) {
      const usersWithHashedPasswordsPromiseArray = franchise.map(
        async (franchise) => {
          const hashedPassword = await bcrypt.hash(franchise.password, 8);

          return {
            ...franchise,
            password: hashedPassword,
          };
        }
      );

      const usersWithHashedPasswords = await Promise.all(
        usersWithHashedPasswordsPromiseArray
      );

      const franchises = await franchiseModel.insertMany(
        usersWithHashedPasswords
      );

      return franchises;
    }

    const exists = await franchiseModel.findOne({
      $or: [{ email: franchise.email }, { cnpj: franchise.cnpj }],
    });

    if (exists) {
      throw new Error("Email ou CNPJ já cadastrado");
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

  public async getFranchise(id: string) {
    const franchise = await franchiseModel.findById(id).lean();

    if (!franchise) {
      throw new Error("Franchise not found");
    }

    return franchise;
  }

  public async updateFranchise(id: string, franchise: IFranchise) {
    const updatedFranchise = await franchiseModel
      .findByIdAndUpdate(id, franchise, { new: true })
      .lean();

    if (!updatedFranchise) {
      throw new Error("Franchise not found");
    }

    delete updatedFranchise.password;

    return updatedFranchise;
  }

  public generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  }

  public async forgotPassword(email: string, origin: string) {
    const franchise = await franchiseModel
      .findOne({ email })
      .select("+password")
      .lean();

    if (!franchise) {
      throw new Error("Franchise not found");
    }

    const token = jwt.sign({ userId: franchise._id }, process.env.JWT_SECRET, {
      subject: String(franchise._id),
      expiresIn: 1000 * 60 * 10,
      issuer: "descartfarm.com.br",
      audience: "descart_farm",
    });

    const url = `${origin}/resetar-senha/?token=${token}`;

    await sgMail.send({
      to: email,
      from: "cleiton.biou@gmail.com",
      html: resetPasswordTemplate(franchise.companyName, url),
      subject: "Redefinição de senha DescartFarm",
    });

    return "Email sent";
  }

  public async resetPassword(id: string, password: string, token: string) {
    const franchise = await franchiseModel
      .findById(id)
      .select("+password")
      .lean();

    if (!token) {
      throw new Error("Token not provided");
    }

    if (!franchise) {
      throw new Error("Franchise not found");
    }

    const newPassword = await bcrypt.hash(password, 8);

    franchise.password = newPassword;

    await franchiseModel.findByIdAndUpdate(id, franchise);

    return franchise;
  }
}

export default new FranchiseService();
