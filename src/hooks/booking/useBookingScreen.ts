import { useTranslation } from "react-i18next";
import api from "../../api";
import { AvaiblePeriodDto, AvailableTime, EmployeeScheduleDto } from "../../types/schedule";

const useBookingScreen = () => {
  const { t } = useTranslation("booking");

  const getSchedules = async (servicesIds: string[], startDate: string) : Promise<EmployeeScheduleDto[]> => {
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
    intervalMinutes: number = 15
  ): AvailableTime[] {
    const timeSlots: AvailableTime[] = [];
    
    // Primeiro, criamos todos os slots possíveis para o dia (00:00 até 23:45)
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push({
          time: timeString,
          available: false
        });
      }
    }
    
    // Depois marcamos os slots disponíveis com base nos períodos
    periods.forEach(period => {
      const startTime = period.start;
      const endTime = period.end;
      
      timeSlots.forEach(slot => {
        // Parse do horário do slot
        const [hours, minutes] = slot.time.split(':').map(Number);
        const slotDate = new Date();
        slotDate.setHours(hours, minutes, 0, 0);
        
        // Verifica se o slot está dentro do período disponível
        if (slotDate >= startTime && slotDate < endTime) {
          slot.available = true;
        }
      });
    });
    
    return timeSlots;
  }


  return {
    getSchedules,
    convertPeriodsToTimeSlots,
  };
};

export default useBookingScreen;
