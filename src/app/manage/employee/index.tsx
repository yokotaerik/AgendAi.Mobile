import React, { useEffect } from "react";
import {
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../../styles/global";
import { useListEmployees } from "../../../hooks/employee/employeeHook";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import EmployeeCard from "../../../components/employee/EmployeeCard";

const ManageEmployees: React.FC = () => {
  const {
    employees,
    error: employeeError,
    fetchEmployees,
  } = useListEmployees();
  const { t } = useTranslation();
  const { companyId } = useAuth();

  useEffect(() => {
    if (companyId != null) {
      fetchEmployees(companyId);
    }
  }, [companyId]);

  return (
    <SafeAreaView style={globalStyles.section}>
      <Text style={globalStyles.title}>{t("employees")}</Text>
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => router.push("/manage/employee/create")}
      >
        <Text style={globalStyles.buttonText}>{t("addEmployee")}</Text>
      </TouchableOpacity>
      {employees && employees.length > 0 ? (
        <FlatList
          scrollEnabled={true}
          horizontal={false}
          data={employees}
          keyExtractor={(item) => item.id}
          contentContainerStyle={globalStyles.flatListContent}
          renderItem={({ item }) => (
            <EmployeeCard
              name={item.completeName}
              onEdit={() => router.push(`/manage/employee/edit/${item.id}`)}
              onSee={() => router.push(`/employee/${item.id}`)}
              onSchedule={() => router.push(`/manage/schedule/${item.id}`)}
              photoSrc={item.imageUrl}
            />
          )}
          ListEmptyComponent={() => (
            <Text style={globalStyles.emptyText}>{t("noEmployeeFound")}</Text>
          )}
        />
      ) : (
        <Text style={globalStyles.emptyText}>{t("noEmployeeFound")}</Text>
      )}
    </SafeAreaView>
  );
};

export default ManageEmployees;
