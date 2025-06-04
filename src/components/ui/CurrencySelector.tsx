import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Currency, useCurrency } from '../../contexts/CurrencyContext';
import { useTranslation } from 'react-i18next';

interface CurrencyInfo {
  code: Currency;
  name: string;
  symbol: string;
}


interface CurrencySelectorProps {
  onOpenModal?: () => void;
  onCloseModal?: () => void;
  customCurrencies?: CurrencyInfo[];
  buttonStyle?: object;
  modalTitle?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  onOpenModal,
  onCloseModal,
  customCurrencies,
  buttonStyle,
  modalTitle,
}) => {
  const { t } = useTranslation();
  const { setCurrency, currency } = useCurrency();
  const [modalVisible, setModalVisible] = useState(false);

  const currencies = customCurrencies || [
    { code: "BRL" as Currency, name: "Real Brasileiro", symbol: "R$" },
    { code: "USD" as Currency, name: "Dólar Americano", symbol: "$" },
    { code: "EUR" as Currency, name: "Euro", symbol: "€" },
  ];

  const handleOpenModal = () => {
    setModalVisible(true);
    if (onOpenModal) onOpenModal();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (onCloseModal) onCloseModal();
  };
  
  const handleCurrencyChange = (selectedCurrency: Currency) => {
    setCurrency(selectedCurrency);
    handleCloseModal();
  };
  
  const getCurrencyName = () => {
    const selected = currencies.find(c => c.code === currency);
    return selected ? `${selected.symbol} ${selected.name}` : currency;
  };

  return (
    <>
      <TouchableOpacity style={[styles.menuItem, buttonStyle]} onPress={handleOpenModal}>
        <View style={styles.menuItemContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name="cash-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.menuItemText}>{t("currency")}</Text>
        </View>
        <View style={styles.currencySelector}>
          <Text style={styles.currencyText}>{getCurrencyName()}</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
        </View>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle || t("selectCurrency")}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={currencies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.currencyItem, currency === item.code && styles.selectedCurrency]}
                  onPress={() => handleCurrencyChange(item.code)}
                >
                  <View style={styles.currencyItemContent}>
                    <Text style={styles.currencySymbol}>{item.symbol}</Text>
                    <Text style={styles.currencyName}>{item.name}</Text>
                  </View>
                  {currency === item.code && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedCurrency: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  currencyItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
    width: 30,
    textAlign: "center",
  },
  currencyName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
});

export default CurrencySelector;