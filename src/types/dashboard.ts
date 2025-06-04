export interface EmployeePerformanceDto {
  employeeId: string;
  employeeName: string;
  totalAppointments: number;
  totalRevenueGenerated: number;
  averageDuration: string;
}

export interface PerformanceDashboardDto {
  periodStart: string;
  periodEnd: string;
  totalAppointments: number;
  confirmedAppointments: number;
  canceledAppointments: number;
  totalRevenue: number;
  averageDuration: string;
  employeePerformances: EmployeePerformanceDto[];
}

export interface DashboardFilterDto {
  companyId: string;
  startDate: string;
  endDate: string;
}