import { View, Text, StyleSheet, Image, Alert, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from "../../components/service/ServiceCard";
import { useEffect, useState } from "react";
import api, { baseURL } from "../../api";
import { EmployeeDto } from "../../types/employee";

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
      {employee && (
        <View style={styles.infoContainer}>
          <Image
            source={{ uri: baseURL + employee.imageUrl }}
            style={styles.basicInfoImage}
          />
          <Text style={styles.companyName}>
            {employee.name} {employee.surname}
          </Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{employee.email}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Serviços</Text>
      <View style={styles.servicesContainer}>
        {employee?.services && employee.services.length > 0 ? (
          <FlatList
            scrollEnabled={true}
            horizontal={true}
            data={employee.services}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  basicInfoImage: {
    width: "100%",
    aspectRatio: 1,
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
    display: "flex",
    justifyContent: "flex-start"
  },
  employeesContainer: {
    flexDirection: "row",
    gap: 15,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  flatListContent: {
    gap: 10,
  },
});
