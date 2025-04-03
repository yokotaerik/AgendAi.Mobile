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
      style={[
        styles.employeeItem,
        selectedEmployee === item.id && styles.selectedEmployee,
      ]}
      onPress={() => onEmployeeSelect(item.id)}
    >
      <Image source={{ uri: item.photoUrl }} style={styles.employeePhoto} />
      <Text style={styles.employeeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("selectEmployee")}</Text>
      <FlatList
        data={[{ id: "any", name: t("anyEmployee") }, ...employees]}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item.id}
        horizontal
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
  employeeItem: {
    alignItems: "center",
    marginRight: 16,
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
  },
  selectedEmployee: {
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 32,
    padding: 2,
  },
});

export default EmployeeList;
