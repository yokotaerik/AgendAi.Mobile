export interface PhotoUploadDto {
    file: File; // Use the File type in TypeScript
    entityId: string; // Use string to represent GUIDs in TypeScript
    entityType: EntitiesAssociation; // Ensure EntitiesAssociation is defined elsewhere
}

export enum EntitiesAssociation
{
    Company,
    Employee
}
