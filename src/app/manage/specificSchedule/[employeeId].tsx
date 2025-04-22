import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import SpecificDayScheduleEditor from "../../../components/schedule/editors/SpecificDayScheduleEditor";
import api from "../../../api";
import { useEffect, useState } from "react";
import { RegisterSchedulesDto } from "../../../types/schedule";
import LoadingComponent from "../../../components/ui/LoadingComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const SpecificDayScheduleEditorScreen = () => {
  const { t } = useTranslation();
  const { employeeId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string | undefined>();
  const [specificSchedule, setSpecificSchedule] =
    useState<RegisterSchedulesDto>({
      employeeId: employeeId as string,
      schedules: [],
    });

  // Remove the initial useEffect that fetches all schedules
  // useEffect(() => {
  //   // Initial load of all specific schedules
  //   fetchAllSpecificSchedules();
  // }, []);

  // Instead, just initialize with an empty schedule and wait for user to select a date
  useEffect(() => {
    if (date) {
      setLoading(true);
      fetchScheduleDay(date)
        .then((schedule) => {
          if (schedule) {
            setSpecificSchedule(schedule);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Set initial empty state without fetching
      setSpecificSchedule({
        employeeId: employeeId as string,
        schedules: [],
      });
      setLoading(false);
    }
  }, [date]);

  const fetchAllSpecificSchedules = async () => {
    try {
      setLoading(true);
      const response = (await api.get(
        `/schedule/employee/${employeeId}`
      )) as any;

      if (response.status === 200) {
        // Filter non-default schedules
        const specificDays = response.data.filter(
          (s: any) => s.default === false
        );

        if (specificDays.length > 0) {
          // Format the data
          const schedules = specificDays.map((schedule: any) => {
            return {
              date: new Date(schedule.date).toISOString(),
              avaiblePeriods: schedule.avaiblePeriods.map((period: any) => ({
                start: new Date(period.start),
                end: new Date(period.end),
              })),
            };
          });

          setSpecificSchedule({
            employeeId: employeeId as string,
            schedules: schedules,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      Alert.alert(t("error"), t("errorFetchingSchedules"));
    } finally {
      setLoading(false);
    }
  };

  // Keep only this improved version of fetchScheduleDay and remove the duplicate
  const fetchScheduleDay = async (date: string) => {
    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const response = (await api.get(`/schedule/employee/${employeeId}`, {
        params: {
          date: formattedDate,
        },
      })) as any;

      if (response.status === 200) {
        // Even if we don't find a specific schedule, we need to return a valid object
        // with the selected date so the UI can show the editor for that day
        const scheduleData = response.data.length > 0 ? response.data[0] : null;

        if (
          scheduleData &&
          scheduleData.avaiblePeriods &&
          scheduleData.avaiblePeriods.length > 0
        ) {
          return {
            employeeId: employeeId as string,
            schedules: [
              {
                date: date, // Use the original date to maintain consistency
                avaiblePeriods: scheduleData.avaiblePeriods.map(
                  (period: any) => ({
                    start: new Date(period.start),
                    end: new Date(period.end),
                  })
                ),
              },
            ],
          };
        }

        // Return a schedule with the selected date but empty periods
        return {
          employeeId: employeeId as string,
          schedules: [
            {
              date: date,
              avaiblePeriods: [],
            },
          ],
        };
      }

      // Return a schedule with the selected date but empty periods
      return {
        employeeId: employeeId as string,
        schedules: [
          {
            date: date,
            avaiblePeriods: [],
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching day schedule:", error);
      Alert.alert(t("error"), t("errorFetchingDaySchedule"));

      // Even on error, return a valid object with the selected date
      return {
        employeeId: employeeId as string,
        schedules: [
          {
            date: date,
            avaiblePeriods: [],
          },
        ],
      };
    }
  };

  const handleSaveSchedule = async (updatedSchedule: RegisterSchedulesDto) => {
    try {
      setLoading(true);

      // Format the data for API
      const formattedSchedules = {
        ...updatedSchedule,
        schedules: updatedSchedule.schedules.map((schedule) => ({
          date: new Date(schedule.date).toISOString().split("T")[0],
          avaiblePeriods: schedule.avaiblePeriods.map((period) => ({
            start: period.start.toISOString(),
            end: period.end.toISOString(),
          })),
        })),
      };

      const response = await api.post("/schedule", formattedSchedules);

      if (response.status === 200) {
        Alert.alert(t("success"), t("scheduleSaved"));
        // Refresh data
        if (date) {
          fetchScheduleDay(date);
        } else {
          fetchAllSpecificSchedules();
        }
      } else {
        Alert.alert(t("error"), t("errorSavingSchedule"));
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      Alert.alert(t("error"), t("errorSavingSchedule"));
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (selectedDate: string) => {
    console.log("Selected date:", selectedDate);
    setDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{t("specificSchedule")}</Text>

        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <LoadingComponent text={t("loading")} />
      ) : (
        <ScrollView>
          <SpecificDayScheduleEditor
            specificSchedule={specificSchedule}
            onSave={handleSaveSchedule}
            onDayChange={handleDayChange}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default SpecificDayScheduleEditorScreen;
