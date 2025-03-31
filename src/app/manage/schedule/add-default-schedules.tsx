import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import {
  DayOfWeek,
  RegisterDefaultSchedulesDto,
} from "../../../types/schedule";

export default function AddDefaultSchedule() {
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const [schedules, setSchedules] = useState<RegisterDefaultSchedulesDto>();
  return (
    <SafeAreaView>
      <Text> Nome do funcionário : Erik</Text>

      <View>
        <Text style={styles.title}>{t("addDefaultSchedule.title")}</Text>
        <View style={styles.form}>
          {schedules.defaultPeriods[day].map((period, index) => (
            <View key={index} style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                placeholder={t("addDefaultSchedule.startTime")}
                style={styles.input}
                value={period.start.toString()}
                onChangeText={(text) => {
                  const newSchedules = { ...schedules };
                  newSchedules.defaultPeriods[day][index].start = new Date(
                    text
                  );
                  setSchedules(newSchedules);
                }}
              />
              <TextInput
                placeholder={t("addDefaultSchedule.endTime")}
                style={styles.input}
                value={period.end.toString()}
                onChangeText={(text) => {
                  const newSchedules = { ...schedules };
                  newSchedules.defaultPeriods[day][index].end = new Date(text);
                  setSchedules(newSchedules);
                }}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>
              {t("addDefaultSchedule.save")}
            </Text>
          </TouchableOpacity>
        </View>
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
