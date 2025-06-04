import React from "react";
import { Alert, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CurrencySelector from "../../components/ui/CurrencySelector";
import LanguageSelector from "../../components/ui/LanguageSelector";

const Logout = () => {
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    Alert.alert(
      t("logout.title"),
      t("logout.confirmMessage"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("logout.confirm"),
          onPress: () => {
            signOut();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("settings")}</Text>

      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("preferences")}</Text>
            <CurrencySelector />
            <LanguageSelector />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("account")}</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuItemContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
              </View>
              <Text style={styles.logoutText}>{t("logout.title")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  content: {
    padding: theme.spacing.md,
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
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
    backgroundColor: `${theme.colors.error}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  logoutText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    fontWeight: "500",
  },
});

export default Logout;
