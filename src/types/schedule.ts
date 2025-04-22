import { BasicInfoDto } from "./common";
import { ServiceDto } from "./service";

export interface RegisterDefaultSchedulesDto {
  employeeId: string;
  defaultPeriods: Record<DayOfWeek, AvaiblePeriodDto[]>;
}

export interface AvaiblePeriodDto {
  start: Date;
  end: Date;
}

export interface RegisterSchedulesDto {
  schedules: RegisterScheduleDto[];
  employeeId: string;
}

export interface RegisterScheduleDto {
  avaiblePeriods: AvaiblePeriodDto[];
  date: string; // Use `string` for DateOnly equivalent in TypeScript
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface ScheduleDto {
  id: string;
  date: string; 
  employeeId: string;
  avaiblePeriods: AvaiblePeriodDto[];
  default: boolean;
}

export interface EmployeeScheduleDto
{
    employeeName: string;
    imageUrl?: string;
    schedules: ScheduleDto[];
}

export interface AvailableTime {
  time: string;
  available: boolean;
}

export interface AttendanceDto {
  id: string;
  dateTime: Date;
  costumer: BasicInfoDto;
  status: AttendanceStatus;
  employee: BasicInfoDto;
  services: ServiceDto[];
  companyId: string;
}

export enum AttendanceStatus {
  Canceled = 2,
  Confirmed = 3,
  WaitingCompanyConfirmation = 4,
  WaitingCustomerConfirmation = 6,
}