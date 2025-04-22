import { AvaiblePeriodDto } from "../../types/schedule";

export function usePeriods() {
  function areTimesEqual(date1: Date, date2: Date): boolean {
    return (
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    );
  }

  function mergeAvailablePeriods(
    periods: AvaiblePeriodDto[]
  ): AvaiblePeriodDto[] {
    console.log("Períodos antes da ordenação:", periods);

    periods.sort((a, b) => {
      const dateDiff = a.start.getTime() - b.start.getTime();
      return dateDiff;
    });

    const merged: AvaiblePeriodDto[] = [];
    let current: AvaiblePeriodDto | null = null;

    for (const period of periods) {
      if (!current) {
        current = { ...period };
      } else if (areTimesEqual(current.end, period.start)) {
        current.end = getLaterTime(current.end, period.end);
      } else {
        merged.push(current);
        current = { ...period };
      }
    }

    if (current) {
      merged.push(current);
    }

    return merged;
  }

  function getLaterTime(date1: Date, date2: Date): Date {
    const d1Minutes = date1.getHours() * 60 + date1.getMinutes();
    const d2Minutes = date2.getHours() * 60 + date2.getMinutes();
    return d1Minutes >= d2Minutes ? date1 : date2;
  }

  return {
    mergeAvailablePeriods,
  };
}
