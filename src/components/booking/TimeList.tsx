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
import { theme } from "../../styles/theme";

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
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  timeList: {
    padding: theme.spacing.sm,
  },
  timeButton: {
    flex: 1,
    padding: theme.spacing.md,
    margin: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    minWidth: 80,
  },
  timeText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  unavailableTime: {
    backgroundColor: `${theme.colors.surface}80`,
  },
  unavailableTimeText: {
    color: theme.colors.text.light,
  },
  selectedTime: {
    backgroundColor: theme.colors.primary,
  },
  selectedTimeText: {
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
});

export default TimeList;
