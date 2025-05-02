import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { useListServices } from "../../hooks/service/serviceHooks";
import { useEffect, useState } from "react";
import ServiceCard from "../../components/service/ServiceCard";
import { useGetCompany } from "../../hooks/company/companyHooks";
import CompleteCompanyCard from "../../components/company/CompleteCompanyCard";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function ManageCompany() {
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const { company, fetchCompany } = useGetCompany();
  const { services, error: serviceError, fetchServices } = useListServices();

  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState("services");

  useEffect(() => {
    if (companyId != null) {
      fetchServices(companyId);
      fetchCompany(companyId);
    }
  }, [companyId]);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      fetchServices(companyId!);
      fetchCompany(companyId!);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderManagementCard = (
    title: string,
    icon: string,
    onPress: () => void,
    count?: number
  ) => (
    <TouchableOpacity style={styles.managementCard} onPress={onPress}>
      <View style={styles.managementIconContainer}>
        <Ionicons name={icon as any} size={28} color={theme.colors.primary} />
      </View>
      <View style={styles.managementTextContainer}>
        <Text style={styles.managementTitle}>{title}</Text>
        {count !== undefined && (
          <Text style={styles.managementCount}>{count} items</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("manageCompany")}</Text>
          <Text style={styles.subtitle}>{company?.fantasyName || ""}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("quickActions")}</Text>
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push("/manage/service/add")}
              >
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.quickActionText}>{t("addService.title")}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push("/manage/employee/add")}
              >
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name="person-add-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.quickActionText}>{t("addEmployee.title")}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push("/manage/schedule")}
              >
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.quickActionText}>{t("appoiments")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("management")}</Text>
            
            {renderManagementCard(
              t("manageServices"), 
              "cut-outline", 
              () => router.push("/manage/service"),
              services?.length
            )}
            
            {renderManagementCard(
              t("manageEmployees"), 
              "people-outline", 
              () => router.push("/manage/employee")
            )}
            
            {renderManagementCard(
              t("manageSchedule"), 
              "time-outline", 
              () => router.push("/manage/schedule")
            )}
            
            {renderManagementCard(
              t("manageCompanyProfile"), 
              "business-outline", 
              () => router.push("/manage/company/edit")
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  managementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  managementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  managementTextContainer: {
    flex: 1,
  },
  managementTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text.primary,
  },
  managementCount: {
    fontSize: 14,
    color: theme.colors.text.light,
  },
  serviceCard: {
    width: 200,
    marginRight: 12,
  },
  flatListContent: {
    paddingRight: 20,
  },
  emptyContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.light,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: theme.colors.surface,
    fontWeight: "500",
  },
});
