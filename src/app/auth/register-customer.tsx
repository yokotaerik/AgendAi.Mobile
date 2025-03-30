import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { isPasswordValid } from "../../utils/passwordHelper";

export default function RegisterCustomer() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signIn } = useAuth();

  const handleRegisterCustomer = async () => {
    if (password !== confirmPassword) {
      Alert.alert(t("passwordsDontMatch"));
      return;
    }

    // Check if emails has invbalid caracthesr
    // like ! # $ % & ' * + / = ? ^ ` { | } ~
    const invalidCharacters = /[!#$%&'*+/=?^`{|}~]/;
    if (invalidCharacters.test(email)) {
      Alert.alert(t("invalidEmail"));
      return;
    }

    if (
      name.trim() === "" ||
      surname.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      Alert.alert(t("emptyFields"));
      return;
    }

    if (email.indexOf("@") === -1) {
      Alert.alert(t("invalidEmail"));
      return;
    }

    if (isPasswordValid(password) === false) {
      Alert.alert(t("invalidPassword"));
      return;
    }

    const credentials = {
      email,
      password,
    };

    try {
      const response = await api.post("/customer", {
        name,
        surname,
        credentials,
      });

      if (response.status == 200) {
        signIn(credentials);
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao registrar cliente");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("register.title")}</Text>

        <TextInput
          style={styles.input}
          placeholder={t("register.name")}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder={t("register.surname")}
          value={surname}
          onChangeText={setSurname}
        />

        <TextInput
          style={styles.input}
          placeholder={t("register.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder={t("register.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder={t("register.confirmPassword")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegisterCustomer}
        >
          <Text style={styles.buttonText}>{t("register.submit")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>{t("register.backToLogin")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
