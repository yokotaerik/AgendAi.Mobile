import { UserType } from "./common";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserType;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CompanyOwnerDto {
  id: string;
  userId: string;
  companyId: string;
  isOwner: boolean;
} 