import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ServiceDto } from "../../../types/service";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

interface ServiceTabsProps {
  services: ServiceDto[];
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ services }) => {
  const { t } = useTranslation();


  const renderServiceItem = ({ item }: { item: ServiceDto }) => (
    <View style={styles.serviceItem}>
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
          <TouchableOpacity
            onPress={() => {router.push(`/booking`)}}
            style={{ padding: 8, backgroundColor: "#1976d2", borderRadius: 5 }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {t("bookNow")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
      />
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
});

export default ServiceTabs;
