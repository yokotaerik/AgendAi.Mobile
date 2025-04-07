import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import {
  RegisterDefaultSchedulesDto,
  RegisterSchedulesDto,
  AvaiblePeriodDto,
  DayOfWeek,
  ScheduleDto,
} from "../../../types/schedule";
import { useLocalSearchParams, router } from "expo-router";
import { useTranslation } from "react-i18next";
import DefaultScheduleEditor from "../../../components/schedule/editors/DefaultScheduleEditor";
import SpecificDayScheduleEditor from "../../../components/schedule/editors/SpecificDayScheduleEditor";
import { ScheduleSummary } from "../../../components/schedule/ui";
import styles from "../../../components/schedule/styles";
import api from "../../../api";
import { theme } from "../../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmployeeScheduleScreen() {
  const { t } = useTranslation();
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
  const [isDefaultScheduleExpanded, setIsDefaultScheduleExpanded] =
    useState(false);
  const [isSpecificScheduleExpanded, setIsSpecificScheduleExpanded] =
    useState(false);

  const [specificSchedules, setSpecificSchedules] =
    useState<RegisterSchedulesDto>({
      employeeId: employeeId || "",
      schedules: [],
    });

  // Existing handlers remain unchanged
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

  const getSchedules = async () => {
    const response = await api.get<ScheduleDto[]>(
      `/schedule/employee/${employeeId}`
    );
    if (response.status === 200) {
      const defaultSchedulesResponse = response.data.filter(
        (s) => s.default === true
      );

      const newDefaultPeriods = {
        [DayOfWeek.Sunday]: [] as AvaiblePeriodDto[],
        [DayOfWeek.Monday]: [] as AvaiblePeriodDto[],
        [DayOfWeek.Tuesday]: [] as AvaiblePeriodDto[],
        [DayOfWeek.Wednesday]: [] as AvaiblePeriodDto[],
        [DayOfWeek.Thursday]: [] as AvaiblePeriodDto[],
        [DayOfWeek.Friday]: [] as AvaiblePeriodDto[],
        [DayOfWeek.Saturday]: [] as AvaiblePeriodDto[],
      };

      defaultSchedulesResponse.forEach((schedule) => {
        const date = new Date(schedule.date);
        date.setHours(date.getHours() + 12);
        const dayOfWeek = date.getDay() as DayOfWeek;

        const periods: AvaiblePeriodDto[] = schedule.avaiblePeriods.map(
          (period) => ({
            start: new Date(period.start),
            end: new Date(period.end),
          })
        );

        newDefaultPeriods[dayOfWeek] = periods;
      });

      setDefaultSchedules((prev) => ({
        ...prev,
        defaultPeriods: newDefaultPeriods,
      }));

      const otherPeiods = response.data.filter((s) => s.default === false);
      const newSpecificSchedules = otherPeiods.map((schedule) => {
        
        const date = new Date(schedule.date);
        date.setHours(date.getHours() + 12);
        return {
          date: date.toISOString(),
          avaiblePeriods: schedule.avaiblePeriods.map((period) => ({
            start: new Date(period.start),
            end: new Date(period.end),
          })),
        };
      });
      setSpecificSchedules((prev) => ({
        ...prev,
        schedules: newSpecificSchedules,
      }));
      console.log(specificSchedules);
      
    } else {
      alert(t("errorFetchingSchedules"));
    }
  };

  const handleSaveDefault = async () => {
    const response = await api.post("/schedule/default", defaultSchedules);
    if (response.status === 200) {
      alert(t("scheduleSaved"));
    } else {
      alert(t("errorSavingSchedule"));
    }
  };

  const handleSaveSpecific = async () => {
    // Implementation for saving specific schedules
    const response = await api.post("/schedule/specific", specificSchedules);
    if (response.status === 200) {
      alert(t("scheduleSaved"));
    } else {
      alert(t("errorSavingSchedule"));
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <SafeAreaView style={screenStyles.container}>
      <ScrollView>
        <View style={screenStyles.header}>
          <TouchableOpacity
            style={screenStyles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>

          <Text style={screenStyles.title}>{t("editSchedule")}</Text>

          <TouchableOpacity
            style={screenStyles.summaryButton}
            onPress={() => setShowSummary(!showSummary)}
          >
            <Text style={screenStyles.summaryButtonText}>
              {showSummary ? t("edit") : t("viewSummary")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={screenStyles.content}>
          {showSummary ? (
            <View style={screenStyles.summaryContainer}>
              <ScheduleSummary
                defaultSchedules={defaultSchedules}
                specificSchedules={specificSchedules}
              />
            </View>
          ) : (
            <>
              <View style={screenStyles.collapsibleSection}>
                <TouchableOpacity
                  onPress={() =>
                    setIsDefaultScheduleExpanded(!isDefaultScheduleExpanded)
                  }
                  style={[
                    screenStyles.collapsibleHeader,
                    isDefaultScheduleExpanded
                      ? screenStyles.collapisbleHeaderOpen
                      : { backgroundColor: theme.colors.primary }
                  ]}
                >
                  <Text style={screenStyles.collapsibleTitle}>
                    {t("defaultSchedule")}
                  </Text>
                  <Ionicons
                    name={
                      isDefaultScheduleExpanded ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                    color={theme.colors.text.primary}
                  />
                </TouchableOpacity>

                {isDefaultScheduleExpanded && (
                  <View style={screenStyles.editorContainer}>
                    <DefaultScheduleEditor
                      defaultPeriods={defaultSchedules.defaultPeriods}
                      onPeriodsChange={handleDefaultPeriodsChange}
                      onSave={handleSaveDefault}
                    />
                  </View>
                )}
              </View>

              <View style={screenStyles.collapsibleSection}>
                <TouchableOpacity
                  onPress={() =>
                    setIsSpecificScheduleExpanded(!isSpecificScheduleExpanded)
                  }
                  style={[
                    screenStyles.collapsibleHeader,
                    isSpecificScheduleExpanded
                      ? screenStyles.collapisbleHeaderOpen
                      : { backgroundColor: theme.colors.primary }
                  ]}
                >
                  <Text style={screenStyles.collapsibleTitle}>
                    {t("specificSchedule")}
                  </Text>
                  <Ionicons
                    name={
                      isSpecificScheduleExpanded ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                    color={theme.colors.text.primary}
                  />
                </TouchableOpacity>

                {isSpecificScheduleExpanded && (
                  <View style={screenStyles.editorContainer}>
                    <SpecificDayScheduleEditor
                      selectedDate={selectedDate}
                      specificSchedules={specificSchedules}
                      onDaySelect={handleDaySelect}
                      onPeriodsChange={handleSpecificDayPeriodsChange}
                      onSave={handleSaveSpecific}
                    />
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  summaryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
  },
  summaryButtonText: {
    color: theme.colors.primary,
    fontWeight: "500",
    fontSize: theme.typography.fontSize.sm,
  },
  content: {
    padding: theme.spacing.md,
  },
  summaryContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  collapsibleSection: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  collapisbleHeaderOpen: {
    backgroundColor: theme.colors.background, 
  },
  collapsibleTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  editorContainer: {
    padding: theme.spacing.md,
  },
});
