import React, { useState } from "react";
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

interface ServiceTabsProps {
  services: ServiceDto[];
  onServiceSelect: (selectedServices: ServiceDto[]) => void;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ services, onServiceSelect }) => {
  const { t } = useTranslation();
  const { customerId } = useAuth();
  const [selectedServices, setSelectedServices] = useState<ServiceDto[]>([]);

  const toggleServiceSelection = (service: ServiceDto) => {
    const isSelected = selectedServices.some(item => item.id === service.id);
    let updatedSelection;
    
    if (isSelected) {
      updatedSelection = selectedServices.filter(item => item.id !== service.id);
    } else {
      updatedSelection = [...selectedServices, service];
    }
    
    setSelectedServices(updatedSelection);
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(service => service.id === serviceId);
  };

  const handleBookNow = () => {
    if(!customerId) {
      router.push("/auth/login");
      return;
    }
    onServiceSelect(selectedServices);
  };

  const renderServiceItem = ({ item }: { item: ServiceDto }) => (
    <TouchableOpacity
      style={[
        styles.serviceItem,
        isServiceSelected(item.id) && styles.selectedServiceItem
      ]}
      onPress={() => toggleServiceSelection(item)}
    >
      <View>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <View>
          <Text style={styles.servicePrice}>{item.price.toFixed(2)}</Text>
          <Text style={styles.serviceDuration}>{item.duration}</Text>
        </View>
        <View>
          {isServiceSelected(item.id) ? (
            <View style={{ padding: 8, backgroundColor: "#4caf50", borderRadius: 5 }}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {t("selected")}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleServiceSelection(item);
              }}
              style={{ padding: 8, backgroundColor: "#1976d2", borderRadius: 5 }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {t("select")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
      />
      {selectedServices.length > 0 && (
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookNow}
        >
          <Text style={styles.bookButtonText}>
            {t("bookNow")} ({selectedServices.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  serviceItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 5,
  },
  selectedServiceItem: {
    backgroundColor: "#e3f2fd",
    borderColor: "#1976d2",
    borderWidth: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 11,
    color: "#666",
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1976d2",
  },
  serviceDuration: {
    fontSize: 12,
    color: "#666",
  },
  bookButton: {
    backgroundColor: "#1976d2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceTabs;
