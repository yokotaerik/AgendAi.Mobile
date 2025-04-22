import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { theme } from "../../styles/theme";
import AttendanceItem from "./AttendanceItem";
import { AttendanceSummary } from "../../hooks/attendance/useAttendances";
import { format } from "date-fns";
import api from "../../api";

interface AttendanceListViewProps {
  attendances: AttendanceSummary[];
  isEmployeeView?: boolean;
}

interface SectionData {
  title: string;
  data: AttendanceSummary[];
}

const AttendanceListView: React.FC<AttendanceListViewProps> = ({
  attendances,
  isEmployeeView = false,
}) => {
  const { t, i18n } = useTranslation();

  // Group attendances by date
  const groupedAttendances = useMemo(() => {
    if (attendances.length === 0) return [];

    // Sort attendances by date (newest first)
    const sortedAttendances = [...attendances].sort((a, b) => {
      const dateA = new Date(a.attendance.dateTime);
      const dateB = new Date(b.attendance.dateTime);
      return dateA.getTime() - dateB.getTime();
    });

    // Group by date
    const groups: { [key: string]: AttendanceSummary[] } = {};
    
    sortedAttendances.forEach(attendance => {
      const date = new Date(attendance.attendance.dateTime);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      
      groups[dateStr].push(attendance);
    });

    // Convert to section list format
    return Object.keys(groups).map(date => ({
      title: format(new Date(date), 'EEEE, dd MMMM'),
      data: groups[date]
    }));
  }, [attendances]);

  if (attendances.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar" size={60} color={theme.colors.text.light} />
        <Text style={styles.emptyText}>{t("noAttendances")}</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={groupedAttendances}
      keyExtractor={(item) => item.attendance.id}
      renderItem={({ item }) => (
        <AttendanceItem 
          attendanceSummary={item} 
          isEmployeeView={isEmployeeView} 
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
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
    marginTop: theme.spacing.md,
  },
  sectionHeader: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  sectionHeaderText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textTransform: "capitalize",
  },
});

export default AttendanceListView;