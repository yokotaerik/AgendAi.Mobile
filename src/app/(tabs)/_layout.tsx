import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { theme } from "../../styles/theme";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: `${theme.colors.text.light}20`,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.light,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendances"
        options={{
          title: t("appointments"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
