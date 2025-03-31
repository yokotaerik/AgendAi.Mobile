import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import * as Localization from 'expo-localization';
import { RegisterDefaultSchedulesDto, RegisterSchedulesDto } from '../../../types/schedule';

interface ScheduleSummaryProps {
  defaultSchedules: RegisterDefaultSchedulesDto;
  specificSchedules: RegisterSchedulesDto;
}

export const ScheduleSummary: React.FC<ScheduleSummaryProps> = ({
  defaultSchedules,
  specificSchedules,
}) => {
  const { t } = useTranslation();

  const [locale, setLocale] = useState(ptBR);

  useEffect(() => {
    const osLocale = Localization.locale;
    if (osLocale.startsWith('en')) {
      setLocale(require('date-fns/locale/en-US'));
    } else if (osLocale.startsWith('es')) {
      setLocale(require('date-fns/locale/es'));
    } else {
      setLocale(ptBR);
    }
  }, []);

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), `dd 'de' MMMM`, { locale }).replace(
      'de',
      t('date.of')
    );
  };

  const DAY_NAMES = {
    0: t('days.sunday'),
    1: t('days.monday'),
    2: t('days.tuesday'),
    3: t('days.wednesday'),
    4: t('days.thursday'),
    5: t('days.friday'),
    6: t('days.saturday'),
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t("scheduleSummary.title")}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("scheduleSummary.defaultSchedule")}</Text>
        {Object.entries(defaultSchedules.defaultPeriods).map(([day, periods]) => {
          const dayNumber = Number(day) as keyof typeof DAY_NAMES;
          return (
            <View key={day} style={styles.dayContainer}>
              <Text style={styles.dayName}>{DAY_NAMES[dayNumber]}</Text>
              {periods.map((period, index) => (
                <Text key={index} style={styles.periodText}>
                  {formatTime(period.start)} - {formatTime(period.end)}
                </Text>
            ))}
          </View>
        )})}
      </View>

      {specificSchedules.schedules.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("scheduleSummary.specificSchedule")}</Text>
          {specificSchedules.schedules.map((schedule, index) => (
            <View key={index} style={styles.dayContainer}>
              <Text style={styles.dayName}>{formatDate(schedule.date)}</Text>
              {schedule.avaiblePeriods.map((period, periodIndex) => (
                <Text key={periodIndex} style={styles.periodText}>
                  {formatTime(period.start)} - {formatTime(period.end)}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 12,
  },
  dayContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
}); 