export interface ServiceDto {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string; 
    companyId: string;
}

export interface CreateServiceDto {
    name: string;
    description: string;
    price: number;
    duration: string;
    companyId: string;
}

export interface UpdateServiceDto {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    duration?: string;
}
