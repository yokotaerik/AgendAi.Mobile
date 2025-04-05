import { Redirect } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AttendanceScreen from "../attendance/[id]";

const Attendances = () => {
  const { customerId } = useAuth();

  if (!customerId) {
    return <Redirect href="/auth/login" />;
  } else {
    return <AttendanceScreen id={"customer"} />;
  }
};

export default Attendances;
