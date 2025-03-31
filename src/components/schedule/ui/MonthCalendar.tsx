import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as Localization from 'expo-localization';

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
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#666666',
          selectedDayBackgroundColor: '#1976d2',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#1976d2',
          dayTextColor: '#333333',
          textDisabledColor: '#d9d9d9',
          dotColor: '#1976d2',
          monthTextColor: '#333333',
          arrowColor: '#1976d2',
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
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
}); 