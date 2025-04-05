import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";

interface Employee {
  id: string;
  name: string;
  photoUrl?: string;
}

interface EmployeeListProps {
  employees: Employee[];
  selectedEmployee: string;
  onEmployeeSelect: (employeeId: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  selectedEmployee,
  onEmployeeSelect,
}) => {
  const { t } = useTranslation();

  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <TouchableOpacity
      onPress={() => onEmployeeSelect(item.id)}
      style={[
        styles.employeeContainer,
        selectedEmployee === item.id && styles.selectedEmployee,
      ]}
    >
      <View style={styles.employeeItem}>
        <Image
          source={
            item.photoUrl
              ? { uri: item.photoUrl }
              : require("../../../assets/default-avatar.png")
          }
          style={styles.employeePhoto}
        />
      </View>
      <Text style={styles.employeeName} numberOfLines={2} ellipsizeMode="tail">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("selectEmployee")}</Text>
      <FlatList
        data={[{ id: "any", name: t("anyEmployee") }, ...employees]}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.employeeList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  employeeContainer: {
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 12,
    width: 100,
  },
  employeeItem: {
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
    maxWidth: 80,
    overflow: "hidden",
  },
  selectedEmployee: {
    borderWidth: 2,
    borderColor: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
});

export default EmployeeList;
