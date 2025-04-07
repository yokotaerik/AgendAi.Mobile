import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "../../styles/theme";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const { t } = useTranslation();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleStartDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || new Date(startDate);
    setShowStartDatePicker(Platform.OS === "ios");
    onStartDateChange(currentDate.toISOString());
  };

  const handleEndDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || new Date(endDate);
    setShowEndDatePicker(Platform.OS === "ios");
    onEndDateChange(currentDate.toISOString());
  };

  return (
    <View style={styles.dateContainer}>
      <View style={styles.datePickerWrapper}>
        <Text style={styles.dateLabel}>{t("startDate")}:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.text.secondary}
            style={styles.dateIcon}
          />
          <Text style={styles.dateText}>{formatDate(startDate)}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(startDate)}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
      </View>

      <View style={styles.datePickerWrapper}>
        <Text style={styles.dateLabel}>{t("endDate")}:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.text.secondary}
            style={styles.dateIcon}
          />
          <Text style={styles.dateText}>{formatDate(endDate)}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(endDate)}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  datePickerWrapper: {
    flex: 1,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    minWidth: 120,
    justifyContent: "center",
  },
  dateIcon: {
    marginRight: theme.spacing.xs,
  },
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
});

export default DateRangePicker;