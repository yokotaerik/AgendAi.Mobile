export enum EntitiesAssociation {
  Employee = 0,
  Company = 1,
}

// Update your PhotoUploadDto type to include these optional properties
export interface PhotoUploadDto {
  file?: File;
  uri?: string;
  name?: string;
  type?: string;
  entityId: string;
  entityType: EntitiesAssociation;
}
