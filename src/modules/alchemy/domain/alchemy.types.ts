import { Address } from './value-objects/address.value-object';

// All properties that a User has
export interface AlchemyProps {
  role: AlchemyRoles;
  email: string;
  address: Address;
  userId: string;
  balance: number;
}

// Properties that are needed for a alchemy creation
export interface CreateAlchemyProps {
  email: string;
  address: Address;
  userId: string;
  balance: number;
}

// Properties used for updating a user address
export interface UpdateAlchemyAddressProps {
  country?: string;
  postalCode?: string;
  street?: string;
}

export enum AlchemyRoles {
  admin = 'admin',
  moderator = 'moderator',
  guest = 'guest',
}
