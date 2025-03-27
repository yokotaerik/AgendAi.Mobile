import { View, Text, StyleSheet } from "react-native";
import { ServiceDto } from "../../types/service";

type Props = {
  service: ServiceDto;
};

const ServiceCard = ({ service }: Props) => (
  <View style={styles.serviceCard}>
    <Text style={styles.serviceName}>{service.name}</Text>
    <Text style={styles.serviceDescription}>{service.description}</Text>
    <Text style={styles.servicePrice}>R$ {service.price}</Text>
    <Text style={styles.serviceDuration}>{service.duration}</Text>
  </View>
);

const styles = StyleSheet.create({
  serviceCard: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    height: 130
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ecc71",
    marginTop: 5,
  },
  serviceDuration: {
    fontSize: 14,
    color: "#666",
  },
});

export default ServiceCard;
