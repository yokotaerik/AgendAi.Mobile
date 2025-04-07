import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useAttendances } from "../../hooks/attendance/useAttendances";
import AttendanceItem from "../../components/attendance/AttendanceItem";
import { useAuth } from "../../contexts/AuthContext";
import { UserType } from "../../types/common";
import { useGetEmployee } from "../../hooks/employee/employeeHook";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

interface AttendanceScreenProps {
  id: string;
}

const AttendanceScreen = ({ id }: AttendanceScreenProps) => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { attendances, loading, error, fetchAttendances } = useAttendances();
  const [idToGet, setIdToGet] = useState<string | null>(null);
  const { customerId } = useAuth();
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString();
  });
  const { fetchEmployeee, employee } = useGetEmployee();

  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || new Date();
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate.toISOString());
  };

  const onEndDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || new Date();
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate.toISOString());
  };

  useEffect(() => {
    if (id != "customer") {
      setIdToGet(id);
      fetchEmployeee(id);
    } else if (customerId) {
      setIdToGet(customerId);
    }

    if (idToGet) {
      fetchAttendances(
        idToGet,
        startDate,
        endDate,
        id != "customer" ? UserType.Employee : UserType.Customer
      );
    }
  }, [id, idToGet, startDate, endDate, customerId, isFocused]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("myAttendances")}</Text>
      </View>

      {employee && (
        <View style={styles.employeeHeader}>
          <Ionicons name="person" size={24} color={theme.colors.primary} />
          <Text style={styles.employeeName}>{employee.name}</Text>
        </View>
      )}

      <View style={styles.dateContainer}>
        <View style={styles.datePickerWrapper}>
          <Text style={styles.dateLabel}>{t("startDate")}:</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={16} color={theme.colors.text.secondary} style={styles.dateIcon} />
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={new Date(startDate)}
              mode="date"
              display="default"
              onChange={onStartDateChange}
            />
          )}
        </View>

        <View style={styles.datePickerWrapper}>
          <Text style={styles.dateLabel}>{t("endDate")}:</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={16} color={theme.colors.text.secondary} style={styles.dateIcon} />
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={new Date(endDate)}
              mode="date"
              display="default"
              onChange={onEndDateChange}
            />
          )}
        </View>
      </View>

      {attendances.length > 0 ? (
        <FlatList
          data={attendances}
          renderItem={({ item }) => (
            <AttendanceItem attendanceSummary={item} isEmployeeView={false} />
          )}
          keyExtractor={(item) => item.attendance.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar" size={60} color={theme.colors.text.light} />
          <Text style={styles.emptyText}>{t("noAttendances")}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  employeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  employeeName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  datePickerWrapper: {
    flex: 1,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    minWidth: 120,
    justifyContent: "center",
  },
  dateIcon: {
    marginRight: theme.spacing.xs,
  },
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
});

export default AttendanceScreen;
