import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  RegisterSchedulesDto,
  AvaiblePeriodDto,
} from "../../../types/schedule";
import { MonthCalendar, DayScheduleEditor } from "../ui";
import { useTranslation } from "react-i18next";
import { theme } from "../../../styles/theme";
import * as Localization from "expo-localization";

type SpecificDayScheduleEditorProps = {
  specificSchedule?: RegisterSchedulesDto;
  onDayChange: (selectedDate: string) => void;
  onSave: (schedules: RegisterSchedulesDto) => void;
};

const SpecificDayScheduleEditor = ({
  specificSchedule,
  onSave,
  onDayChange,
}: SpecificDayScheduleEditorProps) => {
  const { t } = useTranslation();
  const deviceLocale = Localization.getLocales()[0].languageTag;

  const defaultSchedule: RegisterSchedulesDto = {
    employeeId: specificSchedule?.employeeId || "",
    schedules: [],
  };

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [specificSchedules, setSpecificSchedules] =
    useState<RegisterSchedulesDto>(specificSchedule || defaultSchedule);

  // Update the useEffect to also set the selectedDate when specificSchedule changes
  useEffect(() => {
    if (specificSchedule) {
      setSpecificSchedules(specificSchedule);

      // If there's a schedule with a date, select it automatically
      if (specificSchedule.schedules && specificSchedule.schedules.length > 0) {
        const firstDate = specificSchedule.schedules[0].date;
        setSelectedDate(firstDate);
      }
    }
  }, [specificSchedule]);

  const onDaySelect = (day: string) => {
    console.log("Day selected in editor:", day);
    setSelectedDate(day);
    onDayChange(day);
  };

  const onPeriodsChange = (periods: AvaiblePeriodDto[]) => {
    if (!selectedDate) return;

    setSpecificSchedules((prev) => {
      // Create a safe copy of schedules
      const currentSchedules = prev?.schedules || [];

      const existingScheduleIndex = currentSchedules.findIndex(
        (schedule) =>
          new Date(schedule.date).toISOString().split("T")[0] ===
          new Date(selectedDate).toISOString().split("T")[0]
      );

      const newSchedules = [...currentSchedules];

      if (existingScheduleIndex >= 0) {
        newSchedules[existingScheduleIndex] = {
          ...newSchedules[existingScheduleIndex],
          avaiblePeriods: periods,
        };
      } else {
        // Add new schedule
        newSchedules.push({
          date: selectedDate,
          avaiblePeriods: periods,
        });
      }

      return {
        employeeId: prev?.employeeId || "",
        schedules: newSchedules,
      };
    });
  };

  const handleSave = () => {
    onSave(specificSchedules);
  };

  // Safely create markedDates object
  const markedDates = (specificSchedules?.schedules || []).reduce(
    (acc, schedule) => ({
      ...acc,
      [schedule.date]: { marked: true, dotColor: theme.colors.primary },
    }),
    {}
  );

  return (
    <View style={componentStyles.container}>
      <MonthCalendar onDaySelect={onDaySelect} markedDates={markedDates} />

      {selectedDate && (
        <View style={componentStyles.editorContainer}>
          <DayScheduleEditor
            dayName={(() => {
              const date = new Date(selectedDate);
              date.setUTCHours(12);
              return date.toLocaleDateString(deviceLocale, {
                weekday: "long",
                day: "numeric",
                month: "long",
              });
            })()}
            periods={
              (specificSchedules?.schedules || []).find((schedule) => {
                const scheduleDate = new Date(schedule.date)
                  .toISOString()
                  .split("T")[0];
                const selectedDateFormatted = new Date(selectedDate)
                  .toISOString()
                  .split("T")[0];
                return scheduleDate === selectedDateFormatted;
              })?.avaiblePeriods || []
            }
            onPeriodsChange={onPeriodsChange}
            day={selectedDate}
          />
        </View>
      )}
      <TouchableOpacity style={componentStyles.saveButton} onPress={handleSave}>
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
