import { AddressDto, Cnpj, BasicInfoDto } from './common';
import { RegisterEmployeeDto } from './employee';
import { ServiceDto } from './service';

export interface CompleteCompanyDto {
    id?: string;
    imageUrls?: string[];
    corporateName?: string;
    fantasyName?: string;
    address?: AddressDto;
    cnpj?: Cnpj;
    services?: ServiceDto[];
    employees?: BasicInfoDto[];
}

export interface CompanyDto {
    id?: string;
    imageUrl?: string;
    corporateName?: string;
    fantasyName?: string;
    address?: AddressDto;
    cnpj?: Cnpj;
}

export interface RegisterCompanyDto {
    corporateName: string;
    fantasyName: string;
    address: AddressDto;
    cnpj: string;
    owner: RegisterEmployeeDto;
} 

export interface UpdateCompanyDto {
    id?: string;
    corporateName?: string;
    fantasyName?: string;
    address?: AddressDto;
}
