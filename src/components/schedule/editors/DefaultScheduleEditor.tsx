import { View, Text, TouchableOpacity } from "react-native";
import { DayOfWeek, AvaiblePeriodDto } from "../../../types/schedule";
import { WeekSelector } from "../ui";
import { globalStyles } from "../../../styles/global";
import { useTranslation } from "react-i18next";
import React from "react";
import styles from "../styles";

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
    <View>
      <WeekSelector
        defaultPeriods={defaultPeriods}
        onPeriodsChange={onPeriodsChange}
      />
      <TouchableOpacity
        style={[globalStyles.button, styles.saveButton]}
        onPress={onSave}
      >
        <Text style={globalStyles.buttonText}>{t("saveChanges")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DefaultScheduleEditor;
