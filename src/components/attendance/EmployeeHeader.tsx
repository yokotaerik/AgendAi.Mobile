import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { EmployeeDto } from "../../types/employee";

interface EmployeeHeaderProps {
  employee: EmployeeDto;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ employee }) => {
  return (
    <View style={styles.employeeHeader}>
      <Ionicons name="person" size={24} color={theme.colors.primary} />
      <Text style={styles.employeeName}>{employee.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  employeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  employeeName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
});

export default EmployeeHeader;