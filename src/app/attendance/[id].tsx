import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useAttendances } from "../../hooks/attendance/useAttendances";
import { useAuth } from "../../contexts/AuthContext";
import { UserType } from "../../types/common";
import { useGetEmployee } from "../../hooks/employee/employeeHook";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import AttendanceList from "../../components/attendance/AttendanceList";
import { useDateRange } from "../../hooks/common/useDateRange";

interface AttendanceScreenProps {
  id: string;
}

const AttendanceScreen = ({ id }: AttendanceScreenProps) => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { attendances, loading, error, fetchAttendances } = useAttendances();
  const [idToGet, setIdToGet] = useState<string | undefined>(undefined);
  const { companyId, customerId } = useAuth();
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange(0, 1);
  const { fetchEmployeee, employee } = useGetEmployee();

  useEffect(() => {
    if (id != "customer" && id != "company") {
      setIdToGet(id);
      fetchEmployeee(id);
    }
    if (id == "customer" && customerId) {
      setIdToGet(customerId);
    }
  }, [id, customerId]);

  useEffect(() => {
    if (id == "company" && companyId) {
      fetchAttendances(
        startDate,
        endDate,
        UserType.Company,
        idToGet,
        companyId
      );
    } else if (idToGet) {
      fetchAttendances(
        startDate,
        endDate,
        id != "customer" ? UserType.Employee : UserType.Customer,
        idToGet
      );
    }
  }, [id, idToGet, startDate, endDate, companyId, isFocused]);

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
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={theme.colors.error}
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("myAttendances")}</Text>
      </View>

      <AttendanceList
        attendances={attendances}
        employee={employee}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        isEmployeeView={id !== "customer"}
      />
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
});

export default AttendanceScreen;
