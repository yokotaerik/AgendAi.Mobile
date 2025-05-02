import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../api";
import { ServiceDto } from "../../../types/service";
import { useDateRange } from "../../../hooks/common/useDateRange";
import { useAttendances } from "../../../hooks/attendance/useAttendances";
import { UserType } from "../../../types/common";
import {
  DateRangePicker,
  AttendanceListView,
} from "../../../components/schedule/ui";
import BookingScreen from "../../../components/booking/BookingScreen";
import CustomerSelectionModal from "../../../components/customer/CustomerSelectionModal";
import ServiceSelectionModal from "../../../components/service/ServiceSelectionModal";
import { useListServices } from "../../../hooks/service/serviceHooks";
import { useListEmployees } from "../../../hooks/employee/employeeHook";
import {
  useListCustomers,
  CustomerDto,
} from "../../../hooks/customer/customerHooks";
import EmployeeList from "../../../components/booking/EmployeeList";
import { AttendanceSummary } from "../../../hooks/attendance/useAttendances";

// Update the component
const ScheduleManagement = () => {
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | undefined>(undefined);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(
    null
  );
  const [selectedServices, setSelectedServices] = useState<ServiceDto[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showBookingScreen, setShowBookingScreen] = useState(false);
  const [currentAttendance, setCurrentAttendance] =
    useState<AttendanceSummary | null>(null);
  const { services, fetchServices } = useListServices();
  const { employees, fetchEmployees } = useListEmployees();
  const {
    customers,
    fetchCustomers,
    loading: customersLoading,
  } = useListCustomers();

  // Use our custom hook for date range
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();

  const {
    attendances,
    fetchAttendances,
    loading: attendancesLoading,
  } = useAttendances();

  // Função para recarregar os agendamentos
  const refreshAttendances = () => {
    if (companyId) {
      fetchAttendances(
        startDate,
        endDate,
        UserType.Company,
        employeeId,
        companyId
      );
    }
  };

  // Fetch attendances when component mounts or date range changes
  useEffect(() => {
    if (companyId) {
      fetchAttendances(
        startDate,
        endDate,
        UserType.Company,
        employeeId,
        companyId
      );
    }
  }, [companyId, startDate, endDate, employeeId]);

  // Fetch customers and services when component mounts
  useEffect(() => {
    if (companyId) {
      fetchEmployees(companyId);
      fetchServices(companyId);
      fetchCustomers(companyId);
    }
  }, [companyId]);

  const handleAddAttendance = () => {
    setCurrentAttendance(null);
    setSelectedCustomer(null);
    setSelectedServices([]);
    setShowCustomerModal(true);
  };

  const handleEditAttendance = (attendance: AttendanceSummary) => {
    setCurrentAttendance(attendance);
    // Encontrar o cliente correspondente
    const customer = customers.find(
      (c) => c.id === attendance.attendance.costumer.id
    );
    if (customer) {
      setSelectedCustomer(customer);
      setShowServiceModal(true);
    } else {
      // Se não encontrar o cliente, abrir o modal de seleção de cliente
      setShowCustomerModal(true);
    }
  };

  const handleSelectCustomer = (customer: CustomerDto) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
    setShowServiceModal(true);
  };

  const handleSelectService = (service: ServiceDto) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);

    if (isSelected) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleConfirmServices = () => {
    if (selectedServices.length === 0) {
      return;
    }

    setShowServiceModal(false);
    setShowBookingScreen(true);
  };

  const handleBackFromBooking = () => {
    setShowBookingScreen(false);
    setSelectedCustomer(null);
    setSelectedServices([]);
    setCurrentAttendance(null);

    // Refresh attendances after booking
    if (companyId) {
      fetchAttendances(
        startDate,
        endDate,
        UserType.Company,
        undefined,
        companyId
      );
    }
  };

  const handleCloseCustomerModal = () => {
    setShowCustomerModal(false);
    setCurrentAttendance(null);
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setSelectedServices([]);
    setCurrentAttendance(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("scheduleManagement")}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddAttendance}
        >
          <Ionicons name="add" size={24} color={theme.colors.background} />
        </TouchableOpacity>
      </View>

      {/* Date Range Picker */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <EmployeeList
        employees={employees}
        onEmployeeSelect={(id) => {
          setEmployeeId(id);
        }}
        selectedEmployee={employeeId ?? ""}
        collapsible={true}
      />

      {/* Attendances List */}
      <View style={styles.content}>
        {companyId ? (
          attendancesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <AttendanceListView
              attendances={attendances}
              isEmployeeView={true}
              onEditAttendance={handleEditAttendance}
              onRefresh={refreshAttendances}
              refreshing={attendancesLoading}
            />
          )
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar"
              size={60}
              color={theme.colors.text.light}
            />
            <Text style={styles.emptyText}>{t("noCompanySelected")}</Text>
          </View>
        )}
      </View>

      {/* Customer Selection Modal */}
      <CustomerSelectionModal
        visible={showCustomerModal}
        customers={customers}
        loading={loading}
        onSelectCustomer={handleSelectCustomer}
        onClose={handleCloseCustomerModal}
      />

      {/* Service Selection Modal */}
      <ServiceSelectionModal
        visible={showServiceModal}
        services={services}
        selectedServices={selectedServices}
        loading={loading}
        onSelectService={handleSelectService}
        onConfirm={handleConfirmServices}
        onClose={handleCloseServiceModal}
      />

      {/* Booking Screen Modal */}
      {showBookingScreen && selectedCustomer && (
        <Modal
          visible={showBookingScreen}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <BookingScreen
            services={selectedServices}
            customerId={selectedCustomer.id}
            attendance={currentAttendance ? currentAttendance.attendance : null}
            backHandler={handleBackFromBooking}
          />
        </Modal>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default ScheduleManagement;
