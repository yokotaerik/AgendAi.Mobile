import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as Localization from 'expo-localization';
import { theme } from '../../../styles/theme';

interface MonthCalendarProps {
  onDaySelect: (date: string) => void;
  markedDates?: Record<string, { marked: boolean; dotColor?: string }>;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  onDaySelect,
  markedDates,
}) => {
  const handleDayPress = (day: { dateString: string }) => {
    onDaySelect(day.dateString);
  };
  const osLocale = Localization.locale;
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          calendarBackground: theme.colors.surface,
          textSectionTitleColor: theme.colors.text.secondary,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.text.primary,
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.text.primary,
          textDisabledColor: `${theme.colors.text.light}80`,
          dotColor: theme.colors.primary,
          monthTextColor: theme.colors.text.primary,
          arrowColor: theme.colors.primary,
          // Additional styling
          textDayFontSize: theme.typography.fontSize.sm,
          textMonthFontSize: theme.typography.fontSize.md,
          textDayHeaderFontSize: theme.typography.fontSize.sm,
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
        }}
        locale={osLocale}
        firstDay={1}
        enableSwipeMonths={true}
        showWeekNumbers={false}
        markingType="dot"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});