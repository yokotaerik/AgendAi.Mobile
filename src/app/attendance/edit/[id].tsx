import { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAttendances } from "../../../hooks/attendance/useAttendances";
import { useTranslation } from "react-i18next";
import BookingScreen from "../../../components/booking/BookingScreen";
import { AttendanceDto } from "../../../types/schedule";
import ServiceTabs from "../../../components/company/tabs/ServiceTabs";
import { ServiceDto } from "../../../types/service";
import { useListServices } from "../../../hooks/service/serviceHooks";

export default function EditAttendancePage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { loading, error, fetchOneAttendance } = useAttendances();
  const router = useRouter();
  const [attendance, setAttendance] = useState<AttendanceDto | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceDto[]>([]);
  const [showBooking, setShowBooking] = useState(true);
  const { fetchServices, services } = useListServices();

  useEffect(() => {
    if (id) {
      const loadAttendance = async () => {
        const data = await fetchOneAttendance(id as string);

        if (data !== undefined) {
          setAttendance(data);
          setSelectedServices(data.services);
          fetchServices(data?.companyId ?? "");
        }
      };
      
      loadAttendance();
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (showBooking)
    return (
      <BookingScreen
        services={selectedServices}
        attendance={attendance}
        backHandler={() => {
          setShowBooking(false);
        }}
        isBookAgain={false}
      />
    );

  return (
    <SafeAreaView style={styles.container}>
      <ServiceTabs
        onServiceSelect={(services) => {
          setSelectedServices(services);
          setShowBooking(true);
        }}
        services={services}
        giveSelectedServices={() => {
          selectedServices;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
