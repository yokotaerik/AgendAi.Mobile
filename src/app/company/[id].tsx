import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetCompany } from "../../hooks/company/companyHooks";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import ServiceTabs from "../../components/company/tabs/ServiceTabs";
import EmployeeTab from "../../components/company/tabs/EmployeeTab";
import { ServiceDto } from "../../types/service";
import BookingScreen from "../../components/booking/BookingScreen";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { baseURL } from "../../api";

export default function CompanyDetails() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { companyId, signed, user } = useAuth();
  const { company, loading, error, fetchCompany } = useGetCompany();
  const [activeTab, setActiveTab] = useState("services");
  const [showBooking, setShowBooking] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceDto[]>([]);

  useEffect(() => {
    if (id) fetchCompany(id as string);
  }, [id]);

  const goTochat = () => {
    if (signed) {
      router.push(`/chat/${company?.id}/${user?.id}`);
      return;
    }
    router.push("/auth/login");
  };

  const handleStartBooking = (services: ServiceDto[]) => {
    setSelectedServices(services);
    setShowBooking(true);
  };

  if (loading) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("error.loadCompany")}</Text>
      </View>
    );
  }

  if (showBooking) {
    return (
      <BookingScreen
        services={selectedServices}
        attendance={null}
        backHandler={() => {
          setShowBooking(false);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={{ 
              uri: baseURL + company?.imageUrls?.[0] || 'https://via.placeholder.com/400x200?text=No+Image' 
            }}
            style={styles.companyImage}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.companyName}>{company?.fantasyName}</Text>
          <Text style={styles.corporateName}>{company?.corporateName}</Text>

          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.addressText}>
              {company?.address?.street}, {company?.address?.number}
              {company?.address?.neighborhood && `, ${company?.address?.neighborhood}`} - {company?.address?.city}/
              {company?.address?.state}
            </Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "services" ? styles.activeTabButton : null,
              ]}
              onPress={() => setActiveTab("services")}
            >
              <Ionicons 
                name="list-outline" 
                size={18} 
                color={activeTab === "services" ? theme.colors.text.primary : theme.colors.text.secondary} 
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "services" ? styles.activeTabText : null,
                ]}
              >
                {t("services")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "professionals" ? styles.activeTabButton : null,
              ]}
              onPress={() => setActiveTab("professionals")}
            >
              <Ionicons 
                name="people-outline" 
                size={18} 
                color={activeTab === "professionals" ? theme.colors.text.primary : theme.colors.text.secondary} 
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "professionals" ? styles.activeTabText : null,
                ]}
              >
                {t("employees")}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tabContentContainer}>
            {activeTab === "services" ? (
              <ServiceTabs
                onServiceSelect={(services) => {
                  handleStartBooking(services);
                }}
                services={company?.services || []}
              />
            ) : activeTab === "professionals" ? (
              <EmployeeTab employees={company?.employees || []} />
            ) : null}
          </View>
        </View>
      </View>

      {companyId == null && (
        <TouchableOpacity
          style={styles.sendMessageButton}
          onPress={goTochat}
        >
          <Ionicons name="chatbubble-outline" size={18} color={theme.colors.text.primary} />
          <Text style={styles.sendMessageText}>{t("sendMessage")}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surface,
  },
  companyImage: {
    width: "100%",
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: theme.spacing.md,
    flex: 1,
  },
  companyName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  corporateName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  addressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  activeTabText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  tabContentContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.lg,
  },
  sendMessageButton: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  sendMessageText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
});
