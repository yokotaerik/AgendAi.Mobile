import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import api from "../../../api";
import { useAuth } from "../../../contexts/AuthContext";
import CustomInput from "../../../components/ui/input/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface CreateEmployeeDto {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export default function AddEmployee() {
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const [employee, setEmployee] = useState<CreateEmployeeDto>({
    name: "",
    surname: "",
    email: "",
    password: "Senha@123"
  });

  const handleAddEmployee = async () => {
    try {
      if (Object.values(employee).some((field) => field.trim() === "")) {
        Alert.alert(t("emptyFields"));
        return;
      }

      if(employee.email.indexOf("@") === -1) {
        Alert.alert(t("invalidEmail")); 
        return;
      }

      const response = await api.post("/employee", employee);
      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.error(t("addEmployee.error"), error);
      Alert.alert(t("common.error"), t("addEmployee.errorMessage"));
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
              <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>{t("addEmployee.title")}</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-add" size={32} color={theme.colors.primary} />
              </View>
              
              <Text style={styles.formTitle}>{t("addEmployee.personalInfo")}</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("addEmployee.name")}</Text>
                  <CustomInput
                    placeholder={t("addEmployee.namePlaceholder")}
                    value={employee.name}
                    onChange={(text: string) => setEmployee({ ...employee, name: text })}
                    containerStyle={styles.customInputContainer}
                    inputStyle={styles.customInput}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("addEmployee.surname")}</Text>
                  <CustomInput
                    placeholder={t("addEmployee.surnamePlaceholder")}
                    value={employee.surname}
                    onChange={(text: string) => setEmployee({ ...employee, surname: text })}
                    containerStyle={styles.customInputContainer}
                    inputStyle={styles.customInput}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("addEmployee.email")}</Text>
                  <CustomInput
                    placeholder={t("addEmployee.emailPlaceholder")}
                    value={employee.email}
                    onChange={(text: string) => setEmployee({ ...employee, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    containerStyle={styles.customInputContainer}
                    inputStyle={styles.customInput}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleAddEmployee}
              >
                <Text style={styles.submitButtonText}>{t("addEmployee.registerButton")}</Text>
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
});
