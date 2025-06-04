export interface CreateCampaignDto {
  companyId: string; 
  name: string;
  description?: string;
  discountPercentage: number;
  startDate: string; 
  endDate: string;
}

export interface UpdateCampaignDto {
  id: string;
  name: string;
  description?: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export interface CampaignDto {
  id: string;
  name: string;
  description?: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}
