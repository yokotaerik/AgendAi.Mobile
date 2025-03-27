import { Slot, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import React, { useEffect } from "react";
import { UserType } from "../types/common";

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
    </Stack>
  );
}

function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootLayout />
    </AuthProvider>
  );
}
