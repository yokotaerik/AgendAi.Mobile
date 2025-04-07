import { Redirect } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AttendanceScreen from "../attendance/[id]";
import { theme } from "../../styles/theme";

const Attendances = () => {
  const { customerId } = useAuth();

  if (!customerId) {
    return <Redirect href="/auth/login" />;
  } else {
    return <AttendanceScreen id={"customer"} />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default Attendances;
