export enum EntitiesAssociation {
  Employee = 0,
  Service = 1,
  Company = 2,
}

export interface PhotoUploadDto {
  // For web
  file?: File;
  // For React Native
  uri?: string;
  type?: string;
  fileName?: string;
  // Common properties
  entityId: string;
  entityType: EntitiesAssociation;
}
