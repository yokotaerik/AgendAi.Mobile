import { useState } from 'react';

export const useDateRange = (initialStartOffset = 0, initialEndOffset = 1) => {
  const getInitialStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + initialStartOffset);
    return date.toISOString();
  };

  const getInitialEndDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + initialEndOffset);
    return date.toISOString();
  };

  const [startDate, setStartDate] = useState<string>(getInitialStartDate());
  const [endDate, setEndDate] = useState<string>(getInitialEndDate());

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };
};