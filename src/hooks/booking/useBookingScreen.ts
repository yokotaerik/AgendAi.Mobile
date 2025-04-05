import { useTranslation } from "react-i18next";
import api from "../../api";
import {
  AvaiblePeriodDto,
  AvailableTime,
  EmployeeScheduleDto,
} from "../../types/schedule";

const useBookingScreen = () => {
  const getSchedules = async (
    servicesIds: string[],
    startDate: string
  ): Promise<EmployeeScheduleDto[]> => {
    const response = await api.get("schedule/booking", {
      params: {
        servicesIds: servicesIds.join(","),
        startDate: startDate,
      },
    });

    return response.data as EmployeeScheduleDto[];
  };

  function convertPeriodsToTimeSlots(
    periods: AvaiblePeriodDto[],
    intervalMinutes: number = 15,
    serviceDurationMinutes: number = 0
  ): AvailableTime[] {
    const safePeriods = periods.map(p => ({
      ...p,
      start: new Date(p.start),
      end: new Date(p.end),
    }));
    
    const mergedPeriods = mergeAvailablePeriods(safePeriods);
    console.log("Períodos combinados:", mergedPeriods);

    const timeSlots: AvailableTime[] = [];
    const baseDate = new Date(); // Usado apenas para normalização

    mergedPeriods.forEach((period) => {
      const start = new Date(period.start);
      const end = new Date(period.end);

      // Normaliza as horas/minutos para o mesmo dia (baseDate)
      const normalizedStart = new Date(baseDate);
      normalizedStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

      const normalizedEnd = new Date(baseDate);
      normalizedEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);

      // Ajusta o fim considerando a duração do serviço
      const adjustedEnd = new Date(
        normalizedEnd.getTime() - serviceDurationMinutes * 60000
      );

      // Gera os slots de tempo
      let current = new Date(normalizedStart);
      while (current <= adjustedEnd) {
        const timeString = `${current
          .getHours()
          .toString()
          .padStart(2, "0")}:${current
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        timeSlots.push({ time: timeString, available: true });

        current = new Date(current.getTime() + intervalMinutes * 60000);
      }
    });

    return timeSlots;
  }

  function areTimesEqual(date1: Date, date2: Date): boolean {
    return (
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    );
  }
  
  function mergeAvailablePeriods(periods: AvaiblePeriodDto[]): AvaiblePeriodDto[] {
    console.log("Períodos antes da ordenação:", periods);

    periods.sort((a, b) => {
      const dateDiff = a.start.getTime() - b.start.getTime();
      return dateDiff;
    });
  
    const merged: AvaiblePeriodDto[] = [];
    let current: AvaiblePeriodDto | null = null;
  
    for (const period of periods) {
      if (!current) {
        current = { ...period };
      } else if (areTimesEqual(current.end, period.start)) {
        current.end = getLaterTime(current.end, period.end);
      } else {
        merged.push(current);
        current = { ...period };
      }
    }
  
    if (current) {
      merged.push(current);
    }
  
    return merged;
  }

  function getLaterTime(date1: Date, date2: Date): Date {
    const d1Minutes = date1.getHours() * 60 + date1.getMinutes();
    const d2Minutes = date2.getHours() * 60 + date2.getMinutes();
    return d1Minutes >= d2Minutes ? date1 : date2;
  }

  return {
    getSchedules,
    convertPeriodsToTimeSlots,
  };
};

export default useBookingScreen;
