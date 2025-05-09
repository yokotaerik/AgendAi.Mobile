import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AttendanceSummary } from "../../hooks/attendance/useAttendances";
import { ServiceDto } from "../../types/service";
import { router } from "expo-router";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { AttendanceStatus } from "../../types/schedule";
import api, { baseURL } from "../../api";
import BookingScreen from "../booking/BookingScreen";
import ConfirmationModal from "../common/ConfirmationModal";
import ReviewModal from "./ReviewModal";
import { useCurrency } from "../../contexts/CurrencyContext";

interface AttendanceItemProps {
  attendanceSummary: AttendanceSummary;
  isEmployeeView: boolean;
  onConfirm?: (attendanceId: string) => Promise<void>;
  onCancel?: (attendanceId: string) => Promise<void>;
  onEdit?: (attendance: AttendanceSummary) => void; // Nova prop para edição
  onBookAgain?: (attendance: AttendanceSummary) => void;
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  attendanceSummary,
  isEmployeeView,
  onEdit,
  onBookAgain,
}) => {
  const {format : formatMoney} = useCurrency(); 
  const { t } = useTranslation();
  const { attendance, totalPrice, totalDuration } = attendanceSummary;
  const { user } = useAuth();
  const participant = isEmployeeView
    ? attendance.costumer
    : attendance.employee;

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  const canConfirm =
    (attendance.status === AttendanceStatus.WaitingCustomerConfirmation &&
      !isEmployeeView) ||
    (attendance.status === AttendanceStatus.WaitingCompanyConfirmation &&
      isEmployeeView);


  const makeApiCall =  async (attendanceId: string, status: number) => {
      await api.put(`/attendance/status`,{
        id: attendanceId,
        status: status
      } ) 
  }

  const handleConfirm = async () => {
      try {
        await makeApiCall(attendance.id, 3);
        Alert.alert(t("success"), t("attendanceConfirmed"));
      } catch (error) {
        console.error("Error confirming attendance:", error);
        Alert.alert(t("error"), t("errorConfirmingAttendance"));
      } finally {
        setIsLoading(false);
        setConfirmModalVisible(false);
      }
  };

  const handleCancel = async () => {
      setIsLoading(true);
      try {
        await makeApiCall(attendance.id, 2);
        Alert.alert(t("success"), t("attendanceCancelled"));
      } catch (error) {
        console.error("Error cancelling attendance:", error);
        Alert.alert(t("error"), t("errorCancellingAttendance"));
      } finally {
        setIsLoading(false);
        setCancelModalVisible(false);
      }
  };
  
  const handleBookAgain = () => {
    if (onBookAgain) {
      onBookAgain(attendanceSummary);
    } else {
      setBookingModalVisible(true);
    }
  };

  const handleReview = () => {
    setReviewModalVisible(true);
  }
  
  const handleFinished = async () => {
    setIsLoading(true);
    try {
      await makeApiCall(attendance.id, 1); 
      Alert.alert(t("success"), t("attendanceFinished"));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCloseBookingModal = () => {
    setBookingModalVisible(false);
  };

  // Get status display text and color
  const getStatusInfo = () => {
    switch (attendance.status) {
      case AttendanceStatus.Finished:
        return { text: t("finished"), color: theme.colors.success };
      case AttendanceStatus.Confirmed:
        return { text: t("confirmed"), color: theme.colors.success };
      case AttendanceStatus.Canceled:
        return { text: t("cancelled"), color: theme.colors.error };
      case AttendanceStatus.WaitingCustomerConfirmation:
        return {
          text: t("waitingCustomerConfirmation"),
          color: theme.colors.warning,
        };
      case AttendanceStatus.WaitingCompanyConfirmation:
        return {
          text: t("waitingCompanyConfirmation"),
          color: theme.colors.warning,
        };
      default:
        return { text: attendance.status, color: theme.colors.text.secondary };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={styles.participantContainer}>
          <Image
            source={
              participant.imageUrl
                ? { uri: baseURL + participant.imageUrl }
                : require("../../../assets/default-avatar.png")
            }
            resizeMode="cover"
            accessibilityLabel="Avatar"
            style={styles.avatar}
          />
          <View style={styles.participantInfo}>
            <Text style={styles.participantName}>
              {participant.completeName} 
            </Text>
            <Text style={styles.date}>
              {format(
                new Date(attendance.dateTime),
                "dd 'de' MMMM 'às' HH:mm",
                {
                  locale: ptBR,
                }
              )}
            </Text>
            {isEmployeeView && attendance.employee && (
              <Text style={styles.employeeInfo}>
                <Text style={styles.employeeLabel}>{t("professional")}: </Text>
                <Text style={styles.employeeName}>{attendance.employee.completeName}</Text>
              </Text>
            )}
          </View>
        </View>
        <View style={styles.statusContainer}>
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusInfo.color}20` },
            ]}
          >
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.servicesContainer}>
       
        <Text style={styles.servicesTitle}>{t("services")}:</Text>
        {attendance.services.map((service: ServiceDto, index: number) => (
          <View key={index} style={styles.serviceItemContainer}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.serviceItem}>{service.name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>{t("totalDuration")}:</Text>
          <Text style={styles.infoValue}>{totalDuration}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>{t("totalPrice")}:</Text>
          <Text style={styles.infoValue}>{formatMoney(totalPrice)}</Text>
        </View>
      </View>

      {/* Botões de ação */}
      <View style={styles.actionsContainer}>
        {/* Show Edit button if not cancelled */}
        {attendance.status !== AttendanceStatus.Canceled &&
        new Date(attendance.dateTime) > new Date() &&
        (
          <TouchableOpacity
            onPress={() => {
              if (onEdit) {
                onEdit(attendanceSummary);
              } else {
                router.push("/attendance/edit/" + attendance.id);
              }
            }}
            style={styles.actionButton}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={theme.colors.text.primary}
            />
            <Text style={styles.actionButtonText}>{t("edit")}</Text>
          </TouchableOpacity>
        )}

        {/* Show Confirm button if user can confirm */}
        {canConfirm && (
          <TouchableOpacity
            onPress={() => setConfirmModalVisible(true)}
            style={[styles.actionButton, styles.confirmActionButton]}
            disabled={isLoading}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={theme.colors.text.primary}
            />
            <Text style={styles.actionButtonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        )}

        {/* Show Cancel button if not already cancelled */}
        {attendance.status !== AttendanceStatus.Canceled && 
        new Date(attendance.dateTime) > new Date() &&
        (
          <TouchableOpacity
            onPress={() => setCancelModalVisible(true)}
            style={[styles.actionButton, styles.cancelActionButton]}
            disabled={isLoading}
          >
            <Ionicons
              name="close-circle-outline"
              size={20}
              color={theme.colors.text.primary}
            />
            <Text style={styles.actionButtonText}>{t("cancel")}</Text>
          </TouchableOpacity>
        )}

        {/* Book Again button */}
        {!isEmployeeView && attendance.status === AttendanceStatus.Finished && (
          <TouchableOpacity
            onPress={handleBookAgain}
            style={[styles.actionButton, { backgroundColor: `${theme.colors.success}20`, borderColor: theme.colors.success }]}
            disabled={isLoading}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.colors.text.primary}
            />
            <Text style={styles.actionButtonText}>{t("bookAgain")}</Text>
          </TouchableOpacity>
        )}

        {!isEmployeeView && attendance.status === AttendanceStatus.Finished && (
          <TouchableOpacity
            onPress={handleReview}
            style={[styles.actionButton, { backgroundColor: `${theme.colors.warning}20`, borderColor: theme.colors.warning }]}
            disabled={isLoading}
          >
            <Ionicons
              name="star-outline"
              size={20}
              color={theme.colors.text.primary}
            />
            <Text style={styles.actionButtonText}>{t("review")}</Text>
          </TouchableOpacity>
        )}

        {/* Mark as Finished button */}
        {isEmployeeView && attendance.status == AttendanceStatus.Confirmed && 
        new Date(attendance.dateTime) < new Date() &&(
          <TouchableOpacity
          onPress={handleFinished}
          style={[styles.actionButton, { backgroundColor: `${theme.colors.success}20`, borderColor: theme.colors.success }]}
          disabled={isLoading}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.colors.text.primary}
              />
            <Text style={styles.actionButtonText}>{t("markFinished")}</Text>
          </TouchableOpacity>
        )
        }
      </View>

      {/* Confirm Modal */}
      <ConfirmationModal
        visible={confirmModalVisible}
        title={t("confirmAttendance")}
        message={t("confirmAttendanceMessage")}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModalVisible(false)}
        isLoading={isLoading}
        confirmText={t("yes")}
        cancelText={t("no")}
      />

      {/* Cancel Modal */}
      <ConfirmationModal
        visible={cancelModalVisible}
        title={t("cancelAttendance")}
        message={t("cancelAttendanceMessage")}
        onConfirm={handleCancel}
        onCancel={() => setCancelModalVisible(false)}
        isLoading={isLoading}
        confirmText={t("yes")}
        cancelText={t("no")}
      />
      
      {/* Booking Modal for booking again */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={bookingModalVisible}
        onRequestClose={handleCloseBookingModal}
      >
        <BookingScreen
          services={attendance.services}
          attendance={attendance}
          backHandler={handleCloseBookingModal}
          isBookAgain={true}
        />
      </Modal>
      
      {/* Review Modal */}
      <ReviewModal
        visible={reviewModalVisible}
        attendanceId={attendance.id}
        onClose={() => setReviewModalVisible(false)}
        onSuccess={() => {
          // Opcional: atualizar algo após o envio bem-sucedido da avaliação
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  participantContainer: {
    flexDirection: "row",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.tertiary,
  },
  participantInfo: {
    flex: 1,
    justifyContent: "center",
  },
  participantName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  employeeInfo: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  employeeLabel: {
    fontWeight: "500",
  },
  employeeName: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: "600",
    width: 100,
  },
  servicesContainer: {
    marginBottom: theme.spacing.md,
    backgroundColor: `${theme.colors.background}80`,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  servicesTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  serviceItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  serviceItem: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: `${theme.colors.text.light}20`,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
  },
  confirmActionButton: {
    backgroundColor: `${theme.colors.success}20`,
    borderColor: theme.colors.success,
  },
  cancelActionButton: {
    backgroundColor: `${theme.colors.error}20`,
    borderColor: theme.colors.error,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  }
});

export default AttendanceItem;
