import { useState, useCallback } from "react";
import { Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { Redirect, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompanyCard } from "../../components/company/CompanyCard";
import { useListCompanies } from "../../hooks/company/companyHooks";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const { t } = useTranslation();
  const { companies, loading, error, fetchCompanies } = useListCompanies();
  const [refreshing, setRefreshing] = useState(false);
  const { owner } = useAuth();

  if(owner) return <Redirect href="/(ownerTabs)/manage" />;
    
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCompanies();
    setRefreshing(false);
  }, [fetchCompanies]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}>
          <Text style={styles.title}>{t("loading")}</Text>
        </RefreshControl>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}>
          <Text style={styles.title}>{t("error.loadCompanies")}</Text>
        </RefreshControl>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Empresas</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/company/${item.id}`)}>
            <CompanyCard company={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
    // <BookingScreen onAddAnotherService={() => {}}
    // onConfirmBooking={() => {}}
    // service={{         "id": "e1bf8504-f90a-48e8-9b1d-52a389a75efc",
    //   "name": "Corte tesoura curto",
    //   "description": "Simples",
    //   "price": 200,
    //   "duration": "00:20:00",
    //   "companyId": "355d1699-23dc-44d5-8247-6af49b2a9e80"}}
    // />
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  link: {
    color: "#0066cc",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  list: {
    width: "100%",
  },
});
