import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { ServiceDto } from "../../types/service";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";
import useBookingScreen from "../../hooks/booking/useBookingScreen";
import { AvailableTime } from "../../types/schedule";

interface BookingScreenProps {
  services: ServiceDto[];
  onAddAnotherService: () => void;
  onConfirmBooking: (bookingData: BookingData) => void;
}

interface BookingData {
  serviceId: string;
  employeeId?: string;
  date: string;
  time: string;
}

interface Employee {
  id: string;
  name: string;
  photoUrl?: string;
}

const BookingScreen: React.FC<BookingScreenProps> = ({
  services = [
    {
      id: "13cfa54c-17c3-4ecd-978d-fcaa6ae8b653",
      name: "Corte",
      description: "Simples",
      price: 50,
      duration: "00:45:00",
      companyId: "88bbebed-706f-44ac-95e6-2cee8dc200fd",
    },
  ],
  onAddAnotherService,
  onConfirmBooking,
}) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("any");
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { getSchedules, convertPeriodsToTimeSlots } = useBookingScreen();

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedDate) return;

      try {
        const response = await getSchedules(
          services.map((service) => service.id),
          selectedDate
        );

        setEmployees([]);
        setAvailableTimes([]);

        response.forEach((item) => {
          if (item.schedules && item.schedules.length > 0) {
            setEmployees((prev) => [
              ...prev,
              {
                id: item.schedules[0].employeeId,
                name: item.employeeName,
                photoUrl: item.imageUrl,
              },
            ]);

            item.schedules.forEach((schedule) => {
              if (
                schedule.avaiblePeriods &&
                schedule.avaiblePeriods.length > 0
              ) {
                schedule.avaiblePeriods.forEach((period) => {
                  setAvailableTimes((prev) => [
                    ...prev,
                    ...convertPeriodsToTimeSlots([period], 15),
                  ]);
                });

                setAvailableTimes((prev) =>
                  Array.from(
                    new Map(prev.map((item) => [item.time, item])).values()
                  )
                );
              }
            });
          }
        });
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, [
    selectedDate,
    selectedEmployee,
    services,
    getSchedules,
    convertPeriodsToTimeSlots,
  ]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
  };

  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <TouchableOpacity
      style={[
        styles.employeeItem,
        selectedEmployee === item.id && styles.selectedEmployee,
      ]}
      onPress={() => handleEmployeeSelect(item.id)}
    >
      <Image source={{ uri: item.photoUrl }} style={styles.employeePhoto} />
      <Text style={styles.employeeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTimeItem = ({ item }: { item: AvailableTime }) => (
    <TouchableOpacity
      style={[
        styles.timeButton,
        !item.available && styles.unavailableTime,
        selectedTime === item.time && styles.selectedTime,
      ]}
      onPress={() => item.available && handleTimeSelect(item.time)}
      disabled={!item.available}
    >
      <Text
        style={[
          styles.timeText,
          !item.available && styles.unavailableTimeText,
          selectedTime === item.time && styles.selectedTimeText,
        ]}
      >
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("makeReservation")}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("selectEmployee")}</Text>
          <FlatList
            data={[{ id: "any", name: t("anyEmployee") }, ...employees]}
            renderItem={renderEmployeeItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.employeeList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("selectDate")}</Text>
          <Calendar
            onDayPress={(day: any) => handleDateSelect(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#007AFF" },
            }}
            theme={{
              selectedDayBackgroundColor: "#007AFF",
              todayTextColor: "#007AFF",
              arrowColor: "#007AFF",
            }}
            locale={ptBR}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("selectTime")}</Text>
          <FlatList
            data={availableTimes}
            renderItem={renderTimeItem}
            keyExtractor={(item) => item.time}
            numColumns={3}
            contentContainerStyle={styles.timeList}
          />
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>{t("serviceSummary")}</Text>
          {/* FAZER FOR AQ DEPOIS */}
          {/* <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{service.name}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              R$ {service.price.toFixed(2)}
            </Text>
          </View> */}
          {selectedTime && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t("selectedTime")}</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
          )}
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t("selectedEmployee")}</Text>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => setSelectedEmployee("any")}
            >
              <Text style={styles.changeButtonText}>{t("change")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddAnotherService}
        >
          <Text style={styles.addButtonText}>{t("addAnotherService")}</Text>
        </TouchableOpacity>
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
  backButton: {
    padding: 8,
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
  employeeList: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  employeeItem: {
    alignItems: "center",
    marginRight: 16,
  },
  employeePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  employeeName: {
    fontSize: 14,
    color: "#666",
  },
  selectedEmployee: {
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 32,
    padding: 2,
  },
  timeList: {
    padding: 8,
  },
  timeButton: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
  },
  unavailableTime: {
    backgroundColor: "#eee",
  },
  unavailableTimeText: {
    color: "#999",
  },
  selectedTime: {
    backgroundColor: "#007AFF",
  },
  selectedTimeText: {
    color: "#fff",
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
