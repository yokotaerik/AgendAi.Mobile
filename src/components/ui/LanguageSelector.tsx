import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import i18n, { changeLanguage } from '../../locales/i18n';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    changeLanguage(lang);
    handleCloseModal();
  };

  const getLanguageName = () => {
    const selected = LANGUAGES.find(l => l.code === selectedLang);
    return selected ? `${selected.flag} ${selected.name}` : selectedLang;
  };

  return (
    <>
      <TouchableOpacity style={styles.menuItem} onPress={handleOpenModal}>
        <View style={styles.menuItemContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}> 
            <Ionicons name="language-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.menuItemText}>{t('language')}</Text>
        </View>
        <View style={styles.languageSelector}>
          <Text style={styles.languageText}>{getLanguageName()}</Text>
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
              <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={LANGUAGES}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.languageItem, selectedLang === item.code && styles.selectedLanguage]}
                  onPress={() => handleLanguageChange(item.code)}
                >
                  <View style={styles.languageItemContent}>
                    <Text style={styles.languageFlag}>{item.flag}</Text>
                    <Text style={styles.languageName}>{item.name}</Text>
                  </View>
                  {selectedLang === item.code && (
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedLanguage: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  languageItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: theme.typography.fontSize.lg,
    marginRight: theme.spacing.sm,
    width: 30,
    textAlign: 'center',
  },
  languageName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
});

export default LanguageSelector;
