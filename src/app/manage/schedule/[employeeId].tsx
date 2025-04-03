import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import {
  RegisterDefaultSchedulesDto,
  RegisterSchedulesDto,
  AvaiblePeriodDto,
  DayOfWeek,
  ScheduleDto,
  RegisterScheduleDto,
} from "../../../types/schedule";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next"; // Added translation hook
import DefaultScheduleEditor from "../../../components/schedule/editors/DefaultScheduleEditor";
import SpecificDayScheduleEditor from "../../../components/schedule/editors/SpecificDayScheduleEditor";
import { ScheduleSummary } from "../../../components/schedule/ui";
import { globalStyles } from "../../../styles/global";
import styles from "../../../components/schedule/styles";
import api from "../../../api";

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
    const response = await api.get<ScheduleDto[]>(`/schedule/${employeeId}`);
    if (response.status === 200) {
      const defaultSchedulesResponse = response.data
        .filter((s) => s.default === true);
      
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

        const periods: AvaiblePeriodDto[] = schedule.avaiblePeriods.map(period => ({
          start: new Date(period.start),
          end: new Date(period.end)
        }));
        
        newDefaultPeriods[dayOfWeek] = periods;
      });
      
      setDefaultSchedules(prev => ({
        ...prev,
        defaultPeriods: newDefaultPeriods,
      }));
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

  const handleSaveSpecific = async () => {};

  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <ScrollView style={[globalStyles.container, styles.container]}>
      <View
        style={[globalStyles.row, globalStyles.spaceBetween, styles.header]}
      >
        <Text style={globalStyles.title}>{t("editSchedule")}</Text>
        <TouchableOpacity
          style={styles.summaryButton}
          onPress={() => setShowSummary(!showSummary)}
        >
          <Text style={styles.summaryButtonText}>
            {showSummary ? t("edit") : t("viewSummary")}
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
          <View style={styles.collapsibleSection}>
            <TouchableOpacity
              onPress={() =>
                setIsDefaultScheduleExpanded(!isDefaultScheduleExpanded)
              }
              style={styles.collapsibleHeader}
            >
              <Text style={styles.collapsibleTitle}>
                {t("defaultSchedule")}
              </Text>
              <Text>{isDefaultScheduleExpanded ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {isDefaultScheduleExpanded && (
              <DefaultScheduleEditor
                defaultPeriods={defaultSchedules.defaultPeriods}
                onPeriodsChange={handleDefaultPeriodsChange}
                onSave={handleSaveDefault}
              />
            )}
          </View>
{/* 
          <View style={styles.collapsibleSection}>
            <TouchableOpacity
              onPress={() =>
                setIsSpecificScheduleExpanded(!isSpecificScheduleExpanded)
              }
              style={styles.collapsibleHeader}
            >
              <Text style={styles.collapsibleTitle}>
                {t("defaultSchedule")}
              </Text>
              <Text>{isSpecificScheduleExpanded ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {isSpecificScheduleExpanded && (
              <SpecificDayScheduleEditor
                selectedDate={selectedDate}
                specificSchedules={specificSchedules}
                onDaySelect={handleDaySelect}
                onPeriodsChange={handleSpecificDayPeriodsChange}
                onSave={handleSaveSpecific}
              />
            )}
          </View> */}
        </>
      )}
    </ScrollView>
  );
}
