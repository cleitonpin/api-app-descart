export interface ILogin {
  email: string;
  password: string;
}

export interface IOrder {
  [key: string]: {};
}

export interface Address {
  street: string;
  city: string;
  uf: string;
  state: string;
  zip: string;
  district: string;
  number: Number;
  complement: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface IFranchise {
  _id?: string;
  email: string;
  cnpj: string;
  companyName: string;
  password: string;
  type: string;
  address?: Address;
}
