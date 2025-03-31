import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { AddressDto } from "../../types/common";
import { RegisterEmployeeDto } from "../../types/employee";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { isPasswordValid } from "../../utils/passwordHelper";
import CustomInput from "../../components/ui/input/CustomInput";

export default function CreateCompany() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [corporateName, setCorporateName] = useState("");
  const [fantasyName, setFantasyName] = useState("");

  // Endereço
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Proprietário
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (isPasswordValid(password) === false) {
      alert(t("invalidPassword"));
      return;
    }

    const invalidCharacters = /[!#$%&'*+/=?^`{|}~]/;
    if (invalidCharacters.test(email)) {
      Alert.alert(t("invalidEmail"));
      return;
    }

    if (email.indexOf("@") === -1) {
      alert(t("invalidEmail"));
      return;
    }

    // Verifique if fields is not " ", "   ""
    if (
      !corporateName.trim() ||
      !fantasyName.trim() ||
      !street.trim() ||
      !number.trim() ||
      !neighborhood.trim() ||
      !city.trim() ||
      !state.trim() ||
      !zipCode.trim() ||
      !name.trim() ||
      !surname.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      alert(t("emptyFields"));
      return;
    }

    try {
      const address: AddressDto = {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
      };

      const owner: RegisterEmployeeDto = {
        name,
        surname,
        email,
        password,
      };

      const data = {
        corporateName,
        fantasyName,
        address,
        owner,
      };

      const response = await api.post("/company", data);

      if (response.status === 200) {
        signIn({ email, password });
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar empresa");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastro de Empresa</Text>

        <Text style={styles.sectionTitle}>Dados da Empresa</Text>
        <CustomInput
          placeholder="Razão Social"
          value={corporateName}
          onChange={setCorporateName}
        />
        <CustomInput
          placeholder="Nome Fantasia"
          value={fantasyName}
          onChange={setFantasyName}
        />

        <Text style={styles.sectionTitle}>Endereço</Text>
        <CustomInput placeholder="Rua" value={street} onChange={setStreet} />
        <CustomInput placeholder="Número" value={number} onChange={setNumber} />
        <CustomInput
          placeholder="Complemento"
          value={complement}
          onChange={setComplement}
        />
        <CustomInput
          placeholder="Bairro"
          value={neighborhood}
          onChange={setNeighborhood}
        />
        <CustomInput placeholder="Cidade" value={city} onChange={setCity} />
        <CustomInput placeholder="Estado" value={state} onChange={setState} />
        <CustomInput placeholder="CEP" value={zipCode} onChange={setZipCode} />

        <Text style={styles.sectionTitle}>Dados do Proprietário</Text>
        <CustomInput placeholder="Nome" value={name} onChange={setName} />
        <CustomInput
          placeholder="Sobrenome"
          value={surname}
          onChange={setSurname}
        />
        <CustomInput
          placeholder="Email"
          value={email}
          onChange={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          placeholder="Senha"
          value={password}
          onChange={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
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
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
