import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AttendanceSummary } from "../../hooks/attendance/useAttendances";
import { ServiceDto } from "../../types/service";
import { router } from "expo-router";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface AttendanceItemProps {
  attendanceSummary: AttendanceSummary;
  isEmployeeView: boolean;
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  attendanceSummary,
  isEmployeeView,
}) => {
  const { t } = useTranslation();
  const { attendance, totalPrice, totalDuration } = attendanceSummary;
  const participant = isEmployeeView
    ? attendance.costumer
    : attendance.employee;

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={styles.participantContainer}>
          <Image 
            source={
              participant.imageUrl
                ? { uri: participant.imageUrl }
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
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => {
              router.push("/attendance/edit/" + attendance.id);
            }}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.editButtonText}>{t("edit")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Handle cancel action
            }}
            style={styles.cancelButton}
          >
            <Ionicons name="close-circle-outline" size={16} color={theme.colors.error} />
            <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.servicesContainer}>
        <Text style={styles.servicesTitle}>{t("services")}:</Text>
        {attendance.services.map((service: ServiceDto, index: number) => (
          <View key={index} style={styles.serviceItemContainer}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.serviceItem}>
              {service.name}
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
          <Text style={styles.infoValue}>R$ {totalPrice.toFixed(2)}</Text>
        </View>
      </View>
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
  },
  actionsContainer: {
    alignItems: "flex-end",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  editButtonText: {
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "500",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "500",
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
});

export default AttendanceItem;
