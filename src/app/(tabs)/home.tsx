import { useState, useCallback } from "react";
import { Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, View, TextInput } from "react-native";
import { Redirect, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompanyCard } from "../../components/company/CompanyCard";
import { useListCompanies } from "../../hooks/company/companyHooks";
import { useAuth } from "../../contexts/AuthContext";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { t } = useTranslation();
  const { companies, loading, error, fetchCompanies } = useListCompanies();
  const [refreshing, setRefreshing] = useState(false);
  const { owner } = useAuth();
  const [search, setSearch] = useState(""); // estado para pesquisa

  if(owner) return <Redirect href="/(ownerTabs)/manage" />;
    
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCompanies();
    setRefreshing(false);
  }, [fetchCompanies]);

  const filteredCompanies = companies.filter(company => {
    const searchLower = search.toLowerCase();
    return (
      company.fantasyName?.toLowerCase().includes(searchLower) ||
      company.corporateName?.toLowerCase().includes(searchLower) ||
      company.address?.city?.toLowerCase().includes(searchLower) ||
      company.address?.neighborhood?.toLowerCase().includes(searchLower) ||
      company.address?.street?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t("loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
          <Text style={styles.errorText}>{t("error.loadCompanies")}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>{t("retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("companies")}</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t("search")}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={theme.colors.text.secondary}
        />
      </View>
      <FlatList
        data={filteredCompanies}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.cardContainer}
            onPress={() => router.push(`/company/${item.id}`)}
          >
            <CompanyCard company={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={60} color={theme.colors.text.light} />
            <Text style={styles.emptyText}>{t("noCompaniesFound")}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  list: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  cardContainer: {
    marginBottom: theme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    textAlign: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
  },
  retryButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    height: 40,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
});
