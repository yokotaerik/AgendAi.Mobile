import { AddressDto, Cnpj, BasicInfoDto } from './common';
import { RegisterEmployeeDto } from './employee';
import { ReviewDto } from './schedule';
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
    reviews?: ReviewDto[];
}

export interface CompanyDto {
    id?: string;
    imageUrl?: string;
    corporateName?: string;
    fantasyName?: string;
    address?: AddressDto;
    cnpj?: Cnpj;
    rating: number;
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
