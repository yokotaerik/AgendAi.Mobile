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
