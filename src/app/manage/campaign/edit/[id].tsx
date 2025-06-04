import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import api from "../../../../api";
import { useTranslation } from "react-i18next";
import { UpdateCampaignDto, CampaignDto } from "../../../../types/campaign";
import CustomInput from "../../../../components/ui/input/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditCampaign() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [campaign, setCampaign] = useState<UpdateCampaignDto>({
    id: id as string,
    name: "",
    description: "",
    discountPercentage: 0,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/campaign/${id}`);
      const campaignData: CampaignDto = response.data as CampaignDto;
      
      setCampaign({
        id: campaignData.id,
        name: campaignData.name,
        description: campaignData.description || "",
        discountPercentage: campaignData.discountPercentage,
        startDate: campaignData.startDate,
        endDate: campaignData.endDate,
      });
    } catch (err) {
      console.error("Erro ao buscar campanha:", err);
      setError(t("fetchCampaignError"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCampaign = async () => {
    try {
      if (
        !campaign.name?.trim() ||
        !campaign.discountPercentage ||
        !campaign.startDate ||
        !campaign.endDate
      ) {
        Alert.alert(t("emptyFields"));
        return;
      }

      if (campaign.discountPercentage <= 0 || campaign.discountPercentage > 100) {
        Alert.alert(t("invalidDiscount"));
        return;
      }

      const startDate = new Date(campaign.startDate);
      const endDate = new Date(campaign.endDate);

      if (startDate >= endDate) {
        Alert.alert(t("invalidDateRange"));
        return;
      }

      if(campaign.discountPercentage > 100) {
        Alert.alert(t("invalidDiscount"));
        return;
      }

      const response = await api.put(`/campaign`, campaign);
      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.error(t("editCampaign.error"), error);
      Alert.alert(t("common.error"), t("editCampaign.errorMessage"));
    }
  };

  const handleDeleteCampaign = async () => {
    try {
      const response = await api.delete(`/campaign/${id}`);
      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.error(t("editCampaign.deleteError"), error);
      Alert.alert(t("common.error"), t("editCampaign.deleteErrorMessage"));
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      t("confirmDelete"),
      t("confirmDeleteCampaignMessage", { name: campaign.name }),
      [
        { text: t("cancel"), style: "cancel" },
        { 
          text: t("delete"), 
          onPress: handleDeleteCampaign,
          style: "destructive"
        }
      ]
    );
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setCampaign({
        ...campaign,
        startDate: selectedDate.toISOString(),
      });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setCampaign({
        ...campaign,
        endDate: selectedDate.toISOString(),
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCampaign}>
          <Text style={styles.retryButtonText}>{t("retry")}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{t("editCampaign")}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDelete}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <CustomInput
              label={t("campaignName")}
              value={campaign.name}
              onChange={(text) => setCampaign({ ...campaign, name: text })}
              placeholder={t("enterCampaignName")}
              icon="pricetag-outline"
            />

            <CustomInput
              label={t("campaignDescription")}
              value={campaign.description ?? ''}
              onChange={(text) =>
                setCampaign({ ...campaign, description: text })
              }
              placeholder={t("enterCampaignDescription")}
              icon="document-text-outline"
              multiline
              numberOfLines={3}
            />

            <CustomInput
              label={t("discountPercentage")}
              value={campaign.discountPercentage.toString()}
              onChange={(text) => {
                const value = text.replace(/[^0-9]/g, "");
                setCampaign({
                  ...campaign,
                  discountPercentage: value ? parseInt(value) : 0,
                });
              }}
              placeholder={t("enterDiscountPercentage")}
              icon="cash-outline"
              keyboardType="numeric"
            />

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>{t("startDate")}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.text.primary}
                />
                <Text style={styles.dateText}>
                  {formatDate(campaign.startDate)}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={new Date(campaign.startDate)}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>{t("endDate")}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.text.primary}
                />
                <Text style={styles.dateText}>
                  {formatDate(campaign.endDate)}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={new Date(campaign.endDate)}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                  minimumDate={new Date(campaign.startDate)}
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateCampaign}
            >
              <Text style={styles.saveButtonText}>{t("save")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.md,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
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
  deleteButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  formContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  dateContainer: {
    marginBottom: theme.spacing.sm,
  },
  dateLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  saveButtonText: {
    color: theme.colors.background,
    fontWeight: "bold",
    fontSize: theme.typography.fontSize.md,
  },
});