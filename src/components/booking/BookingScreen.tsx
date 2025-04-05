import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import { useTranslation } from "react-i18next";
import { ServiceDto } from "../../types/service";
import { Calendar } from "react-native-calendars";
import { ptBR } from "date-fns/locale";
import EmployeeList from "./EmployeeList";
import TimeList from "./TimeList";
import { useBooking } from "../../hooks/booking/useBooking";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import { AttendanceDto } from "../../types/schedule";
import { router } from "expo-router";

interface BookingScreenProps {
  services: ServiceDto[];
  attendance: AttendanceDto | null
  backHandler: () => void;
}

interface BookingData {
  id? : string;
  serviceIds: string[];
  customerId?: string;
  employeeId?: string;
  appointment: string;
}

const BookingScreen: React.FC<BookingScreenProps> = ({
  services,
  backHandler,
  attendance = null,
}) => {
  const { t } = useTranslation();
  const { customerId } = useAuth();
  const {
    selectedDate,
    selectedTime,
    selectedEmployee,
    availableTimes,
    employees,
    handleDateSelect,
    handleTimeSelect,
    handleEmployeeSelect,
    handleServiceSelect,
  } = useBooking(services);
  
  useEffect(() => {
    if (attendance) {

      console.log(services);
      
      console.log(attendance.dateTime)

      handleEmployeeSelect(attendance.employee.id);
    }
  }, [attendance]);

  useEffect(() => {
    handleServiceSelect(services);
  }, [services]);

  useEffect(() => {
    const backHandlerSubscription = BackHandler.addEventListener("hardwareBackPress", () => {
      backHandler();
      return true; // Indicates that we've handled the back button press
    });

    // Clean up the event listener when component unmounts
    return () => backHandlerSubscription.remove();
  }, [backHandler]);
  
  const handleConfirm = async () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !selectedEmployee ||
      selectedEmployee === "any"
    ) {
      console.log(
        "Please select a date, time, and employee before confirming."
      );
      return;
    }

    if (!customerId) {
      console.error("Customer ID is not available.");
      return;
    }

    const selectedDateTime = new Date(selectedDate);

    const [hours, minutes] = selectedTime.split(":").map(Number);
    selectedDateTime.setUTCHours(hours, minutes, 0, 0);

    const timezoneOffset = new Date().getTimezoneOffset() / 60;

    selectedDateTime.setHours(selectedDateTime.getHours() + timezoneOffset);

    let bookingData: BookingData;

    if(attendance == undefined) {
       bookingData = {
      serviceIds: services.map((service) => service.id),
      employeeId: selectedEmployee,
      customerId,
      appointment: selectedDateTime.toISOString(),
    }; }else {
      bookingData = {
        id: attendance.id,
        serviceIds: services.map((service) => service.id),
        employeeId: selectedEmployee,
        appointment: selectedDateTime.toISOString(),
      };
    }

    try {
      let response;

      if (attendance == undefined) {
          response = await api.post("/attendance", bookingData);
      }
      else {
        response = await api.put("/attendance", bookingData);
      }

      if(response.status === 200) {
          router.push("/tabs/attendances")
      }
    } catch {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("makeReservation")}</Text>
      </View>

      <ScrollView style={styles.content}>
        <EmployeeList
          employees={employees}
          selectedEmployee={selectedEmployee}
          onEmployeeSelect={handleEmployeeSelect}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("selectDate")}</Text>
          <Calendar
            onDayPress={(day: any) => handleDateSelect(day.dateString)}
            onMonthChange={(month: any) => handleDateSelect(month.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#007AFF", },
            }}
            theme={{
              selectedDayBackgroundColor: "#007AFF",
              todayTextColor: "#007AFF",
              arrowColor: "#007AFF",
            }}
          />
        </View>

        <TimeList
          availableTimes={availableTimes}
          selectedTime={selectedTime}
          onTimeSelect={handleTimeSelect}
        />

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>{t("serviceSummary")}</Text>
          {services.map((service) => (
            <View key={service.id} style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{service.name}</Text>
              <Text style={styles.summaryValue}>
                {service.price.toFixed(2)} {t("currency")}
              </Text>
            </View>
          ))}
          {selectedTime && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t("selectedTime")}</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
          )}
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t("selectedEmployee")}</Text>
            <Text style={styles.summaryValue}>
              {employees.find((e) => e.id === selectedEmployee)?.name}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>{t("confirm")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  summary: {
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  changeButton: {
    padding: 8,
  },
  changeButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addButton: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  addButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButton: {
    padding: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookingScreen;
