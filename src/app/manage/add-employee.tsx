import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import { useTranslation } from "react-i18next";
import { isPasswordValid } from "../../utils/passwordHelper";

interface CreateEmployeeDto {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export default function AddEmployee() {
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const [employee, setEmployee] = useState<CreateEmployeeDto>({
    name: "",
    surname: "",
    email: "",
    password: ""
  });

  const handleAddEmployee = async () => {
    try {
      if (Object.values(employee).some((field) => field.trim() === "")) {
        Alert.alert(t("emptyFields"));
        return;
      }

      if(employee.email.indexOf("@") === -1) {
        Alert.alert(t("invalidEmail")); 
        return;
      }

      if(isPasswordValid(employee.password) === false) {  
        Alert.alert(t("invalidPassword"));
        return;
      }

      const response = await api.post("/employee", employee);
      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.error(t("addEmployee.error"), error);
      Alert.alert(t("common.error"), t("addEmployee.errorMessage"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("addEmployee.title")}</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t("addEmployee.namePlaceholder")}
          value={employee.name}
          onChangeText={(text) => setEmployee({ ...employee, name: text })}
        />

        <TextInput
          style={styles.input}
          placeholder={t("addEmployee.surnamePlaceholder")}
          value={employee.surname}
          onChangeText={(text) => setEmployee({ ...employee, surname: text })}
        />

        <TextInput
          style={styles.input}
          placeholder={t("addEmployee.emailPlaceholder")}
          value={employee.email}
          onChangeText={(text) => setEmployee({ ...employee, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder={t("addEmployee.passwordPlaceholder")}
          value={employee.password}
          onChangeText={(text) => setEmployee({ ...employee, password: text })}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleAddEmployee}>
          <Text style={styles.buttonText}>{t("addEmployee.registerButton")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  form: {
    gap: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
