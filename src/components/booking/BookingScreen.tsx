import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { ServiceDto } from "../../types/service";
import { Calendar } from "react-native-calendars";
import EmployeeList from "./EmployeeList";
import TimeList from "./TimeList";
import { useBooking } from "../../hooks/booking/useBooking";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import { AttendanceDto } from "../../types/schedule";
import { router } from "expo-router";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { use } from "i18next";
import { UserType } from "../../types/common";

interface BookingScreenProps {
  services: ServiceDto[];
  customerId?: string;
  attendance: AttendanceDto | null;
  backHandler: () => void;
  isBookAgain?: boolean;
}

interface BookingData {
  id?: string;
  serviceIds: string[];
  customerId?: string;
  employeeId?: string;
  appointment: string;
}

const BookingScreen: React.FC<BookingScreenProps> = ({
  services,
  backHandler,
  attendance = null,
  customerId: propCustomerId = undefined,
  isBookAgain = false,
}) => {
  const { t } = useTranslation();
  const { customerId: contextCustomerId, user } = useAuth();
  const [effectiveCustomerId, setEffectiveCustomerId] = useState<string | undefined>(propCustomerId);
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
    if (propCustomerId === undefined && contextCustomerId !== null) {
      setEffectiveCustomerId(contextCustomerId);
    }
  }, [propCustomerId, contextCustomerId]);

  // Estado para armazenar o horário desejado para seleção automática
  const [desiredTimeString, setDesiredTimeString] = useState<string | null>(null);

  useEffect(() => {
    if (attendance) {
      // Seleciona o mesmo funcionário
      handleEmployeeSelect(attendance.employee.id);
      
      // Obtém o dia da semana do atendimento original
      const attendanceDate = new Date(attendance.dateTime);
      const dayOfWeek = attendanceDate.getDay();
      
      if (isBookAgain) {
        // Para "book again", encontra a próxima data com o mesmo dia da semana
        const today = new Date();
        // Calcula corretamente os dias a adicionar para chegar ao mesmo dia da semana
        let daysToAdd = dayOfWeek - today.getDay();
        if (daysToAdd <= 0) daysToAdd += 7; // Se for negativo ou zero, adiciona uma semana
        
        const nextSameWeekday = new Date(today);
        nextSameWeekday.setDate(today.getDate() + daysToAdd - 1);
        
        // Formata a data para YYYY-MM-DD
        const formattedDate = nextSameWeekday.toISOString().split('T')[0];
        handleDateSelect(formattedDate);
      } else {
        // Para edição, usa a data original do atendimento
        const formattedDate = attendanceDate.toISOString().split('T')[0];
        handleDateSelect(formattedDate);
      }
      
      // Armazena o horário desejado para seleção posterior quando os horários estiverem disponíveis
      const hours = attendanceDate.getHours().toString().padStart(2, '0');
      const minutes = attendanceDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      setDesiredTimeString(timeString);
    }
  }, [attendance]);
  
  // Este useEffect observa quando os horários disponíveis são carregados
  // e tenta selecionar o horário desejado se ele estiver disponível
  useEffect(() => {
    if (desiredTimeString && availableTimes.length > 0) {
      console.log("Verificando disponibilidade do horário:", desiredTimeString);
      console.log("Horários disponíveis:", availableTimes.map(t => t.time));
      
      const timeExists = availableTimes.some(t => t.time === desiredTimeString);
      
      if (timeExists) {
        console.log("Horário disponível encontrado:", desiredTimeString);
        handleTimeSelect(desiredTimeString);
        // Limpa o horário desejado para evitar seleções repetidas
        setDesiredTimeString(null);
      } else {
        console.log("Horário desejado não disponível:", desiredTimeString);
      }
    }
  }, [availableTimes, desiredTimeString, handleTimeSelect]);

  useEffect(() => {
    handleServiceSelect(services);
  }, [services]);

  const handleConfirm = async () => {
    // Use the local state variable instead of the prop
    let customerIdToUse = effectiveCustomerId;
    
    if (!selectedDate) {
      Alert.alert(t("error"), t("selectDateError"));
      return;
    }
    
    if (!selectedTime) {
      Alert.alert(t("error"), t("selectTimeError"));
      return;
    }
    
    if (!selectedEmployee) {
      Alert.alert(t("error"), t("selectEmployeeError"));
      return;
    }
    
    if (selectedEmployee === "any") {
      Alert.alert(t("error"), t("selectEmployeeError"));
      return;
    }

    if (attendance != null) {
      customerIdToUse = attendance.costumer.id;
    }

    if (!customerIdToUse) {
      console.error("Customer ID is not available.", customerIdToUse);
      return;
    }

    const selectedDateTime = new Date(selectedDate);

    const [hours, minutes] = selectedTime.split(":").map(Number);
    selectedDateTime.setUTCHours(hours, minutes, 0, 0);

    const timezoneOffset = new Date().getTimezoneOffset() / 60;

    selectedDateTime.setHours(selectedDateTime.getHours() + timezoneOffset);

    let bookingData: BookingData;

    if (attendance == undefined || isBookAgain) {
      // Para novo agendamento ou "book again"
      bookingData = {
        serviceIds: services.map((service) => service.id),
        employeeId: selectedEmployee,
        customerId: customerIdToUse,
        appointment: selectedDateTime.toISOString(),
      };
    } else {
      // Para edição de agendamento existente
      bookingData = {
        id: attendance.id,
        serviceIds: services.map((service) => service.id),
        employeeId: selectedEmployee,
        appointment: selectedDateTime.toISOString(),
      };
    }

    try {
      let response;

      if (attendance == undefined || isBookAgain) {
        // Para novo agendamento ou "book again", cria um novo registro
        response = await api.post("/attendance", bookingData);
      } else {
        // Para edição, atualiza o registro existente
        response = await api.put("/attendance", bookingData);
      }

      if (response.status === 200) {
        if(user?.role == UserType.Customer){
          router.push("/(tabs)/attendances");
        } else{
          backHandler();
        }
      } 
    } catch {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={backHandler}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{isBookAgain ? t("bookAgain") : (attendance ? t("editReservation") : t("makeReservation"))}</Text>
        <View style={styles.headerSpacer} />
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
              [selectedDate]: {
                selected: true,
                selectedColor: theme.colors.primary,
              },
            }}
            theme={{
              backgroundColor: theme.colors.background,
              calendarBackground: theme.colors.background,
              textSectionTitleColor: theme.colors.text.primary,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: theme.colors.text.primary,
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.text.primary,
              textDisabledColor: theme.colors.text.light,
              dotColor: theme.colors.primary,
              selectedDotColor: theme.colors.text.primary,
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.text.primary,
              textMonthFontWeight: "600",
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
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
              {employees.find((e) => e.id === selectedEmployee)?.completeName ||
                t("anyEmployee")}
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
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
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
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  summary: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  summaryTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "500",
    color: theme.colors.text.primary,
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
  },
  confirmButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
  },
});

export default BookingScreen;
