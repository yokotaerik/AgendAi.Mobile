import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Feather, Ionicons } from "@expo/vector-icons";
import api from "../../../../api";
import { useGetService } from "../../../../hooks/service/serviceHooks";
import useTimeSpan from "../../../../hooks/utils/useTimeSpan";
import { UpdateServiceDto } from "../../../../types/service";
import CustomInput from "../../../../components/ui/input/CustomInput";
import { theme } from "../../../../styles/theme";
import { useCurrency } from "../../../../contexts/CurrencyContext";

export default function EditService() {
  const { reverseConvert} = useCurrency();
  const { t } = useTranslation();
  const { convertToMinutesInString, convertToTimeSpan } = useTimeSpan();
  const { id } = useLocalSearchParams();
  const { service, loading, error, refetch } = useGetService(id as string);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState<UpdateServiceDto>({
    id: "",
    name: "",
    description: "",
    price: 0,
    duration: "",
  });
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      refetch();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (service) {
      setFormData({
        id: id as string,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
      });
      setPrice(service.price.toString());
      setDuration(convertToMinutesInString(service.duration) ?? "");
    }
  }, [service]);

  const handleChangeDuration = (minutes: string) => {
    setDuration(minutes);
    const parsedMinutes = parseInt(minutes);
    if (!isNaN(parsedMinutes)) {
      var duration = convertToTimeSpan(parsedMinutes);
      setFormData({
        ...formData,
        duration: duration,
      });
    }
  };

  const handleDeleteService = async () => {
    try {
      const response = await api.delete(`/service/${id}`);
      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.error(t("editService.deleteError"), error);
      Alert.alert(t("common.error"), t("editService.deleteErrorMessage"));
    }
  };

  const handleUpdateService = async () => {
    try {
      if (
        formData.name?.trim() === "" ||
        formData.description?.trim() === "" ||
        formData.price === 0 ||
        formData.duration?.trim() === ""
      ) {
        Alert.alert(t("emptyFields"));
        return;
      }

      const response = await api.put("service", formData);
      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.error(t("editService.error"), error);
      Alert.alert(t("common.error"), t("editService.errorMessage"));
    }
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
      <SafeAreaView style={styles.loadingContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.errorContent}
        >
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>{t("error.loadService")}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>{t("retry")}</Text>
          </TouchableOpacity>
        </ScrollView>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>{t("editService.title")}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteService}
            >
              <Feather name="trash-2" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <View style={styles.iconContainer}>
                <Ionicons name="pricetag" size={32} color={theme.colors.primary} />
              </View>
              
              <Text style={styles.formTitle}>{t("editService.serviceInfo")}</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("editService.name")}</Text>
                  <CustomInput
                    placeholder={t("editService.namePlaceholder")}
                    value={formData.name ?? ""}
                    onChange={(text: string) => setFormData({ ...formData, name: text })}
                    containerStyle={styles.customInputContainer}
                    inputStyle={styles.customInput}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { marginBottom: 20 }]}>
                  <Text style={styles.inputLabel}>{t("editService.description")}</Text>
                  <CustomInput
                    placeholder={t("editService.descriptionPlaceholder")}
                    value={formData.description ?? ""}
                    onChange={(text: string) => setFormData({ ...formData, description: text })}
                    multiline
                    containerStyle={styles.customInputContainer}
                    inputStyle={{ ...styles.customInput, ...styles.multilineInput }}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("editService.price")}</Text>
                  <CustomInput
                    placeholder={t("editService.pricePlaceholder")}
                    value={price}
                    onChange={(value: string) => {
                      const parsedValue = parseFloat(value.replace(',', '.'));

                      if (!isNaN(parsedValue) || value === "") {
                        setPrice(value); // valor como string, convertido para exibição

                        const brlValue = reverseConvert(parsedValue); // converte de moeda local → BRL
                        setFormData({ ...service, price: brlValue });
                      }
                    }}
                    keyboardType="numeric"
                    containerStyle={styles.customInputContainer}
                    inputStyle={styles.customInput}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("editService.duration")}</Text>
                  <CustomInput
                    placeholder={t("editService.durationPlaceholder")}
                    value={duration}
                    onChange={(value: string) => {
                      if (!isNaN(parseInt(value)) || value === "")
                        handleChangeDuration(value);
                    }}
                    keyboardType="numeric"
                    containerStyle={styles.customInputContainer}
                    inputStyle={styles.customInput}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleUpdateService}
              >
                <Text style={styles.submitButtonText}>{t("editService.updateButton")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
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
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.error,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formContainer: {
    padding: theme.spacing.md,
  },
  formCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  formTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    marginLeft: 4,
  },
  customInputContainer: {
    marginBottom: 0,
  },
  customInput: {
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    shadowColor: 'rgba(198, 160, 125, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
  },
});
