import React, { useEffect } from "react";
import { FlatList, View, Text, StyleSheet, RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { AttendanceSummary } from "../../hooks/attendance/useAttendances";
import { theme } from "../../styles/theme";
import AttendanceItem from "./AttendanceItem";

interface AttendanceListViewProps {
  attendances: AttendanceSummary[];
  isEmployeeView?: boolean;
  onEditAttendance?: any;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const AttendanceListView: React.FC<AttendanceListViewProps> = ({
  attendances,
  isEmployeeView = false,
  onEditAttendance,
  onRefresh,
  refreshing = false,
}) => {
  const { t } = useTranslation();

  if (!attendances || attendances.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t("noAttendances")}</Text>
      </View>
    );
  }

  useEffect(() => {
    attendances.sort(
      (a, b) =>
        new Date(a.attendance.dateTime).getTime() -
        new Date(b.attendance.dateTime).getTime()
    );
  }, []);

  return (
    <FlatList
      data={attendances}
      keyExtractor={(item) => item.attendance.id}
      renderItem={({ item }) => (
        <AttendanceItem
          attendanceSummary={item}
          isEmployeeView={isEmployeeView}
          onEdit={onEditAttendance}
        />
      )}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});

export default AttendanceListView;
