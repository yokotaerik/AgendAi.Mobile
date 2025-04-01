import { View, Text, TouchableOpacity } from "react-native";
import {
  RegisterSchedulesDto,
  AvaiblePeriodDto,
} from "../../../types/schedule";
import { MonthCalendar, DayScheduleEditor } from "../ui";
import styles from "../styles";
import { globalStyles } from "../../../styles/global";
import { useTranslation } from "react-i18next";

const SpecificDayScheduleEditor = ({
  selectedDate,
  specificSchedules,
  onDaySelect,
  onPeriodsChange,
  onSave,
}: {
  selectedDate: string | null;
  specificSchedules: RegisterSchedulesDto;
  onDaySelect: (date: string) => void;
  onPeriodsChange: (periods: AvaiblePeriodDto[]) => void;
  onSave: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <View>
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
      <TouchableOpacity
        style={[globalStyles.button, styles.saveButton]}
        onPress={onSave}
      >
        <Text style={globalStyles.buttonText}>{t("saveChanges")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpecificDayScheduleEditor;
