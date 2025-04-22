import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { CompleteCompanyDto, UpdateCompanyDto } from "../../types/company";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEditCompany } from "../../hooks/company/companyHooks";
import CustomInput from "../ui/input/CustomInput";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

interface CompleteCompanyCardProps {
  company: CompleteCompanyDto;
}

const CompleteCompanyCard: React.FC<CompleteCompanyCardProps> = ({
  company,
}) => {
  const { t } = useTranslation();
  const [companyEdit, setCompanyEdit] = useState<CompleteCompanyDto>(company);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const { editCompany, error, loading } = useEditCompany();

  const onChange = (field: string, value: any) => {
    setCompanyEdit({ ...companyEdit, [field]: value });
  };

  const handleUpdate = async () => {
    const data: UpdateCompanyDto = {
      id: companyEdit.id,
      fantasyName: companyEdit.fantasyName,
      address: {
        street: companyEdit.address?.street || "",
        number: companyEdit.address?.number || "",
        complement: companyEdit.address?.complement || "",
        city: companyEdit.address?.city || "",
        state: companyEdit.address?.state || "",
        zipCode: companyEdit.address?.zipCode || "",
      },
    };

    const response = await editCompany(data);

    if(response.status == 200) Alert.alert(t("sucessSave"))
  };

  if (error) {
    Alert.alert(error.message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t("companyProfile")}</Text>

      <View>
        {/* Image handling code commented out in original */}
      </View>

      <Text style={styles.label}>{t("corporateName")}</Text>
      <CustomInput
        onChange={() => {}}
        style={[styles.input, styles.disabledInput]}
        value={companyEdit.corporateName || ""}
        editable={false}
      />

      <Text style={styles.label}>{t("fantasyName")}</Text>
      <CustomInput
        style={styles.input}
        value={companyEdit.fantasyName || ""}
        onChange={(text: any) => onChange("fantasyName", text)}
      />

      <Text style={styles.label}>{t("address")}</Text>
      <CustomInput
        style={styles.input}
        value={companyEdit.address?.street || ""}
        placeholder={t("street")}
        onChange={(text: any) =>
          onChange("address", { ...companyEdit.address, street: text })
        }
      />
      <CustomInput
        style={styles.input}
        value={companyEdit.address?.number || ""}
        placeholder={t("number")}
        onChange={(text: any) =>
          onChange("address", { ...companyEdit.address, number: text })
        }
      />

      <CustomInput
        style={styles.input}
        value={companyEdit.address?.complement || ""}
        placeholder={t("complement")}
        onChange={(text: any) =>
          onChange("address", { ...companyEdit.address, complement: text })
        }
      />

      <CustomInput
        style={styles.input}
        value={companyEdit.address?.city || "" }
        placeholder={t("city")}
        onChange={(text: any) =>
          onChange("address", { ...companyEdit.address, city: text })
        }
      />
      <CustomInput
        style={styles.input}
        value={companyEdit.address?.state || ""}
        placeholder={t("state")}
        onChange={(text: any) =>
          onChange("address", { ...companyEdit.address, state: text })
        }
      />
      <CustomInput
        style={styles.input}
        value={companyEdit.address?.zipCode || ""}
        placeholder={t("zipCode")}
        onChange={(text: any) =>
          onChange("address", { ...companyEdit.address, zipCode: text })
        }
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Ionicons name="save-outline" size={20} color={theme.colors.text.primary} />
        <Text style={styles.buttonText}>{t("saveButton")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "bold",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  disabledInput: {
    backgroundColor: `${theme.colors.background}80`,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    marginTop: theme.spacing.sm,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "bold",
    marginLeft: theme.spacing.xs,
  },
});

export default CompleteCompanyCard;
