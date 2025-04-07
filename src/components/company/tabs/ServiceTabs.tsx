import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ServiceDto } from "../../../types/service";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import { router } from "expo-router";
import { theme } from "../../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

interface ServiceTabsProps {
  services: ServiceDto[];
  onServiceSelect: (selectedServices: ServiceDto[]) => void;
  giveSelectedServices?: (services: ServiceDto[]) => void;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({
  services,
  onServiceSelect,
  giveSelectedServices,
}) => {
  const { t } = useTranslation();
  const { customerId } = useAuth();
  const [selectedServices, setSelectedServices] = useState<ServiceDto[]>([]);

  useEffect(() => {
    if (giveSelectedServices) {
      setSelectedServices(selectedServices);
    }
  }, [giveSelectedServices]);

  const toggleServiceSelection = (service: ServiceDto) => {
    const isSelected = selectedServices.some((item) => item.id === service.id);
    let updatedSelection;

    if (isSelected) {
      updatedSelection = selectedServices.filter(
        (item) => item.id !== service.id
      );
    } else {
      updatedSelection = [...selectedServices, service];
    }

    setSelectedServices(updatedSelection);
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((service) => service.id === serviceId);
  };

  const handleBookNow = () => {
    if (!customerId) {
      router.push("/auth/login");
      return;
    }
    onServiceSelect(selectedServices);
  };

  const renderServiceItem = ({ item }: { item: ServiceDto }) => (
    <TouchableOpacity
      style={[
        styles.serviceItem,
        isServiceSelected(item.id) && styles.selectedServiceItem,
      ]}
    >
      <View>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
      </View>
      <View style={styles.serviceDetails}>
        <View>
          <Text style={styles.servicePrice}>{item.price.toFixed(2)}</Text>
          <Text style={styles.serviceDuration}>{item.duration}</Text>
        </View>
        <View>
          {isServiceSelected(item.id) ? (
            <TouchableOpacity
              onPress={() => toggleServiceSelection(item)}
              style={styles.selectedButton}
            >
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.text.primary} />
              <Text style={styles.buttonText}>
                {t("selected")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => toggleServiceSelection(item)}
              style={styles.selectButton}
            >
              <Ionicons name="add-circle-outline" size={16} color={theme.colors.text.primary} />
              <Text style={styles.buttonText}>
                {t("select")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      {selectedServices.length > 0 && (
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Ionicons name="calendar" size={20} color={theme.colors.text.primary} />
          <Text style={styles.bookButtonText}>
            {t("bookNow")} ({selectedServices.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.sm,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  selectedServiceItem: {
    backgroundColor: `${theme.colors.primary}20`,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  serviceName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  serviceDescription: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    maxWidth: 200,
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  servicePrice: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "500",
    color: theme.colors.primary,
    textAlign: "right",
  },
  serviceDuration: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.light,
    textAlign: "right",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  selectedButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.sm,
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontWeight: "600",
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.xs,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "bold",
    marginLeft: theme.spacing.xs,
  },
});

export default ServiceTabs;
