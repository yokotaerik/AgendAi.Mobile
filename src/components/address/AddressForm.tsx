import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../ui/input/CustomInput";
import { theme } from "../../styles/theme";

export type AddressFormData = {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
};

export type AddressFormRef = {
  getCoordinatesAsync: () => Promise<AddressFormData>;
};

type AddressFormProps = {
  address: AddressFormData;
  onChange: (address: AddressFormData) => void;
};

const AddressForm = forwardRef<AddressFormRef, AddressFormProps>(
  ({ address, onChange }, ref) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);
    const [zipCodeLoading, setZipCodeLoading] = useState(false);
    const [isBrazil, setIsBrazil] = useState(true);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getCoordinatesAsync: async () => {
        // Otherwise, get coordinates and return updated address
        return await getCoordinatesAndReturn();
      },
    }));

    // Check if zipCode format matches Brazilian pattern
    useEffect(() => {
      // Brazilian zipCode has 8 digits (with or without hyphen)
      const brazilianZipCodePattern = /^\d{5}-?\d{3}$/;
      setIsBrazil(brazilianZipCodePattern.test(address.zipCode));
    }, [address.zipCode]);

    const updateField = (field: keyof AddressFormData, value: string) => {
      onChange({
        ...address,
        [field]: value,
      });
    };

    // Function to get coordinates and return the updated address
    const getCoordinatesAndReturn = async (): Promise<AddressFormData> => {
      try {
        setLoading(true);

        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(t("locationPermissionDenied"));
          return address;
        }

        // Build full address string
        const fullAddress = `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.zipCode}`;

        // Get coordinates from address
        const geocoded = await Location.geocodeAsync(fullAddress);

        if (geocoded.length > 0) {
          const { latitude, longitude } = geocoded[0];
          
          // Create updated address with coordinates
          const updatedAddress = {
            ...address,
            latitude,
            longitude,
          };
          
          // Update the form state
          onChange(updatedAddress);
          
          // Return the updated address
          return updatedAddress;
        } else {
          Alert.alert(t("addressNotFound"));
          return address;
        }
      } catch (error) {
        console.error("Error getting coordinates:", error);
        Alert.alert(t("errorGettingCoordinates"));
        return address;
      } finally {
        setLoading(false);
      }
    };

    // Function to fetch address from Brazilian zipCode
    const fetchAddressByZipCode = async () => {
      if (!address.zipCode || address.zipCode.length < 8) {
        Alert.alert(t("invalidZipCode"));
        return;
      }

      try {
        setZipCodeLoading(true);
        
        // Remove any non-numeric characters
        const zipCode = address.zipCode.replace(/\D/g, '');
        
        // Call the ViaCEP API (Brazilian zipcode API)
        const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          Alert.alert(t("zipCodeNotFound"));
          return;
        }
        
        // Update address with the retrieved information
        onChange({
          ...address,
          street: data.logradouro || address.street,
          neighborhood: data.bairro || address.neighborhood,
          city: data.localidade || address.city,
          state: data.uf || address.state,
          complement: data.complemento || address.complement,
        });
        
        Alert.alert(t("addressFoundByZipCode"));
      } catch (error) {
        console.error("Error fetching address by zipCode:", error);
        Alert.alert(t("errorFetchingAddressByZipCode"));
      } finally {
        setZipCodeLoading(false);
      }
    };

    const getCurrentLocation = async () => {
      try {
        setAutoCompleteLoading(true);

        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(t("locationPermissionDenied"));
          return;
        }

        // Get current position
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        const { latitude, longitude } = location.coords;

        // Get address from coordinates (reverse geocoding)
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addressResponse && addressResponse.length > 0) {
          const locationInfo = addressResponse[0];

          // Update address with the retrieved information
          onChange({
            street: locationInfo.street || address.street,
            number: locationInfo.streetNumber || address.number,
            complement: address.complement,
            neighborhood: locationInfo.district || address.neighborhood,
            city: locationInfo.city || address.city,
            state: locationInfo.region || address.state,
            zipCode: locationInfo.postalCode || address.zipCode,
            latitude,
            longitude,
          });

          Alert.alert(t("addressAutoCompleted"));
        } else {
          // If we couldn't get the address details, at least save the coordinates
          onChange({
            ...address,
            latitude,
            longitude,
          });

          Alert.alert(t("coordinatesObtainedNoAddress"));
        }
      } catch (error) {
        console.error("Error getting current location:", error);
        Alert.alert(t("errorGettingLocation"));
      } finally {
        setAutoCompleteLoading(false);
      }
    };

    return (
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>{t("address")}</Text>
          
          <TouchableOpacity
            style={[
              styles.locationButton,
              autoCompleteLoading && styles.disabledButton,
            ]}
            onPress={getCurrentLocation}
            disabled={autoCompleteLoading}
          >
            {autoCompleteLoading ? (
              <ActivityIndicator
                size="small"
                color={theme.colors.text.primary}
              />
            ) : (
              <>
                <Ionicons
                  name="navigate"
                  size={18}
                  color={theme.colors.text.primary}
                />
                <Text style={styles.locationButtonText}>{t("getCurrentLocation")}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.zipCodeContainer}>
            <Text style={styles.label}>{t("zipCode")}</Text>
            {isBrazil && (
              <TouchableOpacity
                style={[styles.zipCodeButton, zipCodeLoading && styles.disabledButton]}
                onPress={fetchAddressByZipCode}
                disabled={zipCodeLoading}
              >
                {zipCodeLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.text.primary} />
                ) : (
                  <Text style={styles.zipCodeButtonText}>{t("searchZipCode")}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          <CustomInput
            placeholder={t("zipCode")}
            value={address.zipCode}
            onChange={(value) => updateField("zipCode", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("street")}</Text>
          <CustomInput
            placeholder={t("street")}
            value={address.street}
            onChange={(value) => updateField("street", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("number")}</Text>
          <CustomInput
            placeholder={t("number")}
            value={address.number}
            onChange={(value) => updateField("number", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("complement")}</Text>
          <CustomInput
            placeholder={t("complement")}
            value={address.complement}
            onChange={(value) => updateField("complement", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("neighborhood")}</Text>
          <CustomInput
            placeholder={t("neighborhood")}
            value={address.neighborhood}
            onChange={(value) => updateField("neighborhood", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("city")}</Text>
          <CustomInput
            placeholder={t("city")}
            value={address.city}
            onChange={(value) => updateField("city", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("state")}</Text>
          <CustomInput
            placeholder={t("state")}
            value={address.state}
            onChange={(value) => updateField("state", value)}
          />
        </View>
      </View>
    );
  }
);

export default AddressForm;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  locationButtonText: {
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  coordinatesContainer: {
    backgroundColor: theme.colors.background,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  coordinatesText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  zipCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zipCodeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  zipCodeButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: "500",
  },
});
