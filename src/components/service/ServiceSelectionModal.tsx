import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { theme } from "../../styles/theme";
import { ServiceDto } from "../../types/service";

interface ServiceSelectionModalProps {
  visible: boolean;
  services: ServiceDto[];
  selectedServices: ServiceDto[];
  loading: boolean;
  onSelectService: (service: ServiceDto) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  visible,
  services,
  selectedServices,
  loading,
  onSelectService,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("selectServices")}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <>
              <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selectedServices.some(s => s.id === item.id);
                  return (
                    <TouchableOpacity 
                      style={[
                        styles.serviceItem,
                        isSelected && styles.serviceItemSelected
                      ]}
                      onPress={() => onSelectService(item)}
                    >
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{item.name}</Text>
                        <Text style={styles.serviceDetails}>
                          {item.price.toFixed(2)} {t("currency")} • {item.duration} min
                        </Text>
                      </View>
                      <Ionicons 
                        name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
                        size={24} 
                        color={isSelected ? theme.colors.primary : theme.colors.text.secondary} 
                      />
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={styles.serviceList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyListContainer}>
                    <Ionicons name="list" size={48} color={theme.colors.text.light} />
                    <Text style={styles.emptyListText}>{t("noServicesFound")}</Text>
                  </View>
                }
              />

              <TouchableOpacity 
                style={[
                  styles.confirmButton,
                  selectedServices.length === 0 && styles.disabledButton
                ]}
                onPress={onConfirm}
                disabled={selectedServices.length === 0}
              >
                <Text style={styles.confirmButtonText}>{t("continue")}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.md,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  serviceList: {
    paddingBottom: theme.spacing.lg,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
  },
  serviceItemSelected: {
    backgroundColor: `${theme.colors.primary}20`,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  serviceDetails: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  disabledButton: {
    backgroundColor: theme.colors.text.light,
  },
  confirmButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
  },
  emptyListContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyListText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
});

export default ServiceSelectionModal;