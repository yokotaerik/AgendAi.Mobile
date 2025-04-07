import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

const stylesSchedulePage = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  summaryButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
  },
  summaryButtonText: {
    color: theme.colors.primary,
    fontWeight: "500",
  },
  saveButton: {
    margin: theme.spacing.md,
  },
  collapsibleSection: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
  },
  collapsibleTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
});

export default stylesSchedulePage;
