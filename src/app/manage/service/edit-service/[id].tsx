import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import api from "../../../api";
import { useGetService } from "../../../hooks/service/serviceHooks";
import useTimeSpan from "../../../hooks/utils/useTimeSpan";
import { UpdateServiceDto } from "../../../types/service";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function EditService() {
  const { t } = useTranslation();
  const { convertToMinutesInString, convertToTimeSpan } = useTimeSpan();
  const { id } = useLocalSearchParams();
  const { service, loading, error, refetch } = useGetService(id as string);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState<UpdateServiceDto>({
    id: "",
    name: "",
    description: "",
    price: 0,
    duration: "",
  });
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      refetch();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (service) {
      setFormData({
        id: id as string,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
      });
      setPrice(service.price.toString());
      setDuration(convertToMinutesInString(service.duration) ?? "");
    }
  }, [service]);

  const handleChangeDuration = (minutes: string) => {
    setDuration(minutes);
    const parsedMinutes = parseInt(minutes);
    if (!isNaN(parsedMinutes)) {
      var duration = convertToTimeSpan(parsedMinutes);
      setFormData({
        ...formData,
        duration: duration,
      });
    }
  };

  const handleDeleteService = async () => {
    try {
      const response = await api.delete(`/service/${id}`);
      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.error(t("editService.deleteError"), error);
    }
  };

  const handleUpdateService = async () => {
    try {
      if (
        formData.name?.trim() === "" ||
        formData.description?.trim() === "" ||
        formData.price === 0 ||
        formData.duration?.trim() === ""
      ) {
        Alert.alert(t("emptyFields"));
        return;
      }

      const response = await api.put("service", formData);
      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.error(t("editService.error"), error);
    }
  };

  if (loading) {
    return (
      <ScrollView
        style={styles.loadingContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text>{t("loading")}</Text>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView
        style={styles.loadingContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text>{t("error.loadService")}</Text>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteService()}
      >
        <Feather name="trash-2" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>{t("editService.title")}</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t("editService.namePlaceholder")}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <TextInput
          style={styles.input}
          placeholder={t("editService.descriptionPlaceholder")}
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder={t("editService.pricePlaceholder")}
          value={price}
          onChangeText={(value) => {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue) || value === "") {
              setPrice(value);
              setFormData({ ...formData, price: parsedValue });
            }
          }}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder={t("editService.durationPlaceholder")}
          value={duration}
          onChangeText={(value) => {
            if (!isNaN(parseInt(value)) || value === "")
              handleChangeDuration(value);
          }}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdateService}>
          <Text style={styles.buttonText}>{t("editService.updateButton")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  },
  container: {
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
  deleteButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
