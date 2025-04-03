import { useState, useEffect, useCallback } from "react";
import { ServiceDto } from "../../types/service";
import { AvailableTime, ScheduleDto } from "../../types/schedule";
import useBookingScreen from "./useBookingScreen";
import { set } from "date-fns";
import useTimeSpan from "../utils/useTimeSpan";

interface Employee {
  id: string;
  name: string;
  photoUrl?: string;
}

export const useBooking = (services: ServiceDto[]) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectServices, setSelectServices] = useState<ServiceDto[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("any");
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const { getSchedules, convertPeriodsToTimeSlots } = useBookingScreen();
  const { convertToMinutes } = useTimeSpan();

  const fetchSchedules = useCallback(async () => {
    if (!selectedDate)
      // Definimir como primeiro dia do mes
      setSelectedDate(new Date().toISOString().split("T")[0]);

    try {
      const response = await getSchedules(
        services.map((service) => service.id),
        selectedDate
      );

      const newEmployees: Employee[] = [];
      const allSchedules: ScheduleDto[] = [];

      response.forEach((item) => {
        if (item.schedules && item.schedules.length > 0) {
          newEmployees.push({
            id: item.schedules[0].employeeId,
            name: item.employeeName,
            photoUrl: item.imageUrl,
          });

          allSchedules.push(...item.schedules);
        }
      });

      setSchedules(allSchedules);
      setEmployees(newEmployees);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  }, [selectedDate]);

  const updateAvailableTimes = useCallback(
    (
      filteredSchedules: ScheduleDto[],
      employeeId: string | null,
      totalServiceTime: number
    ) => {
      if (!filteredSchedules) return;

      if (employeeId && employeeId !== "any") {
        filteredSchedules = filteredSchedules.filter(
          (schedule: ScheduleDto) => schedule.employeeId === employeeId
        );
      }
      const newAvailableTimes: AvailableTime[] = [];
      filteredSchedules.forEach((schedule) => {
        if (schedule.avaiblePeriods && schedule.avaiblePeriods.length > 0) {
          schedule.avaiblePeriods.forEach((period) => {
            newAvailableTimes.push(
              ...convertPeriodsToTimeSlots([period], 15, totalServiceTime)
            );
          });
        }
      });
      const uniqueTimes = Array.from(
        new Map(newAvailableTimes.map((item) => [item.time, item])).values()
      );

      uniqueTimes.sort((a, b) => {
        const timeA = set(new Date(), {
          hours: Number(a.time.split(":")[0]),
          minutes: Number(a.time.split(":")[1]),
        });
        const timeB = set(new Date(), {
          hours: Number(b.time.split(":")[0]),
          minutes: Number(b.time.split(":")[1]),
        });
        return timeA.getTime() - timeB.getTime();
      });


      setAvailableTimes(uniqueTimes);
    },
    [schedules, convertPeriodsToTimeSlots]
  );

  useEffect(() => {
    fetchSchedules();
  }, [selectedMonth]);

  useEffect(() => {
    const selectedSchedules = schedules.filter(
      (schedule: ScheduleDto) => schedule.date === selectedDate
    );

    const totalServiceTime = services.reduce(
      (acc, service) => acc + convertToMinutes(service.duration),
      0
    );

    updateAvailableTimes(selectedSchedules, selectedEmployee, totalServiceTime);
  }, [selectedDate, selectedEmployee, schedules]);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const handleEmployeeSelect = useCallback((employeeId: string) => {
    setSelectedEmployee(employeeId);
  }, []);

  const handleServiceSelect = useCallback((services: ServiceDto[]) => {
    setSelectServices(services);
  }, []);

  return {
    selectedDate,
    selectedTime,
    selectedMonth,
    selectedEmployee,
    selectServices,
    availableTimes,
    employees,
    handleDateSelect,
    handleTimeSelect,
    handleEmployeeSelect,
    handleServiceSelect,
  };
};
