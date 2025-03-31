import { View, Text } from "react-native";
import {
  RegisterSchedulesDto,
  AvaiblePeriodDto,
} from "../../../types/schedule";
import { MonthCalendar, DayScheduleEditor } from "../ui";
import { stylesSchedulePage as styles } from "../../../app/manage/schedule/[employeeId]";

const SpecificDayScheduleEditor = ({
  selectedDate,
  specificSchedules,
  onDaySelect,
  onPeriodsChange,
}: {
  selectedDate: string | null;
  specificSchedules: RegisterSchedulesDto;
  onDaySelect: (date: string) => void;
  onPeriodsChange: (periods: AvaiblePeriodDto[]) => void;
}) => {
  return (
    <View style={styles.componentContainer}>
      <Text style={styles.componentTitle}>Agendas Específicas</Text>
      <MonthCalendar
        onDaySelect={onDaySelect}
        markedDates={specificSchedules.schedules.reduce(
          (acc, schedule) => ({
            ...acc,
            [schedule.date]: { marked: true, dotColor: "#1976d2" },
          }),
          {}
        )}
      />

      {selectedDate && (
        <DayScheduleEditor
          dayName={new Date(selectedDate).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
          periods={
            specificSchedules.schedules.find(
              (schedule) => schedule.date === selectedDate
            )?.avaiblePeriods || []
          }
          onPeriodsChange={onPeriodsChange}
        />
      )}
    </View>
  );
};

export default SpecificDayScheduleEditor;
