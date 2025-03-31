import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import {
  useEditEmployee,
  useGetEmployee,
} from "../../../hooks/employee/employeeHook";
import { EmployeeDto } from "../../../types/employee";
import { useListServices } from "../../../hooks/service/serviceHooks";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../../../api";
import { Feather } from "@expo/vector-icons";

const EditEmployee: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { companyId } = useAuth();
  const { services, fetchServices } = useListServices();
  const { editEmployee, error, loading } = useEditEmployee();
  const [employeeEditData, setEmployee] = useState<EmployeeDto>();
  const [servicesIds, setServicesIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          if (
            employeeEditData?.name === "" ||
            employeeEditData?.surname === "" ||
            employeeEditData?.email === ""
          ) {
            Alert.alert(t("emptyFields"));
            return;
          }

          if (employeeEditData?.email?.indexOf("@") === -1) {
            Alert.alert(t("invalidEmail"));
            return;
          }

          const response = (await api.get(`/employee/${id}`)) as any;
          if (response.status == 200) {
            setEmployee(response.data as EmployeeDto);
            setServicesIds(
              response.data.services.map((service: any) => service.id)
            );
          }
        } catch (err) {
          Alert.alert("Erro ao buscar funcionário");
        }
        if (companyId) fetchServices(companyId);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteEmployee = async () => {
    try {
      const response = await api.delete(`/employee/${id}`);
      if (response.status == 200) {
        router.back();
      }
    } catch (err) {
      Alert.alert(t("errorDelete"));
    }
  };

  const handleEditEmployee = async () => {
    if (!employeeEditData?.name?.trim() || !employeeEditData?.surname?.trim()) {
      Alert.alert(t("editEmployee.missingFields"));
      return;
    }

    const response = (await editEmployee({
      id: employeeEditData?.id,
      name: employeeEditData?.name,
      surname: employeeEditData?.surname,
      email: employeeEditData?.email,
      servicesIds,
    })) as any;

    if (response.status == 200) {
      router.back();
    } else {
      Alert.alert("Erro ao editar funcionário");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("editEmployee.title")}</Text>
      {employeeEditData?.owner == false && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteEmployee()}
        >
          <Feather name="trash-2" size={24} color="white" />
        </TouchableOpacity>
      )}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t("editEmployee.namePlaceholder")}
          value={employeeEditData?.name}
          onChangeText={(text) =>
            setEmployee({ ...employeeEditData!, name: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder={t("editEmployee.surnamePlaceholder")}
          value={employeeEditData?.surname || ""}
          onChangeText={(text) =>
            setEmployee({ ...employeeEditData!, surname: text })
          }
        />

        {/* <TextInput
          style={styles.input}
          placeholder={t("editEmployee.emailPlaceholder")}
          value={employeeEditData?.email || ""}
          onChangeText={(text) =>
            setEmployee({ ...employeeEditData!, email: text })
          }
          keyboardType="email-address"
          autoCapitalize="none"
        /> */}

        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>{t("editEmployee.service")}</Text>

          <Text style={styles.subTitle}>{t("offeredServices")}</Text>
          {services
            ?.filter((service) => servicesIds.includes(service.id))
            .map((service) => (
              <View key={`offered-${service.id}`} style={styles.serviceItem}>
                <Text style={styles.serviceText}>{service.name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setServicesIds(
                      servicesIds.filter((id) => id !== service.id)
                    );
                  }}
                >
                  <Text style={styles.removeButton}>X</Text>
                </TouchableOpacity>
              </View>
            ))}

          <Text style={styles.subTitle}>{t("availableServices")}</Text>
          {services != null
            ? services
                .filter((service) => !servicesIds.includes(service.id))
                .map((service) => (
                  <View
                    key={`available-${service.id}`}
                    style={styles.serviceItem}
                  >
                    <Text style={styles.serviceText}>{service.name}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setServicesIds([...servicesIds, service.id]);
                      }}
                    >
                      <Text style={styles.addButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                ))
            : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleEditEmployee}>
          <Text style={styles.buttonText}>{t("editEmployee.saveButton")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditEmployee;

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
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  servicesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  serviceText: {
    fontSize: 16,
  },
  addButton: {
    fontSize: 16,
    color: "#007AFF",
  },
  removeButton: {
    fontSize: 16,
    color: "#FF0000",
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
