import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { baseURL } from "../../api";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { theme } from "../../styles/theme";

type EmployeeCardProps = {
  photoSrc?: string;
  name: string;
  onEdit: () => void;
  onSee: () => void;
  onSchedule: () => void;
};

const EmployeeCard = ({
  photoSrc,
  name,
  onEdit,
  onSee,
  onSchedule,
}: EmployeeCardProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Image
            source={
              photoSrc
                ? { uri: `${baseURL}${photoSrc}` }
                : require("../../../assets/default-avatar.png")
            }
            style={styles.photo}
          />
          <Text style={styles.name}>{name}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onSee}>
            <Ionicons name="eye-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onSchedule}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    width: "100%",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.secondary,
  },
  name: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    width: 36,
    height: 36,
  },
});

export default EmployeeCard;
