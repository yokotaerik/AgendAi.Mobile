import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetCompany } from "../../hooks/company/companyHooks";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import ServiceTabs from "../../components/company/tabs/ServiceTabs";
import EmployeeTab from "../../components/company/tabs/EmployeeTab";
import { ServiceDto } from "../../types/service";
import BookingScreen from "../../components/booking/BookingScreen";

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
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{t("error.loadCompany")}</Text>
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
      {companyId == null ? (
        <TouchableOpacity
          style={styles.sendMessageButton}
          onPress={() => goTochat()}
        >
          <Text> Enviar mensagem </Text>
        </TouchableOpacity>
      ) : null}
      <View>
        <Image
          source={{ uri: company?.imageUrls?.[0] }}
          style={styles.companyImage}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.companyName}>{company?.fantasyName}</Text>
          <Text style={styles.corporateName}>{company?.corporateName}</Text>

          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {company?.address?.street}, {company?.address?.number}
              {company?.address?.neighborhood} - {company?.address?.city}/
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
          <View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  flatListContent: {
    gap: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  companyImage: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  corporateName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  servicesContainer: {
    gap: 10,
  },
  sendMessageButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0099ff",
    padding: 10,
    zIndex: 10,
    width: 140,
    height: 40,
    borderRadius: 5,
  },
  employeesContainer: {
    flexDirection: "row",
    gap: 15,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  activeTabButton: {
    backgroundColor: "#0099ff",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
  },
});
