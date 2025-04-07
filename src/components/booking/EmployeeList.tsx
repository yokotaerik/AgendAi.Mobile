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
import { theme } from "../../styles/theme";

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
      <Text 
        style={[
          styles.employeeName,
          selectedEmployee === item.id && styles.selectedEmployeeText
        ]} 
        numberOfLines={2} 
        ellipsizeMode="tail"
      >
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
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  employeeList: {
    marginHorizontal: -theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  employeeContainer: {
    marginRight: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    width: 100,
    backgroundColor: theme.colors.surface,
  },
  employeeItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  employeePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.tertiary,
  },
  employeeName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
    maxWidth: 80,
    overflow: "hidden",
  },
  selectedEmployee: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}20`,
  },
  selectedEmployeeText: {
    color: theme.colors.text.primary,
    fontWeight: "500",
  }
});

export default EmployeeList;
