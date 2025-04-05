import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { BasicInfoDto } from "../../../types/common";
import { router } from "expo-router";

interface EmployeeTabProps {
  employees: BasicInfoDto[];
}

const EmployeeTab: React.FC<EmployeeTabProps> = ({ employees }) => {
  const { t } = useTranslation();

  console.log(employees);

  const renderEmployeeItem = ({ item }: { item: BasicInfoDto }) => (
    <TouchableOpacity
      onPress={() => router.navigate(`/employee/${item.id}`)}
    >
      <View style={styles.employeeItem}>
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
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.title}>{t("employees")}</Text>
      <FlatList
        data={employees}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  employeeItem: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  employeeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  employeePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  employeeRole: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 16,
    color: "#FFD700",
    marginLeft: 2,
  },
});

export default EmployeeTab;
