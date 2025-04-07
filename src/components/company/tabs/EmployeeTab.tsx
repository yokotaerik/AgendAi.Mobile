import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { BasicInfoDto } from "../../../types/common";
import { router } from "expo-router";
import { theme } from "../../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

interface EmployeeTabProps {
  employees: BasicInfoDto[];
}

const EmployeeTab: React.FC<EmployeeTabProps> = ({ employees }) => {
  const { t } = useTranslation();

  const renderEmployeeItem = ({ item }: { item: BasicInfoDto }) => (
    <TouchableOpacity
      onPress={() => router.navigate(`/employee/${item.id}`)}
      style={styles.employeeItem}
    >
      <View style={styles.employeeHeader}>
        <View style={styles.employeeInfo}>
          <Image
            source={
              item.imageUrl
                ? { uri: item.imageUrl }
                : require("../../../../assets/default-avatar.png")
            }
            style={styles.employeePhoto}
          />
          <View style={styles.employeeDetails}>
            <Text style={styles.employeeName}>{item.completeName}</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text.light} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("employees")}</Text>
      <FlatList
        data={employees}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  listContainer: {
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  employeeItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  employeeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  employeePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.tertiary,
  },
  employeeDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  employeeName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: theme.typography.fontSize.md,
    color: "#FFD700",
    marginLeft: theme.spacing.xs,
  },
});

export default EmployeeTab;
