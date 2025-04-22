import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { CompanyDto } from "../../types/company";
import { theme } from "../../styles/theme";
import { baseURL } from "../../api";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";
import getDistanceInMeters from "../../utils/distanceHelper";

interface CompanyCardProps {
  company: CompanyDto;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { t } = useTranslation();
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateDistance();
  }, [company]);

  const calculateDistance = async () => {
    // Skip if company doesn't have coordinates
    if (!company.address?.latitude || !company.address?.longitude) {
      return;
    }

    try {
      setLoading(true);

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      // Use expo-location to calculate distance
      const distanceInMeters = getDistanceInMeters(
        location.coords.latitude,
        location.coords.longitude,
        company.address.latitude,
        company.address.longitude
      );

      console.log("My Location",location.coords.latitude, location.coords.longitude);
      console.log("Company Location",company.address.latitude, company.address.longitude);

      // Convert to kilometers and round to 1 decimal place
      const distanceInKm = Math.round((distanceInMeters / 1000) * 10) / 10;
      setDistance(distanceInKm);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance}km`;
  };

  return (
    <View style={styles.container}>
      {company.imageUrl && (
        <Image
          source={{ uri: baseURL + company.imageUrl }}
          style={styles.image}
        />
      )}

      <View style={styles.info}>
        <Text style={styles.fantasyName}>{company.fantasyName}</Text>

        <Text style={styles.corporateName}>{company.corporateName}</Text>

        {company.address && (
          <Text style={styles.address}>
            {company.address.street}, {company.address.number}
            {company.address.city} - {company.address.state}
          </Text>
        )}

        {/* Distance information */}
        {company.address?.latitude && company.address?.longitude && (
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceLabel}>{t("distance")}: </Text>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : distance ? (
              <Text style={styles.distanceValue}>
                {formatDistance(distance)}
              </Text>
            ) : (
              <Text style={styles.distanceValue}>-</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.tertiary,
  },
  info: {
    flex: 1,
  },
  fantasyName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  corporateName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  address: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.light,
    marginBottom: theme.spacing.xs,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.xs,
  },
  distanceLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  distanceValue: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
