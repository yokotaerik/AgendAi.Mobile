
export interface BasicInfoDto {
    id: string;
    imageUrl?: string;
    completeName: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AddressDto {
    street: string;
    number: string;
    complement?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface Cnpj {
    value: string;
}

export interface Cpf {
    value: string;
}

export interface UserInfo {
    name: string;
    surname: string;
    email: string;
    role: UserType;
} 

export enum UserType
{
    Customer = 1,
    Employee = 2,   
    Company = 3,
}
