import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { theme } from "../../styles/theme";
import { EmployeeDto } from "../../types/employee";
import { BasicInfoDto } from "../../types/common";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface EmployeeListProps {
  employees: BasicInfoDto[];
  selectedEmployee: string;
  onEmployeeSelect: (employeeId: string) => void;
  collapsible?: boolean;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  selectedEmployee,
  onEmployeeSelect,
  collapsible = false,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(!collapsible);
  const [rotateAnimation] = useState(new Animated.Value(collapsible ? 0 : 1));

  const toggleExpand = () => {
    if (!collapsible) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    Animated.timing(rotateAnimation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const renderEmployee = ({ item }: { item: BasicInfoDto }) => {
    const isSelected = item.id === selectedEmployee;

    return (
      <TouchableOpacity
        style={[styles.employeeItem, isSelected && styles.selectedEmployeeItem]}
        onPress={() => {
          if (isSelected) {
            onEmployeeSelect("");
          } else {
            onEmployeeSelect(item.id);
          }
        }}
      >
        <View style={styles.employeeAvatar}>
          <Text style={styles.employeeInitial}>
            {item.completeName?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.employeeName}>{item.completeName}</Text>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={theme.colors.primary}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, !collapsible && { marginTop: 10 }]}>
      {collapsible && (
        <TouchableOpacity
          style={styles.header}
          onPress={toggleExpand}
          activeOpacity={0.7}
          disabled={!collapsible}
        >
          <Text style={styles.headerText}>{t("employees")}</Text>
          {collapsible && (
            <Animated.View style={animatedStyle}>
              <Ionicons
                name="chevron-down"
                size={20}
                color={theme.colors.text.primary}
              />
            </Animated.View>
          )}
        </TouchableOpacity>
      )}

      {expanded && (
        <View style={styles.content}>
          {employees.length > 0 ? (
            <FlatList
              data={employees}
              renderItem={renderEmployee}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.employeeList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("noEmployeesFound")}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  content: {
    paddingVertical: theme.spacing.sm,
  },
  employeeList: {
    paddingHorizontal: theme.spacing.sm,
  },
  employeeItem: {
    alignItems: "center",
    marginHorizontal: theme.spacing.xs,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    width: 80,
  },
  selectedEmployeeItem: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  employeeAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  employeeInitial: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  employeeName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginTop: 4,
  },
  emptyContainer: {
    padding: theme.spacing.md,
    alignItems: "center",
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});

export default EmployeeList;
