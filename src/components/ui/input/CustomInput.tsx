import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";

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
  ...props
}) => {
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

  const validateInput = (inputValue: string): boolean => {
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

    if (!isValidInput) {
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
            "A senha deve ter no mínimo 6 caracteres, incluindo letras e números"
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

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        secureTextEntry={type === "password"}
        keyboardType={
          type === "number"
            ? "numeric"
            : type === "email"
            ? "email-address"
            : "default"
        }
        style={[styles.input, !isValid && styles.inputError, inputStyle]}
        {...props}
      />
      {!isValid && error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomInput;
