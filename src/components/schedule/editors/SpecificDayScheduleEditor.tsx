import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  RegisterSchedulesDto,
  AvaiblePeriodDto,
} from "../../../types/schedule";
import { MonthCalendar, DayScheduleEditor } from "../ui";
import styles from "../styles";
import { useTranslation } from "react-i18next";
import { theme } from "../../../styles/theme";

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

  console.log("Dentro do componente", specificSchedules);

  return (
    <View style={componentStyles.container}>
      <MonthCalendar
        onDaySelect={onDaySelect}
        markedDates={specificSchedules.schedules.reduce(
          (acc, schedule) => ({
            ...acc,
            [schedule.date]: { marked: true, dotColor: theme.colors.primary },
          }),
          {}
        )}
      />

      {selectedDate && (
        <View style={componentStyles.editorContainer}>
          <DayScheduleEditor
            dayName={new Date(selectedDate).toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            periods={
              specificSchedules.schedules.find(
                (schedule) =>
                  new Date(schedule.date).getDate() ===
                  new Date(selectedDate).getDate()
              )?.avaiblePeriods || []
            }
            onPeriodsChange={onPeriodsChange}
          />
        </View>
      )}
      <TouchableOpacity style={componentStyles.saveButton} onPress={onSave}>
        <Text style={componentStyles.saveButtonText}>{t("saveChanges")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const componentStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  editorContainer: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
  },
});

export default SpecificDayScheduleEditor;
