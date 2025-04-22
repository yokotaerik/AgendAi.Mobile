import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useListEmployees } from "../../../hooks/employee/employeeHook";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import EmployeeCard from "../../../components/employee/EmployeeCard";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

const ManageEmployees: React.FC = () => {
  const {
    employees,
    error: employeeError,
    fetchEmployees,
  } = useListEmployees();
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (companyId != null) {
        fetchEmployees(companyId);
      }
    }, [companyId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    if (companyId != null) {
      await fetchEmployees(companyId);
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{t("employees")}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/manage/employee/add")}
        >
          <Ionicons
            name="person-add-outline"
            size={20}
            color={theme.colors.background}
          />
          <Text style={styles.addButtonText}>{t("addEmployee.title")}</Text>
        </TouchableOpacity> 

        {employees && employees.length > 0 ? (
          <FlatList
            data={employees}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            renderItem={({ item }) => (
              <View style={styles.employeeItem}>
                <EmployeeCard
                  name={item.completeName}
                  onEdit={() => router.push(`/manage/employee/edit/${item.id}`)}
                  onSee={() => router.push(`/employee/${item.id}`)}
                  onSchedule={() => router.push(`/manage/schedule/${item.id}`)}
                  photoSrc={item.imageUrl}
                />
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="people-outline"
                  size={48}
                  color={theme.colors.tertiary}
                />
                <Text style={styles.emptyText}>{t("noEmployeeFound")}</Text>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={48}
              color={theme.colors.tertiary}
            />
            <Text style={styles.emptyText}>{t("noEmployeeFound")}</Text>
            <Text style={styles.emptySubtext}>{t("addYourFirstEmployee")}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: theme.colors.background,
    fontWeight: "600",
    fontSize: theme.typography.fontSize.md,
    marginLeft: theme.spacing.xs,
  },
  listContent: {
    paddingBottom: theme.spacing.md,
  },
  employeeItem: {
    marginBottom: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "500",
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.light,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
});

export default ManageEmployees;
