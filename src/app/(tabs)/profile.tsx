import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Login from "../auth/login";

const Profile = () => {
  const { t } = useTranslation();
  const { signed, signOut } = useAuth();
  console.log(signed);

  if (signed == false) {
    return <Login />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!signed ? (
        <TouchableOpacity>
          <Button title="Login" onPress={() => router.push("/auth/login")} />
        </TouchableOpacity>
      ) : null}
      <View>
        <Button title="Logout" onPress={signOut} />
      </View>

      {/* <Text style={styles.title}>Profile</Text>    */}

      <View>
        {/* // Querop fazer uma  lista de funcionalidades */}
        {/* <Button title={t("myChats")} onPress={() => router.push('/chat/me')} /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Profile;
