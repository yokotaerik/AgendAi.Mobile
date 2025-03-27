import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import { useTranslation } from "react-i18next";
import useTimeSpan from "../../hooks/utils/useTimeSpan";
import { UpdateServiceDto } from "../../types/service";

export default function AddService() {
  const { t } = useTranslation();
  const { convertToMinutesInString, convertToTimeSpan } = useTimeSpan();
  const { companyId } = useAuth();
  const [service, setService] = useState<UpdateServiceDto>({
    name: "",
    description: "",
    price: 0,
    duration: "",
  });

  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const handleChangeDuration = (minutes: string) => {
    setDuration(minutes);
    const parsedMinutes = parseInt(minutes);
    if (!isNaN(parsedMinutes)) {
      var duration = convertToTimeSpan(parsedMinutes);
      setService({
        ...service,
        duration: duration,
      });
    }
  };

  const handleAddService = async () => {
    try {
      if (
        !service.name?.trim() ||
        !service.description?.trim() ||
        !service.price ||
        !service.duration
      ) {
        Alert.alert(t("emptyFields"));
        return;
      }

      const response = await api.post("/service", service);
      if (response.status === 201) {
        router.back();
      }
    } catch (error) {
      console.error(t("addService.error"), error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("addService.title")}</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t("addService.namePlaceholder")}
          value={service.name}
          onChangeText={(text) => setService({ ...service, name: text })}
        />

        <TextInput
          style={styles.input}
          placeholder={t("addService.descriptionPlaceholder")}
          value={service.description}
          onChangeText={(text) => setService({ ...service, description: text })}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder={t("addService.pricePlaceholder")}
          value={price}
          onChangeText={(value) => {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue) || value === "") {
              setPrice(value);
              setService({ ...service, price: parsedValue });
            }
          }}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder={t("addService.durationPlaceholder")}
          value={duration}
          onChangeText={(value) => {
            if (!isNaN(parseInt(value)) || value === "")
              handleChangeDuration(value);
          }}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddService}>
          <Text style={styles.buttonText}>{t("addService.addButton")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
