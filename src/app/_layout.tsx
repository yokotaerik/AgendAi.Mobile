import { Slot, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import React, { useEffect } from "react";
import { UserType } from "../types/common";
import Toast from "react-native-toast-message";

function RootLayoutNav() {
  const { signed, user } = useAuth();

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
    <AuthProvider>
      <Toast />
      <RootLayoutNav />
    </AuthProvider>
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
