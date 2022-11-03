import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface Address extends Document {
  street: string;
  city: string;
  uf: string;
  state: string;
  zip: string;
  district: string;
  complement: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface IFranchise extends Document {
  email: string;
  cnpj: string;
  companyName: string;
  password: string;
  type: string;
  address?: Address;
  phone?: string;
}

const FranchiseSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  cnpj: { type: Number, required: true, unique: true },
  companyName: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true, default: "franchise" },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    uf: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    district: { type: String, required: true },
    complement: { type: String, required: false },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
});

FranchiseSchema.pre<IFranchise>("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;

  next();
});

export default mongoose.model<IFranchise>("Franchise", FranchiseSchema);
