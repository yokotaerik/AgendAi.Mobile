import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useAttendances } from "../../hooks/attendance/useAttendances";
import AttendanceItem from "../../components/attendance/AttendanceItem";
import { useAuth } from "../../contexts/AuthContext";
import { UserType } from "../../types/common";
import { useGetEmployee } from "../../hooks/employee/employeeHook";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useIsFocused } from "@react-navigation/native";

// Create a props to send id
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

    console.log(attendances, "attendances");
  }, [id, idToGet, startDate, endDate, customerId, isFocused]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
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
        <View style={styles.header}>
          <Text style={styles.title}>{employee.name}</Text>
        </View>
      )}

      <View style={styles.dateContainer}>
        <View style={styles.datePickerWrapper}>
          <Text style={styles.dateLabel}>{t("startDate")}:</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text>{formatDate(startDate)}</Text>
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
            <Text>{formatDate(endDate)}</Text>
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

      <FlatList
        data={attendances}
        renderItem={({ item }) => (
          <AttendanceItem attendanceSummary={item} isEmployeeView={false} />
        )}
        keyExtractor={(item) => item.attendance.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 30,
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  datePickerWrapper: {
    flex: 1,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  dateButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
    minWidth: 100,
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
  },
});

export default AttendanceScreen;
