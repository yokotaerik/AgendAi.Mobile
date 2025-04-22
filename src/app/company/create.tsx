import React, { useRef, useState } from "react";
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
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import AddressForm ,{ AddressFormRef, AddressFormData } from "../../components/address/AddressForm";

export default function CreateCompany() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [corporateName, setCorporateName] = useState("");
  const [fantasyName, setFantasyName] = useState("");

  // Address as a single object
  const addressFormRef = useRef<AddressFormRef>(null);
  const [address, setAddress] = useState<AddressFormData>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Owner
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (isPasswordValid(password) === false) {
      Alert.alert(t("invalidPassword"));
      return;
    }

    const invalidCharacters = /[!#$%&'*+/=?^`{|}~]/;
    if (invalidCharacters.test(email)) {
      Alert.alert(t("invalidEmail"));
      return;
    }

    if (email.indexOf("@") === -1) {
      Alert.alert(t("invalidEmail"));
      return;
    }
    // Check if fields are not empty
    if (
      !corporateName.trim() ||
      !fantasyName.trim() ||
      !address.street.trim() ||
      !address.number.trim() ||
      !address.neighborhood.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.zipCode.trim() ||
      !name.trim() ||
      !surname.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert(t("emptyFields"));
      return;
    }

    try {
      setLoading(true);
      
      const addressDto: AddressDto = {
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        latitude: address.latitude,
        longitude: address.longitude,
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
        address: addressDto,
        owner,
      };


      if (addressFormRef.current) {
        const addressWithCoordinates = await addressFormRef.current.getCoordinatesAsync();
        
        // Now you can save the address with coordinates
        console.log('Address with coordinates:', addressWithCoordinates);
        
        data.address.latitude = addressWithCoordinates.latitude;
        data.address.longitude = addressWithCoordinates.longitude;

        const response = await api.post("/company", data);
  
        if (response.status === 200) {
          signIn({ email, password });
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t("errorRegisteringCompany"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t("registerCompany")}</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="business-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>{t("companyData")}</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("corporateName")}</Text>
              <CustomInput
                placeholder={t("corporateName")}
                value={corporateName}
                onChange={setCorporateName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("fantasyName")}</Text>
              <CustomInput
                placeholder={t("fantasyName")}
                value={fantasyName}
                onChange={setFantasyName}
              />
            </View>
          </View>

          <View style={styles.card}>
            <AddressForm 
              address={address}
              onChange={setAddress}
              ref={addressFormRef}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>{t("ownerData")}</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("name")}</Text>
              <CustomInput 
                placeholder={t("name")} 
                value={name} 
                onChange={setName} 
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("surname")}</Text>
              <CustomInput
                placeholder={t("surname")}
                value={surname}
                onChange={setSurname}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("email")}</Text>
              <CustomInput
                placeholder={t("email")}
                value={email}
                onChange={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("password")}</Text>
              <CustomInput
                placeholder={t("password")}
                value={password}
                onChange={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t("registering") : t("register.title")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  content: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  button: {
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "bold",
  },
});
