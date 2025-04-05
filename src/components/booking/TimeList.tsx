import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { AvailableTime } from "../../types/schedule";

interface TimeListProps {
  availableTimes: AvailableTime[];
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimeList: React.FC<TimeListProps> = ({
  availableTimes,
  selectedTime,
  onTimeSelect,
}) => {
  const { t } = useTranslation();

  const renderTimeItem = ({ item }: { item: AvailableTime }) => (
    <TouchableOpacity
      style={[
        styles.timeButton,
        !item.available && styles.unavailableTime,
        selectedTime === item.time && styles.selectedTime,
      ]}
      onPress={() => item.available && onTimeSelect(item.time)}
      disabled={!item.available}
    >
      <Text
        style={[
          styles.timeText,
          !item.available && styles.unavailableTimeText,
          selectedTime === item.time && styles.selectedTimeText,
        ]}
      >
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("selectTime")}</Text>
      <FlatList
        data={availableTimes}
        renderItem={renderTimeItem}
        keyExtractor={(item) => item.time}
        numColumns={1}
        horizontal={true}
        contentContainerStyle={styles.timeList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  timeList: {
    padding: 8,
  },
  timeButton: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
  },
  unavailableTime: {
    backgroundColor: "#eee",
  },
  unavailableTimeText: {
    color: "#999",
  },
  selectedTime: {
    backgroundColor: "#007AFF",
  },
  selectedTimeText: {
    color: "#fff",
  },
});

export default TimeList;
