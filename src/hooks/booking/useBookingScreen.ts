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
    const timeSlots: AvailableTime[] = [];
  
    periods.forEach((period) => {
      const baseDate = new Date();
      
      // Extrair apenas horas e minutos
      const startTime = new Date(period.start);
      const endTime = new Date(period.end);
      
      const normalizedStartTime = new Date(baseDate);
      normalizedStartTime.setHours(
        startTime.getHours(),
        startTime.getMinutes(),
        0,
        0
      );
      
      const normalizedEndTime = new Date(baseDate);
      normalizedEndTime.setHours(
        endTime.getHours(),
        endTime.getMinutes(),
        0,
        0
      );
      
      // Ajustar o endTime considerando a duração do serviço
      const adjustedEndTime = new Date(normalizedEndTime);
      adjustedEndTime.setMinutes(adjustedEndTime.getMinutes() - serviceDurationMinutes);
      
      console.log("Período ajustado para duração:", {
        start: normalizedStartTime.toISOString(),
        end: adjustedEndTime.toISOString(),
        serviceDuration: `${serviceDurationMinutes} minutos`
      });
      
      let currentTime = new Date(normalizedStartTime);
      
      // Use adjustedEndTime para comparação
      while (currentTime <= adjustedEndTime) {
        const hours = currentTime.getHours().toString().padStart(2, "0");
        const minutes = currentTime.getMinutes().toString().padStart(2, "0");
        const timeString = `${hours}:${minutes}`;
        
        timeSlots.push({
          time: timeString,
          available: true,
        });
        
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
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
