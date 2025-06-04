import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const ManageScreen: React.FC = () => {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('dashboard'),
      icon: 'analytics-outline',
      route: '/manage/dashboard',
      color: theme.colors.primary,
    },
    {
      title: t('employees'),
      icon: 'people-outline',
      route: '/manage/employee',
      color: theme.colors.primary,
    },
    {
      title: t('services'),
      icon: 'cut-outline',
      route: '/manage/service',
      color: theme.colors.primary,
    },
    {
      title: t('schedules'),
      icon: 'calendar-outline',
      route: '/manage/schedule',
      color: theme.colors.primary,
    },
    {
      title: t('campaigns'),
      icon: 'pricetag-outline',
      route: '/manage/campaign',
      color: theme.colors.primary,
    },
    {
      title: t('company'),
      icon: 'business-outline',
      route: '/manage/company/edit',
      color: theme.colors.primary,
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('manage')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color="white" />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 24,
  },
  content: {
    padding: theme.spacing.md,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  menuItem: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});

export default ManageScreen;