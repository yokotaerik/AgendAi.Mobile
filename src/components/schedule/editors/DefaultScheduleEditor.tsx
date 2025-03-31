import { View, Text } from "react-native";
import { DayOfWeek, AvaiblePeriodDto } from "../../../types/schedule";
import { WeekSelector } from "../ui";
import { stylesSchedulePage as styles } from "../../../app/manage/schedule/[employeeId]";

const DefaultScheduleEditor = ({
  defaultPeriods,
  onPeriodsChange,
}: {
  defaultPeriods: Record<DayOfWeek, AvaiblePeriodDto[]>;
  onPeriodsChange: (periods: Record<DayOfWeek, AvaiblePeriodDto[]>) => void;
}) => {
  return (
    <View style={styles.componentContainer}>
      <Text style={styles.componentTitle}>Agenda Padrão</Text>
      <WeekSelector
        defaultPeriods={defaultPeriods}
        onPeriodsChange={onPeriodsChange}
      />
    </View>
  );
};

export default DefaultScheduleEditor;
