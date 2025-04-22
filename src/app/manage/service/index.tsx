import React from "react";
import {
  View,
  Text,
  FlatList,

  TouchableOpacity,
  StyleSheet,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useListServices } from "../../../hooks/service/serviceHooks";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

const ManageServices: React.FC = () => {
  const { services, error: serviceError, fetchServices } = useListServices();
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (companyId != null) {
        fetchServices(companyId);
      }
    }, [companyId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    if (companyId != null) {
        fetchServices(companyId);
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
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t("services")}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/manage/service/add")}
        >
          <Ionicons name="add-circle-outline" size={20} color={theme.colors.background} />
          <Text style={styles.addButtonText}>{t("addService.title")}</Text>
        </TouchableOpacity>

        {services && services.length > 0 ? (
          <FlatList
            data={services}
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
              <TouchableOpacity
                style={styles.serviceItem}
                onPress={() => router.push(`/manage/service/edit/${item.id}`)}
              >
                <View style={styles.serviceCard}>
                  <View style={styles.serviceIconContainer}>
                    <Ionicons name="cut-outline" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.serviceDescription} numberOfLines={1}>
                      {item.description || t("noDescription")}
                    </Text>
                    <View style={styles.serviceDetails}>
                      <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={14} color={theme.colors.text.light} />
                        <Text style={styles.detailText}>{item.duration}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={14} color={theme.colors.text.light} />
                        <Text style={styles.detailText}>R$ {item.price.toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => router.push(`/manage/service/edit/${item.id}`)}
                  >
                    <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
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
            <Text style={styles.emptySubtext}>{t("addYourFirstService")}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: theme.colors.surface, // Cor de fundo do conteúdo da tel
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
  serviceItem: {
    marginBottom: theme.spacing.sm,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  detailText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.light,
    marginLeft: 4,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
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

export default ManageServices;