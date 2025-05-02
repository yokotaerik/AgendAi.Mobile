import { View, Text, StyleSheet, Image, Alert, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from "../../components/service/ServiceCard";
import { useEffect, useState } from "react";
import api, { baseURL } from "../../api";
import { EmployeeDto } from "../../types/employee";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

export default function CompanyDetails() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [employee, setEmployee] = useState<EmployeeDto>();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = (await api.get(`/employee/${id}`)) as any;
          if (response.status == 200) {
            setEmployee(response.data as EmployeeDto);
          }
        } catch (err) {
          Alert.alert("Erro ao buscar funcionário");
        }
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{t("error.loadCompany")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push("comapany/" + employee?.company?.id)}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("employeeDetails")}</Text>
        <View style={styles.placeholder} />
      </View>
      
      {employee && (
        <View style={styles.profileContainer}>
          <Image
            source={{ 
              uri: employee.imageUrl ? baseURL + employee.imageUrl : 'https://via.placeholder.com/150'
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.employeeName}>
              {employee.name} {employee.surname}
            </Text>
            <View style={styles.emailContainer}>
              <Ionicons name="mail-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.emailText}>{employee.email}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>{t("services")}</Text>
        </View>
        
        <View style={styles.servicesContainer}>
          {employee?.services && employee.services.length > 0 ? (
            <FlatList
              scrollEnabled={true}
              horizontal={true}
              data={employee.services}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flatListContent}
              renderItem={({ item }) => <ServiceCard service={item} />}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Ionicons name="cut-outline" size={48} color={theme.colors.tertiary} />
                  <Text style={styles.emptyText}>{t("noServicesFound")}</Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="cut-outline" size={48} color={theme.colors.tertiary} />
              <Text style={styles.emptyText}>{t("noServicesFound")}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
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
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  profileContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.tertiary,
  },
  profileInfo: {
    alignItems: "center",
  },
  employeeName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  sectionContainer: {
    margin: theme.spacing.md,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  servicesContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
});
