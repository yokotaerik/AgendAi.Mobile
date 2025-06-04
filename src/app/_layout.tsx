import { Slot, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { UserType } from "../types/common";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import { CurrencyProvider } from "../contexts/CurrencyContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function RootLayoutNav() {
  const { signed, user } = useAuth();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification: any) => {}
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (signed && user) {
      if (user.role === UserType.Employee) {
        router.replace("/(ownerTabs)/manage");
      } else {
        router.replace("/(tabs)/home");
      }
    } else {
      router.replace("/(tabs)/home");
    }
  }, [signed, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Slot />
      <Toast />
    </Stack>
  );
}

function RootLayout() {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <Toast />
        <RootLayoutNav />
      </AuthProvider>
    </CurrencyProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toast />
      <StatusBar style="auto" />
      <RootLayout />
    </AuthProvider>
  );
}
