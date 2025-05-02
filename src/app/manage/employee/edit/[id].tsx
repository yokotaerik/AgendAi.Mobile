import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import api, { baseURL } from "../../../../api";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEditEmployee } from "../../../../hooks/employee/employeeHook";
import { useListServices } from "../../../../hooks/service/serviceHooks";
import { EmployeeDto } from "../../../../types/employee";
import CustomInput from "../../../../components/ui/input/CustomInput";
import AddPhotoComponent from "../../../../components/photo/AddPhotoComponente";
import { EntitiesAssociation, PhotoUploadDto } from "../../../../types/photo";
import { theme } from "../../../../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const EditEmployee: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { companyId } = useAuth();
  const { services, fetchServices } = useListServices();
  const { editEmployee, error, loading } = useEditEmployee();
  const [employeeEditData, setEmployee] = useState<EmployeeDto>();
  const [servicesIds, setServicesIds] = useState<string[]>([]);

  const handleDeleteEmployee = async () => {
    try {
      const response = await api.delete(`/employee/${id}`);
      if (response.status == 200) {
        router.back();
      }
    } catch (err) {
      Alert.alert(t("errorDelete"));
    }
  };

  const uploadPhoto = async (photoData: PhotoUploadDto) => {
    const formData = new FormData();

    if (Platform.OS !== "web" && photoData.uri) {
      formData.append("file", {
        uri: photoData.uri,
        name: photoData.name || "photo.jpg",
        type: photoData.type || "image/jpeg",
      } as any);
    } else if (photoData.file) {
      formData.append("file", photoData.file);
    }

    formData.append("entityId", photoData.entityId);
    formData.append("entityType", photoData.entityType.toString());

    return api.post("/photos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleEditEmployee = async () => {
    if (!employeeEditData?.name?.trim() || !employeeEditData?.surname?.trim()) {
      Alert.alert(t("editEmployee.missingFields"));
      return;
    }

    const response = (await editEmployee({
      id: employeeEditData?.id,
      name: employeeEditData?.name,
      surname: employeeEditData?.surname,
      email: employeeEditData?.email,
      servicesIds,
    })) as any;

    if (response.status == 200) {
      router.back();
    } else {
      Alert.alert("Erro ao editar funcionário");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          if (
            employeeEditData?.name === "" ||
            employeeEditData?.surname === "" ||
            employeeEditData?.email === ""
          ) {
            Alert.alert(t("emptyFields"));
            return;
          }

          if (employeeEditData?.email?.indexOf("@") === -1) {
            Alert.alert(t("invalidEmail"));
            return;
          }

          const response = (await api.get(`/employee/${id}`)) as any;
          if (response.status == 200) {
            setEmployee(response.data as EmployeeDto);
            setServicesIds(
              response.data.services.map((service: any) => service.id)
            );
          }
        } catch (err) {
          Alert.alert("Erro ao buscar funcionário");
        }
        if (companyId) fetchServices(companyId);
      }
    };

    fetchData();
  }, [id]);

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
            <Text style={styles.title}>{t("editEmployee.title")}</Text>
            {employeeEditData?.owner == false && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteEmployee()}
              >
                <Feather name="trash-2" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <View style={styles.profileSection}>
                <Image
                  source={
                    employeeEditData?.imageUrl
                      ? { uri: `${baseURL}${employeeEditData?.imageUrl}` }
                      : require("../../../../../assets/default-avatar.png")
                  }
                  style={styles.photo}
                />
                <AddPhotoComponent
                  entityId={employeeEditData?.id ?? ""}
                  entityType={EntitiesAssociation.Employee}
                  onPhotoSelect={uploadPhoto}
                />
              </View>

              <Text style={styles.formTitle}>
                {t("editEmployee.personalInfo")}
              </Text>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    {t("editEmployee.name")}
                  </Text>
                  <CustomInput
                    placeholder={t("editEmployee.namePlaceholder")}
                    value={employeeEditData?.name || ""}
                    onChange={(text) =>
                      setEmployee({ ...employeeEditData!, name: text })
                    }
                    containerStyle={styles.customInputContainer}
                    inputStyle={styles.customInput}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    {t("editEmployee.surname")}
                  </Text>
                  <CustomInput
                    placeholder={t("editEmployee.surnamePlaceholder")}
                    value={employeeEditData?.surname || ""}
                    onChange={(text) =>
                      setEmployee({ ...employeeEditData!, surname: text })
                    }
                    containerStyle={styles.customInputContainer}
                    inputStyle={styles.customInput}
                  />
                </View>
              </View>

              <Text style={[styles.formTitle, { marginTop: theme.spacing.lg }]}>
                {t("editEmployee.service")}
              </Text>

              <View style={styles.serviceSection}>
                <Text style={styles.subTitle}>{t("offeredServices")}</Text>
                {services?.filter((service) => servicesIds.includes(service.id))
                  .length > 0 ? (
                  services
                    ?.filter((service) => servicesIds.includes(service.id))
                    .map((service) => (
                      <View
                        key={`offered-${service.id}`}
                        style={styles.serviceItem}
                      >
                        <Text style={styles.serviceText}>{service.name}</Text>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => {
                            setServicesIds(
                              servicesIds.filter((id) => id !== service.id)
                            );
                          }}
                        >
                          <Ionicons
                            name="remove-circle"
                            size={24}
                            color={theme.colors.error}
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                ) : (
                  <Text style={styles.emptyText}>
                    {t("noServicesSelected")}
                  </Text>
                )}
              </View>

              <View style={styles.serviceSection}>
                <Text style={styles.subTitle}>{t("availableServices")}</Text>
                {services != null &&
                services.filter((service) => !servicesIds.includes(service.id))
                  .length > 0 ? (
                  services
                    .filter((service) => !servicesIds.includes(service.id))
                    .map((service) => (
                      <View
                        key={`available-${service.id}`}
                        style={styles.serviceItem}
                      >
                        <Text style={styles.serviceText}>{service.name}</Text>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => {
                            setServicesIds([...servicesIds, service.id]);
                          }}
                        >
                          <Ionicons
                            name="add-circle"
                            size={24}
                            color={theme.colors.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                ) : (
                  <Text style={styles.emptyText}>
                    {t("noServicesAvailable")}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleEditEmployee}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.background} />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {t("saveButton")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditEmployee;

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
  profileSection: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.secondary,
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
  serviceSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  subTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.colors.tertiary}40`,
  },
  serviceText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontStyle: "italic",
    textAlign: "center",
    padding: theme.spacing.md,
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
