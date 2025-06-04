import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Login from "../auth/login";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import CurrencySelector from "../../components/ui/CurrencySelector";
import LanguageSelector from "../../components/ui/LanguageSelector";

const Profile = () => {
  const { t } = useTranslation();
  const { signed, signOut, user } = useAuth();

  if (signed == false) {
    return <Login />;
  }

  const handleLogout = () => {
    signOut();
  };

  const navigateToMyChats = () => {
    router.push('/chat/me');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("profile")}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || t("user")}</Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("actions")}</Text>
          
          {/* <TouchableOpacity style={styles.menuItem} onPress={navigateToMyChats}>
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="chatbubbles-outline" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.menuItemText}>{t("myChats")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
          </TouchableOpacity> */}
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/attendances')}>
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.menuItemText}>{t("myAppointments")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("preferences")}</Text>
          <CurrencySelector />
          <LanguageSelector />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("account")}</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.error}20` }]}>
                <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
              </View>
              <Text style={styles.logoutText}>{t("logout")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
          </TouchableOpacity>
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
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  userName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  logoutText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    fontWeight: "500",
  },

});

export default Profile;
