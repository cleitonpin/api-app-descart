import Franchise, { IFranchise } from "../models/franchise.model";
import { CreateQuery } from "mongoose";
import bcrypt from "bcryptjs";

interface ILogin {
  email: string;
  password: string;
}

async function CreateFranchise({
  email,
  cnpj,
  companyName,
  password,
  address,
}: CreateQuery<IFranchise>): Promise<IFranchise> {
  return Franchise.create({
    email,
    cnpj,
    companyName,
    password,
    address,
  })
    .then((data: IFranchise) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function Login({ email, password }: ILogin) {
  const franchise = await Franchise.findOne({ email }).lean();

  if (!franchise) {
    throw new Error("Email not found");
  }

  const isValid = await bcrypt.compare(password, franchise.password);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  delete franchise.password;

  return franchise;
}

async function GetFranchises() {
  const franchises = await Franchise.find({}).lean();

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

export { CreateFranchise, Login, GetFranchises };
