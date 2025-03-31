import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  RegisterDefaultSchedulesDto,
  RegisterSchedulesDto,
  AvaiblePeriodDto,
  DayOfWeek,
} from "../../../types/schedule";
import { useLocalSearchParams } from "expo-router";
import DefaultScheduleEditor from "../../../components/schedule/editors/DefaultScheduleEditor";
import SpecificDayScheduleEditor from "../../../components/schedule/editors/SpecificDayScheduleEditor";
import { ScheduleSummary } from "../../../components/schedule/ui";

// Specific Day Schedule Component

export default function EmployeeScheduleScreen() {
  const { employeeId } = useLocalSearchParams<{ employeeId: string }>();
  const [showSummary, setShowSummary] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [defaultSchedules, setDefaultSchedules] =
    useState<RegisterDefaultSchedulesDto>({
      employeeId: employeeId || "",
      defaultPeriods: {
        [DayOfWeek.Sunday]: [],
        [DayOfWeek.Monday]: [],
        [DayOfWeek.Tuesday]: [],
        [DayOfWeek.Wednesday]: [],
        [DayOfWeek.Thursday]: [],
        [DayOfWeek.Friday]: [],
        [DayOfWeek.Saturday]: [],
      },
    });

  const [specificSchedules, setSpecificSchedules] =
    useState<RegisterSchedulesDto>({
      employeeId: employeeId || "",
      schedules: [],
    });

  const handleDefaultPeriodsChange = (
    periods: Record<DayOfWeek, AvaiblePeriodDto[]>
  ) => {
    setDefaultSchedules((prev) => ({
      ...prev,
      defaultPeriods: periods,
    }));
  };

  const handleDaySelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleSpecificDayPeriodsChange = (periods: AvaiblePeriodDto[]) => {
    if (!selectedDate) return;

    setSpecificSchedules((prev) => {
      const existingScheduleIndex = prev.schedules.findIndex(
        (schedule) => schedule.date === selectedDate
      );

      if (existingScheduleIndex >= 0) {
        const newSchedules = [...prev.schedules];
        newSchedules[existingScheduleIndex] = {
          date: selectedDate,
          avaiblePeriods: periods,
        };
        return { ...prev, schedules: newSchedules };
      }

      return {
        ...prev,
        schedules: [
          ...prev.schedules,
          {
            date: selectedDate,
            avaiblePeriods: periods,
          },
        ],
      };
    });
  };

  const handleSave = async () => {
    // TODO: Implementar chamada à API para salvar as alterações
    console.log("Salvando agenda:", defaultSchedules.defaultPeriods[0]);
  };

  return (
    <ScrollView style={stylesSchedulePage.container}>
      <View style={stylesSchedulePage.header}>
        <Text style={stylesSchedulePage.title}>Editar Agenda</Text>
        <TouchableOpacity
          style={stylesSchedulePage.summaryButton}
          onPress={() => setShowSummary(!showSummary)}
        >
          <Text style={stylesSchedulePage.summaryButtonText}>
            {showSummary ? "Editar" : "Ver Resumo"}
          </Text>
        </TouchableOpacity>
      </View>

      {showSummary ? (
        <ScheduleSummary
          defaultSchedules={defaultSchedules}
          specificSchedules={specificSchedules}
        />
      ) : (
        <>
          <DefaultScheduleEditor
            defaultPeriods={defaultSchedules.defaultPeriods}
            onPeriodsChange={handleDefaultPeriodsChange}
          />

          <SpecificDayScheduleEditor
            selectedDate={selectedDate}
            specificSchedules={specificSchedules}
            onDaySelect={handleDaySelect}
            onPeriodsChange={handleSpecificDayPeriodsChange}
          />

          <TouchableOpacity
            style={stylesSchedulePage.saveButton}
            onPress={handleSave}
          >
            <Text style={stylesSchedulePage.saveButtonText}>
              Salvar Alterações
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

export const stylesSchedulePage = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  componentContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  componentTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  summaryButton: {
    padding: 8,
    backgroundColor: "#e3f2fd",
    borderRadius: 4,
  },
  summaryButtonText: {
    color: "#1976d2",
    fontWeight: "500",
  },
  saveButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#1976d2",
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
