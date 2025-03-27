import { CompanyDto } from './company';
import { Cpf } from './common';
import { ServiceDto } from './service';

export interface RegisterEmployeeDto {
    name: string;
    surname: string;
    email: string;
    password: string;
}

export interface EmployeeDto {
    id?: string;
    imageUrl?: string
    name?: string;
    surname?: string;
    email?: string;
    owner: boolean;
    userId?: string;
    company?: CompanyDto;
    services?: ServiceDto[];
    // public IList<ScheduleDto>? Schedules { get; init; } = [];
} 

export interface UpdateEmployeeDto 
{
    id?: string;
    name?: string;
    surname?: string;
    email?: string;
    servicesIds?: string[];
} 