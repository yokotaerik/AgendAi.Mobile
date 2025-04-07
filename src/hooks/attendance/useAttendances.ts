import { useState, useEffect, useTransition } from 'react';
import useTimeSpan from '../utils/useTimeSpan';
import { AttendanceDto } from '../../types/schedule';
import api from '../../api';
import { useTranslation } from 'react-i18next';
import { UserType } from '../../types/common';

export interface AttendanceSummary {
  attendance: AttendanceDto;
  totalPrice: number;
  totalDuration: string;
}

export const useAttendances = () => {
  const { t } = useTranslation();
  const [attendances, setAttendances] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { convertToTimeSpan, convertToMinutes } = useTimeSpan();

  const fetchOneAttendance = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/attendance/${id}`);

      if(response.status != 200) throw Error("Error ")

      const data: AttendanceDto = response.data as AttendanceDto

      return data
    } catch (err) {
      setError(t("loadingError"));
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  }

  const fetchAttendances = async (startDate: string, endDate: string, userType: UserType, id?: string , companyId?: string) => {
    
    // FIX DATA

    let newDate = new Date(startDate)
    newDate.setDate(newDate.getDate() - 1)
    startDate = newDate.toISOString()

    
    try {
      setLoading(true);
      const response = await api.get('/attendance', {
        params: {
          [userType === UserType.Customer ? 'customerId' : 'employeeId']: id,
          startDate,
          endDate,
        }
      });

      if(response.status != 200) throw Error("Error ")

      const data: AttendanceDto[] = response.data as AttendanceDto[]

      const processedAttendances = data.map(attendance => {
        const totalPrice = attendance.services.reduce((sum, service) => sum + service.price, 0);
        
        const totalMinutes = attendance.services.reduce((sum, service) => {
          return sum + convertToMinutes(service.duration);
        }, 0);

        const totalDuration = convertToTimeSpan(totalMinutes);

        return {
          attendance,
          totalPrice,
          totalDuration
        };
      });

      setAttendances(processedAttendances);
    } catch (err) {
      setError(t("loadingError"));
      console.error('Error fetching attendances:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchOneAttendance,
    fetchAttendances,
    attendances,
    loading,
    error
  };
}; 