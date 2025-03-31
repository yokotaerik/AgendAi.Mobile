import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AvaiblePeriodDto } from '../../types/schedule';
import { TimeRangePicker } from './TimeRangePicker';

interface DayScheduleEditorProps {
  dayName: string;
  periods: AvaiblePeriodDto[];
  onPeriodsChange: (periods: AvaiblePeriodDto[]) => void;
}

export const DayScheduleEditor: React.FC<DayScheduleEditorProps> = ({
  dayName,
  periods,
  onPeriodsChange,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

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
        <Text style={styles.periodCount}>
          {periods.length} {t('period', { count: periods.length })}
        </Text>
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
                <Text style={styles.removeButtonText}>{t('remove')}</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddPeriod}>
            <Text style={styles.addButtonText}>{t('addPeriod')}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  periodCount: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  periodContainer: {
    marginBottom: 16,
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 4,
    marginTop: 8,
  },
  removeButtonText: {
    color: '#d32f2f',
    textAlign: 'center',
    fontWeight: '500',
  },
  addButton: {
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    marginTop: 8,
  },
  addButtonText: {
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: '500',
  },
});