import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles } from "../../styles/global";
import { baseURL } from "../../api";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

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
    <View style={[styles.card, globalStyles.shadow]}>
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
            <Ionicons name="create-outline" size={20} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onSee}>
            <Ionicons name="search-outline" size={20} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onSchedule}>
            <Ionicons name="calendar-clear-outline" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 2,
    width: "100%",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    gap: 8,
    flexDirection: "column",
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 8,
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 2,
    marginLeft: 8,
    width: 60,
  },
  buttonText: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
  },
});

export default EmployeeCard;
