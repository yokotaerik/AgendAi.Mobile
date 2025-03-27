import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { AddressDto } from "../../types/common";
import { RegisterEmployeeDto } from "../../types/employee";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { isPasswordValid } from "../../utils/passwordHelper";

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
    if(isPasswordValid(password) === false) {
      alert(t("invalidPassword"));
      return;
    }

    if(email.indexOf("@") === -1) {
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
        <TextInput
          style={styles.input}
          placeholder="Razão Social"
          value={corporateName}
          onChangeText={setCorporateName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome Fantasia"
          value={fantasyName}
          onChangeText={setFantasyName}
        />

        <Text style={styles.sectionTitle}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Rua"
          value={street}
          onChangeText={setStreet}
        />
        <TextInput
          style={styles.input}
          placeholder="Número"
          value={number}
          onChangeText={setNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Complemento"
          value={complement}
          onChangeText={setComplement}
        />
        <TextInput
          style={styles.input}
          placeholder="Bairro"
          value={neighborhood}
          onChangeText={setNeighborhood}
        />
        <TextInput
          style={styles.input}
          placeholder="Cidade"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={state}
          onChangeText={setState}
        />
        <TextInput
          style={styles.input}
          placeholder="CEP"
          value={zipCode}
          onChangeText={setZipCode}
        />

        <Text style={styles.sectionTitle}>Dados do Proprietário</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
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
