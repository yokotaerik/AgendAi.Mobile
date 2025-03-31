import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DayOfWeek, AvaiblePeriodDto } from '../../../types/schedule';
import { DayScheduleEditor } from './DayScheduleEditor';

interface WeekSelectorProps {
  defaultPeriods: Record<DayOfWeek, AvaiblePeriodDto[]>;
  onPeriodsChange: (periods: Record<DayOfWeek, AvaiblePeriodDto[]>) => void;
}

const DAY_NAMES = {
  [DayOfWeek.Sunday]: 'Domingo',
  [DayOfWeek.Monday]: 'Segunda-feira',
  [DayOfWeek.Tuesday]: 'Terça-feira',
  [DayOfWeek.Wednesday]: 'Quarta-feira',
  [DayOfWeek.Thursday]: 'Quinta-feira',
  [DayOfWeek.Friday]: 'Sexta-feira',
  [DayOfWeek.Saturday]: 'Sábado',
};

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  defaultPeriods,
  onPeriodsChange,
}) => {
  const handleDayPeriodsChange = (day: DayOfWeek, periods: AvaiblePeriodDto[]) => {
    onPeriodsChange({
      ...defaultPeriods,
      [day]: periods,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {Object.entries(DAY_NAMES).map(([day, name]) => (
        <DayScheduleEditor
          key={day}
          dayName={name}
          periods={defaultPeriods[Number(day) as DayOfWeek]}
          onPeriodsChange={(periods) =>
            handleDayPeriodsChange(Number(day) as DayOfWeek, periods)
          }
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 