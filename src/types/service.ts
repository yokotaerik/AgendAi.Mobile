export interface ServiceDto {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string; 
    companyId: string;
    campaign?: CampaignDiscountDto;
}

export interface CampaignDiscountDto {
    percentage: number;
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
