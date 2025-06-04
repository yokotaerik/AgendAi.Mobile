import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import api from "../../../api";
import { CampaignDto } from "../../../types/campaign";

const ManageCampaigns: React.FC = () => {
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    if (!companyId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/campaign/company/${companyId}`);
      setCampaigns(response.data as CampaignDto[]);
    } catch (err) {
      console.error("Erro ao buscar campanhas:", err);
      setError(t("fetchCampaignsError"));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (companyId != null) {
        fetchCampaigns();
      }
    }, [companyId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCampaigns();
    setRefreshing(false);
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await api.delete(`/campaign/${id}`);
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    } catch (err) {
      console.error("Erro ao excluir campanha:", err);
      Alert.alert(t("error"), t("deleteCampaignError"));
    }
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      t("confirmDelete"),
      t("confirmDeleteCampaignMessage", { name }),
      [
        { text: t("cancel"), style: "cancel" },
        { 
          text: t("delete"), 
          onPress: () => handleDeleteCampaign(id),
          style: "destructive"
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
        <Text style={styles.title}>{t("campaigns")}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/manage/campaign/add")}
        >
          <Ionicons name="add-circle-outline" size={20} color={theme.colors.background} />
          <Text style={styles.addButtonText}>{t("addCampaign")}</Text>
        </TouchableOpacity>

        {campaigns && campaigns.length > 0 ? (
          <FlatList
            data={campaigns}
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
              <View style={styles.campaignItem}>
                <TouchableOpacity
                  style={styles.campaignCard}
                  onPress={() => router.push(`/manage/campaign/edit/${item.id}`)}
                >
                  <View style={styles.campaignIconContainer}>
                    <Ionicons name="pricetag-outline" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.campaignInfo}>
                    <Text style={styles.campaignName}>{item.name}</Text>
                    <Text style={styles.campaignDescription} numberOfLines={1}>
                      {item.description || t("noDescription")}
                    </Text>
                    <View style={styles.campaignDetails}>
                      <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={14} color={theme.colors.text.light} />
                        <Text style={styles.detailText}>{item.discountPercentage}%</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={14} color={theme.colors.text.light} />
                        <Text style={styles.detailText}>
                          {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(item.id, item.name)}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            {loading ? (
              <Text style={styles.emptyText}>{t("loading")}</Text>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <>
                <Ionicons name="pricetag-outline" size={48} color={theme.colors.text.light} />
                <Text style={styles.emptyText}>{t("noCampaigns")}</Text>
                <Text style={styles.emptySubtext}>{t("addCampaignPrompt")}</Text>
              </>
            )}
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  addButtonText: {
    color: theme.colors.background,
    marginLeft: theme.spacing.xs,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  campaignItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  campaignCard: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  campaignIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  campaignDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  campaignDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.md,
    marginBottom: 4,
  },
  detailText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.light,
    marginLeft: 4,
  },
  deleteButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
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
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.light,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    textAlign: "center",
  },
});

export default ManageCampaigns;