import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AvaiblePeriodDto } from '../../types/schedule';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';

interface TimeRangePickerProps {
  onTimeRangeChange: (period: AvaiblePeriodDto) => void;
  initialPeriod?: AvaiblePeriodDto;
}

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  onTimeRangeChange,
  initialPeriod,
}) => {
  const [startTime, setStartTime] = useState<Date>(
    initialPeriod?.start || new Date()
  );
  const [endTime, setEndTime] = useState<Date>(
    initialPeriod?.end || new Date()
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartTime(selectedDate);
      onTimeRangeChange({ start: selectedDate, end: endTime });
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndTime(selectedDate);
      onTimeRangeChange({ start: startTime, end: selectedDate });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.label}>Início:</Text>
          <Text style={styles.timeText}>{formatTime(startTime)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.label}>Fim:</Text>
          <Text style={styles.timeText}>{formatTime(endTime)}</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker 
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker 
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
}); 