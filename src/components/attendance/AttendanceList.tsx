import React from "react";
import { View } from "react-native";
import { EmployeeDto } from "../../types/employee";
import { AttendanceSummary } from "../../hooks/attendance/useAttendances";
import DateRangePicker from "./DateRangePicker";
import AttendanceListView from "./AttendanceListView";
import EmployeeHeader from "./EmployeeHeader";

interface AttendanceListProps {
  attendances: AttendanceSummary[];
  employee?: EmployeeDto;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  isEmployeeView?: boolean;
}

const AttendanceList: React.FC<AttendanceListProps> = ({
  attendances,
  employee,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isEmployeeView = false,
}) => {


  console.log(isEmployeeView);

  return (
    <>
      {employee && <EmployeeHeader employee={employee} />}
      
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
      
      <AttendanceListView 
        attendances={attendances} 
        isEmployeeView={isEmployeeView} 
      />
    </>
  );
};

export default AttendanceList;