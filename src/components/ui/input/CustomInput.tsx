import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

type InputType = "text" | "number" | "email" | "password";

interface CustomInputProps extends Omit<TextInputProps, "value" | "onChange"> {
  type?: InputType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  nullable?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  iconColor?: string;
  onIconPress?: () => void;
  label?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  errorMessage,
  containerStyle,
  inputStyle,
  errorStyle,
  nullable = false,
  icon,
  iconPosition = "left",
  iconColor,
  onIconPress,
  label,
  ...props
}) => {
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [secureTextEntry, setSecureTextEntry] = useState(type === "password");

  const validateInput = (inputValue: string): boolean => {
    if (nullable && inputValue.trim() === "") return true;
    
    switch (type) {
      case "text":
        return inputValue.trim().length > 0;
      case "number":
        return /^\d+$/.test(inputValue);
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);
      case "password":
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
          inputValue
        );
      default:
        return true;
    }
  };

  const handleChange = (text: string) => {
    const isValidInput = validateInput(text);
    setIsValid(isValidInput);

    if (!isValidInput && text.trim() !== "") {
      switch (type) {
        case "text":
          if(nullable) break;
          setError("Este campo não pode estar vazio");
          break;
        case "number":
          setError("Digite apenas números");
          break;
        case "email":
          setError("Digite um email válido");
          break;
        case "password":
          setError(
            "A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos"
          );
          break;
      }
    } else {
      setError("");
    }

    onChange(text);
  };

  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
      setIsValid(false);
    }
  }, [errorMessage]);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        !isValid && styles.inputContainerError,
        inputStyle
      ]}>
        {icon && iconPosition === "left" && (
          <TouchableOpacity 
            onPress={onIconPress} 
            style={styles.iconContainer}
            disabled={!onIconPress}
          >
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={iconColor || theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        )}
        
        <TextInput
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={
            type === "number"
              ? "numeric"
              : type === "email"
              ? "email-address"
              : "default"
          }
          style={[
            styles.input, 
            icon && iconPosition === "left" && styles.inputWithLeftIcon,
            icon && iconPosition === "right" && styles.inputWithRightIcon,
            type === "password" && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={theme.colors.text.light}
          {...props}
        />
        
        {icon && iconPosition === "right" && (
          <TouchableOpacity 
            onPress={onIconPress} 
            style={styles.iconContainer}
            disabled={!onIconPress}
          >
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={iconColor || theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        )}
        
        {type === "password" && (
          <TouchableOpacity 
            onPress={toggleSecureEntry} 
            style={styles.iconContainer}
          >
            <Ionicons 
              name={secureTextEntry ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color={theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {!isValid && error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
  },
  inputContainerError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconContainer: {
    paddingHorizontal: theme.spacing.sm,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CustomInput;
