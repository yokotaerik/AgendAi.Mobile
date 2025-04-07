import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DayOfWeek, AvaiblePeriodDto } from '../../../types/schedule';
import { DayScheduleEditor } from './DayScheduleEditor';
import { theme } from '../../../styles/theme';
import { useTranslation } from 'react-i18next';

interface WeekSelectorProps {
  defaultPeriods: Record<DayOfWeek, AvaiblePeriodDto[]>;
  onPeriodsChange: (periods: Record<DayOfWeek, AvaiblePeriodDto[]>) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  defaultPeriods,
  onPeriodsChange,
}) => {
  const { t } = useTranslation();
  
  const getDayName = (day: DayOfWeek) => {
    switch (day) {
      case DayOfWeek.Sunday: return t('sunday');
      case DayOfWeek.Monday: return t('monday');
      case DayOfWeek.Tuesday: return t('tuesday');
      case DayOfWeek.Wednesday: return t('wednesday');
      case DayOfWeek.Thursday: return t('thursday');
      case DayOfWeek.Friday: return t('friday');
      case DayOfWeek.Saturday: return t('saturday');
      default: return '';
    }
  };

  const handleDayPeriodsChange = (day: DayOfWeek, periods: AvaiblePeriodDto[]) => {
    onPeriodsChange({
      ...defaultPeriods,
      [day]: periods,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.weekContainer}>
        {Object.values(DayOfWeek)
          .filter(day => !isNaN(Number(day)))
          .map(day => Number(day) as DayOfWeek)
          .map(day => (
            <DayScheduleEditor
              key={day}
              dayName={getDayName(day)}
              periods={defaultPeriods[day]}
              onPeriodsChange={(periods) =>
                handleDayPeriodsChange(day, periods)
              }
            />
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
  },
  weekContainer: {
    padding: theme.spacing.sm,
  }
});