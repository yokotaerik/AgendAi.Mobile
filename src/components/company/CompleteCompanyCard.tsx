import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import { CompleteCompanyDto, UpdateCompanyDto } from "../../types/company";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEditCompany } from "../../hooks/company/companyHooks";
import CustomInput from "../ui/input/CustomInput";

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
      <Text style={styles.sectionTitle}> {t("companyProfile")}</Text>

      <View>
        {/* {[...(company.imageUrls || []), ...newPhotos].map((photo, index) => (
          <Image
            key={index}
            source={
            //   typeof photo === "string"
            //     ? { uri: baseURL + photo } :
            //     null
            }
            style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 5 }}
          />
        ))} */}
        {/* <AddPhotoComponent
          entityId={company.id!}
          entityType={EntitiesAssociation.Company}
          onPhotoSelect={(photo) => setNewPhotos([...newPhotos, photo.file])}
        /> */}
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
        <Text style={styles.buttonText}>{t("editEmployee.saveButton")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CompleteCompanyCard;
