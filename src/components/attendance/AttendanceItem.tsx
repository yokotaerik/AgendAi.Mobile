import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AttendanceSummary } from "../../hooks/attendance/useAttendances";
import { ServiceDto } from "../../types/service";
import { router } from "expo-router";

interface AttendanceItemProps {
  attendanceSummary: AttendanceSummary;
  isEmployeeView: boolean;
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  attendanceSummary,
  isEmployeeView,
}) => {
  const { attendance, totalPrice, totalDuration } = attendanceSummary;
  const participant = isEmployeeView
    ? attendance.costumer
    : attendance.employee;

  

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', flex: 1}}>
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
        <View>
          {/* Edit and cancel button */}
          <TouchableOpacity
            onPress={() => {
              router.push("/attendance/edit/" + attendance.id);
            }}
            style={{ marginBottom: 8 }}
          >
            <Text style={{ color: "#007BFF" }}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Handle cancel action
            }}
            style={{ marginBottom: 8 }}
          >
            <Text style={{ color: "#FF0000" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.servicesContainer}>
        <Text style={styles.servicesTitle}>Serviços:</Text>
        {attendance.services.map((service: ServiceDto, index: number) => (
          <Text key={index} style={styles.serviceItem}>
            • {service.name}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Duração Total:</Text>
          <Text style={styles.infoValue}>{totalDuration}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Valor Total:</Text>
          <Text style={styles.infoValue}>R$ {totalPrice.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
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
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  servicesContainer: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  serviceItem: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  infoContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default AttendanceItem;
