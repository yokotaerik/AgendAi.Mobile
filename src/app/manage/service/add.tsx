import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../api";
import { useTranslation } from "react-i18next";
import useTimeSpan from "../../../hooks/utils/useTimeSpan";
import { UpdateServiceDto } from "../../../types/service";
import CustomInput from "../../../components/ui/input/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import { useCurrency } from "../../../contexts/CurrencyContext";

export default function AddService() {
  const { reverseConvert} = useCurrency();
  const { t } = useTranslation();
  const { convertToMinutesInString, convertToTimeSpan } = useTimeSpan();
  const { companyId } = useAuth();
  const [service, setService] = useState<UpdateServiceDto>({
    name: "",
    description: "",
    price: 0,
    duration: "",
  });

  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const displayValue = reverseConvert(service.price ?? 0).toString();

  const handleChangeDuration = (minutes: string) => {
    setDuration(minutes);
    const parsedMinutes = parseInt(minutes);
    if (!isNaN(parsedMinutes)) {
      var duration = convertToTimeSpan(parsedMinutes);
      setService({
        ...service,
        duration: duration,
      });
    }
  };

  const handleAddService = async () => {
    try {
      if (
        !service.name?.trim() ||
        !service.description?.trim() ||
        !service.price ||
        !service.duration
      ) {
        Alert.alert(t("emptyFields"));
        return;
      }

      const response = await api.post("/service", service);
      if (response.status === 201) {
        router.back();
      }
    } catch (error) {
      console.error(t("addService.error"), error);
      Alert.alert(t("common.error"), t("addService.errorMessage"));
    }
  };

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
            <Text style={styles.title}>{t("addService.title")}</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="pricetag"
                  size={32}
                  color={theme.colors.primary}
                />
              </View>

              <Text style={styles.formTitle}>
                {t("addService.serviceInfo")}
              </Text>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("addService.name")}</Text>
                  <CustomInput
                    placeholder={t("addService.namePlaceholder")}
                    value={service.name ?? ""}
                    onChange={(text: string) =>
                      setService({ ...service, name: text })
                    }
                    containerStyle={styles.customInputContainer}
                    inputStyle={styles.customInput}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { marginBottom: 20 }]}>
                  <Text style={styles.inputLabel}>
                    {t("addService.description")}
                  </Text>
                  <CustomInput
                    placeholder={t("addService.descriptionPlaceholder")}
                    value={service.description ?? ""}
                    onChange={(text: string) =>
                      setService({ ...service, description: text })
                    }
                    multiline
                    containerStyle={styles.customInputContainer}
                    inputStyle={{
                      ...styles.customInput,
                      ...styles.multilineInput,
                    }}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("addService.price")}</Text>
                  <CustomInput
                    placeholder={t("addService.pricePlaceholder")}
                    value={price}
                    onChange={(value: string) => {
                      const parsedValue = parseFloat(value.replace(',', '.'));

                      if (!isNaN(parsedValue) || value === "") {
                        setPrice(value); // valor como string, convertido para exibição

                        const brlValue = reverseConvert(parsedValue); // converte de moeda local → BRL
                        setService({ ...service, price: brlValue });
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
                  <Text style={styles.inputLabel}>
                    {t("addService.duration")}
                  </Text>
                  <CustomInput
                    placeholder={t("addService.durationPlaceholder")}
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
                onPress={handleAddService}
              >
                <Text style={styles.submitButtonText}>
                  {t("addService.addButton")}
                </Text>
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
  placeholder: {
    width: 40,
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
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  formTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
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
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.md,
    shadowColor: "rgba(198, 160, 125, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
  },
});
