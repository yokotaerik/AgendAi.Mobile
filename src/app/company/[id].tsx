import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from "../../components/service/ServiceCard";
import BasicInfoCard from "../../components/ui/BasicInfoCard";
import { useGetCompany } from "../../hooks/company/companyHooks";
import { BasicInfoDto } from "../../types/common";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

export default function CompanyDetails() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { companyId, signed, user } = useAuth();
  const { company, loading, error, fetchCompany } = useGetCompany();

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
      <ScrollView>
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
            </Text>
            <Text style={styles.addressText}>
              {company?.address?.neighborhood} - {company?.address?.city}/
              {company?.address?.state}
            </Text>
            <Text style={styles.addressText}>
              CEP: {company?.address?.zipCode}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Serviços</Text>
          <View style={styles.servicesContainer}>
            {company?.services && company.services.length > 0 ? (
              <FlatList
                scrollEnabled={true}
                horizontal={true}
                data={company.services}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item }) => <ServiceCard service={item} />}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>{t("noServicesFound")}</Text>
                )}
              />
            ) : (
              <Text style={styles.emptyText}>{t("noServicesFound")}</Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Profissionais</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.employeesContainer}>
              {company?.employees?.map(
                (employee: BasicInfoDto, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => router.navigate(`/employee/${employee.id}`)}
                  >
                    <BasicInfoCard basicInfo={employee} />
                  </TouchableOpacity>
                )
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
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
});
