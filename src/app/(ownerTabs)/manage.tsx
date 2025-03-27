import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
import { useListEmployees } from "../../hooks/employee/employeeHook";
import BasicInfoCard from "../../components/ui/BasicInfoCard";
import { useGetCompany } from "../../hooks/company/companyHooks";
import CompleteCompanyCard from "../../components/company/CompleteCompanyCard";

export default function ManageCompany() {
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const { company, fetchCompany } = useGetCompany()
  const { services,  error : serviceError, fetchServices } = useListServices();
  const { employees, error : employeeError, fetchEmployees } = useListEmployees()
  const [refreshing, setRefreshing] = useState(false);

  

  useEffect(() => {
    if(companyId != null) {
      fetchServices(companyId)
      fetchEmployees(companyId)
      fetchCompany(companyId)
    }

  }, [companyId])

  const onRefresh = async () => {
    setRefreshing(true);
    
    try {
      fetchServices(companyId!);
      fetchEmployees(companyId!);
      fetchCompany(companyId!)
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.title}>Gerenciar Empresa</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/manage/add-service")}
            >
              <Text style={styles.buttonText}>Adicionar Serviço</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/manage/add-employee")}
            >
              <Text style={styles.buttonText}>Adicionar Funcionário</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Serviços</Text>
            {services && services.length > 0 ? (
              <FlatList
              scrollEnabled={true}
                horizontal={true}
                data={services}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() =>
                      router.push(`/manage/edit-service/${item.id}`)
                    }
                  >
                    <ServiceCard service={item}/>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>
                    {t("noServicesFound")}
                  </Text>
                )}
              />
            ) : (
              <Text style={styles.emptyText}>{t("noServicesFound")}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("employees")}</Text>
            {employees && employees.length > 0 ? (
              <FlatList
              scrollEnabled={true}
                horizontal={true}
                data={employees}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() =>
                      router.push(`/manage/edit-employee/${item.id}`)
                    }
                  >
                    <BasicInfoCard basicInfo={{ id: item.id, completeName: item.completeName , imageUrl: item.imageUrl}} />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>
                    {t("noEmployeeFound")}
                  </Text>
                )}
              />
            ) : (
              <Text style={styles.emptyText}>{t("noEmployeeFound")}</Text>
            )}
          </View>


          <View style={styles.section}>

            {company != null ? (
              <CompleteCompanyCard company={company} />
            ) : null }
          </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginRight: 10, // Adicionado gap entre os itens
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
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


