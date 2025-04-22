import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

interface LoadingComponentProps {
  text?: string;
  size?: "small" | "large";
  fullScreen?: boolean;
  color?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  text,
  size = "large",
  fullScreen = false,
  color = theme.colors.primary,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 999,
  },
  text: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    textAlign: "center",
  },
});

export default LoadingComponent;