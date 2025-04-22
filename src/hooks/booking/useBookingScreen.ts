import { useTranslation } from "react-i18next";
import api from "../../api";
import {
  AvaiblePeriodDto,
  AvailableTime,
  EmployeeScheduleDto,
} from "../../types/schedule";
import { usePeriods } from "../periods/usePeriods";

const useBookingScreen = () => {
  const {  mergeAvailablePeriods } = usePeriods();


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


  return {
    getSchedules,
    convertPeriodsToTimeSlots,
  };
};

export default useBookingScreen;
