import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import {
  useGetCompany,
  useEditCompany,
} from "../../../hooks/company/companyHooks";
import { useAuth } from "../../../contexts/AuthContext";
import CustomInput from "../../../components/ui/input/CustomInput";
import AddPhotoComponent from "../../../components/photo/AddPhotoComponente";
import { PhotoUploadDto, EntitiesAssociation } from "../../../types/photo";
import api, { baseURL } from "../../../api";
import AddressForm, {
  AddressFormData,
  AddressFormRef,
} from "../../../components/address/AddressForm";
import LoadingComponent from "../../../components/ui/LoadingComponent";

export default function EditCompanyScreen() {
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const {
    company,
    loading: fetchLoading,
    error: fetchError,
    fetchCompany,
  } = useGetCompany();
  const {
    editCompany,
    loading: saveLoading,
    error: saveError,
  } = useEditCompany();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]); // State for images

  // Company data
  const [corporateName, setCorporateName] = useState("");
  const [fantasyName, setFantasyName] = useState("");

  // Address state combined into a single object
  const addressFormRef = useRef<AddressFormRef>(null);
  const [address, setAddress] = useState<AddressFormData>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (companyId) {
      fetchCompany(companyId);
    }
  }, [companyId]);

  useEffect(() => {
    if (company) {
      // Set company data
      setCorporateName(company.corporateName || "");
      setFantasyName(company.fantasyName || "");

      // Set address data if available
      if (company.address) {
        setAddress({
          street: company.address.street || "",
          number: company.address.number || "",
          complement: company.address.complement || "",
          neighborhood: company.address.neighborhood || "",
          city: company.address.city || "",
          state: company.address.state || "",
          zipCode: company.address.zipCode || "",
          latitude: company.address.latitude,
          longitude: company.address.longitude,
        });
      }

      // Set images if available
      if (company.imageUrls && company.imageUrls.length > 0) {
        setImages(company.imageUrls);
      }
    }
  }, [company]);

  const handlePhotoSelect = async (photoData: PhotoUploadDto) => {
    try {
      setLoading(true);

      // Create FormData for upload
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

      const response = api.post("/photos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }) as any;
      if (response.status === 200 || response.status === 201) {
        if (companyId) {
          fetchCompany(companyId);
        }
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert(t("errorUploadingPhoto"));
    } finally {
      setLoading(false);
    }
  };

    const handleRemoveImage = async (imageUrl: string) => {
      try {
        setLoading(true);

        // Find the photo ID from the URL
        const photoToRemove = company?.imageUrls?.find(
          (photo) => photo === imageUrl
        );

        let photoId = photoToRemove?.replace("/photos/", "")

        if (photoToRemove) {
          const response = await api.delete(`/photo/${photoId}`);

          if (response.status === 200 || response.status === 204) {
            // Update local state
            setImages(images.filter((img) => img !== imageUrl));
          }
        }
      } catch (error) {
        console.error("Error removing photo:", error);
        Alert.alert(t("errorRemovingPhoto"));
      } finally {
        setLoading(false);
      }
    };

  const handleSave = async () => {
    // Validate required fields
    if (
      !corporateName.trim() ||
      !fantasyName.trim() ||
      !address.street.trim() ||
      !address.number.trim() ||
      !address.neighborhood.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.zipCode.trim()
    ) {
      Alert.alert(t("emptyFields"));
      return;
    }

    try {
      const companyData = {
        id: companyId,
        corporateName,
        fantasyName,
        address: {
          street: address.street,
          number: address.number,
          complement: address.complement,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          latitude: address.latitude,
          longitude: address.longitude,
        },
      };

      if (addressFormRef.current) {
        const addressWithCoordinates =
          await addressFormRef.current.getCoordinatesAsync();

        // Now you can save the address with coordinates
        console.log("Address with coordinates:", addressWithCoordinates);

        companyData.address.latitude = addressWithCoordinates.latitude;
        companyData.address.longitude = addressWithCoordinates.longitude;

        await editCompany(companyData);
      }

      // Refresh company data after successful update
      if (companyId) {
        fetchCompany(companyId);
      }
    } catch (error) {
      console.error("Error saving company:", error);
      Alert.alert(t("errorSavingCompany"));
    }
  };

  if (fetchLoading) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
          <Text style={styles.title}>{t("editCompany")}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{t("companyData")}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("corporateName")}</Text>
            <CustomInput
              placeholder={t("corporateName")}
              value={corporateName}
              onChange={setCorporateName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("fantasyName")}</Text>
            <CustomInput
              placeholder={t("fantasyName")}
              value={fantasyName}
              onChange={setFantasyName}
            />
          </View>

          {/* Replace the address fields with the AddressForm component */}
          <AddressForm
            address={address}
            onChange={setAddress}
            ref={addressFormRef}
          />

          <View style={styles.imagesSection}>
            <Text style={styles.sectionTitle}>{t("companyImages")}</Text>

            {companyId && (
              <AddPhotoComponent
                entityId={companyId}
                entityType={EntitiesAssociation.Company}
                onPhotoSelect={handlePhotoSelect}
              />
            )}

            <View style={styles.imageGrid}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{ uri: baseURL + image }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {}}
                  >
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (loading || saveLoading) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={loading || saveLoading}
          >
            <Text style={styles.saveButtonText}>
              {loading || saveLoading ? t("saving") : t("saveChanges")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
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
  content: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: theme.colors.text.primary,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  imagesSection: {
    marginTop: theme.spacing.lg,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  imageContainer: {
    position: "relative",
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.sm,
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
  },
});
