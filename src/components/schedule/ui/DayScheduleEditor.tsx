import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { TimeRangePicker } from "./TimeRangePicker";
import { AvaiblePeriodDto } from "../../../types/schedule";
import { theme } from "../../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

interface DayScheduleEditorProps {
  dayName: string;
  periods: AvaiblePeriodDto[];
  onPeriodsChange: (periods: AvaiblePeriodDto[]) => void;
  day: string;
}

export const DayScheduleEditor: React.FC<DayScheduleEditorProps> = ({
  dayName,
  periods,
  onPeriodsChange,
  day,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [day]);

  const handleAddPeriod = () => {
    const newPeriod: AvaiblePeriodDto = {
      start: new Date(),
      end: new Date(),
    };
    onPeriodsChange([...periods, newPeriod]);
  };

  const handlePeriodChange = (index: number, period: AvaiblePeriodDto) => {
    const newPeriods = [...periods];
    newPeriods[index] = period;
    onPeriodsChange(newPeriods);
  };

  const handleRemovePeriod = (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index);
    onPeriodsChange(newPeriods);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.dayName}>{dayName}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.periodCount}>
            {periods.length} {t("period", { count: periods.length })}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.colors.text.primary}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView style={styles.content}>
          {periods.map((period, index) => (
            <View key={index} style={styles.periodContainer}>
              <TimeRangePicker
                initialPeriod={period}
                onTimeRangeChange={(newPeriod) =>
                  handlePeriodChange(index, newPeriod)
                }
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemovePeriod(index)}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={theme.colors.error}
                />
                <Text style={styles.removeButtonText}>{t("remove")}</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddPeriod}>
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={theme.colors.primary}
            />
            <Text style={styles.addButtonText}>{t("addPeriod")}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
    overflow: "hidden",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  periodCount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  content: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
  },
  periodContainer: {
    marginBottom: theme.spacing.md,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
  },
  removeButtonText: {
    color: theme.colors.error,
    textAlign: "center",
    fontWeight: "500",
    marginLeft: theme.spacing.xs,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
  },
  addButtonText: {
    color: theme.colors.primary,
    textAlign: "center",
    fontWeight: "500",
    marginLeft: theme.spacing.xs,
  },
});
