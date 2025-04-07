import { View, Text, TouchableOpacity } from "react-native";
import { DayOfWeek, AvaiblePeriodDto } from "../../../types/schedule";
import { WeekSelector } from "../ui";
import { useTranslation } from "react-i18next";
import React from "react";
import { StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

const DefaultScheduleEditor = ({
  defaultPeriods,
  onPeriodsChange,
  onSave,
}: {
  defaultPeriods: Record<DayOfWeek, AvaiblePeriodDto[]>;
  onPeriodsChange: (periods: Record<DayOfWeek, AvaiblePeriodDto[]>) => void;
  onSave: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <WeekSelector
        defaultPeriods={defaultPeriods}
        onPeriodsChange={onPeriodsChange}
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSave}
      >
        <Ionicons name="save-outline" size={20} color={theme.colors.text.primary} />
        <Text style={styles.saveButtonText}>{t("saveChanges")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'transparent',
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    marginLeft: theme.spacing.xs,
  }
});

export default DefaultScheduleEditor;
