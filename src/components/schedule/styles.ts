import { StyleSheet } from "react-native";
import { globalStyles } from "../../styles/global";

const stylesSchedulePage = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    ...globalStyles.shadow,
  },
  summaryButton: {
    padding: 8,
    backgroundColor: "#e3f2fd",
    borderRadius: 4,
  },
  summaryButtonText: {
    color: "#1976d2",
    fontWeight: "500",
  },
  saveButton: {
    margin: 16,
  },
  collapsibleSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    ...globalStyles.shadow,
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  
});

export default stylesSchedulePage;
