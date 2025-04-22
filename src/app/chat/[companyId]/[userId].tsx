import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useAuth } from "../../../contexts/AuthContext";
import { UserType } from "../../../types/common";
import api, { baseURL } from "../../../api";
import * as signalR from "@microsoft/signalr";
import { Feather } from "@expo/vector-icons";
import CustomInput from "../../../components/ui/input/CustomInput";
import { theme } from "../../../styles/theme";
import { useTranslation } from "react-i18next";

interface MessageDto {
  id: string;
  content: string;
  senderId: string; // is User Id
  senderName: string;
  receiverId: string; // is User Id
  receiverName: string;
  createdAt: Date;
}

export default function Chat() {
  const { t } = useTranslation();
  const { companyId, userId } = useLocalSearchParams();
  const { user } = useAuth();
  const [connection, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const hubUrl = baseURL.replace("/api", "") + "/chatHub";
      const token = api.defaults.headers.common["Authorization"] as string;

      if (token == undefined) router.replace("/home");

      const newConnection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          withCredentials: false,
          accessTokenFactory: () => token.replace("Bearer ", ""),
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    } catch (err: any) {
      console.error("Erro ao criar conexão:", err);
      Alert.alert(
        "Erro",
        "Não foi possível conectar ao chat. Tente novamente mais tarde."
      );
    }
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Conectado ao SignalR");
          connection.on("ReceiveMessage", (message: MessageDto) => {
            setMessages((prev) => [...prev, message]);
          });

          connection.invoke("GetChatHistory", companyId, userId);

          connection.on("ReceiveChatHistory", (listOfmessage: MessageDto[]) => {
            setMessages(listOfmessage);
            setLoading(false);
          });
        })
        .catch((error) => {
          console.log("Erro ao conectar:", error);
          setLoading(false);
        });
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    let receiverId = "";

    if (messages.length > 0) {
      messages.forEach((m) => {
        if (m.senderId === user?.id) {
          console.log(m.receiverId);
          receiverId = m.receiverId;
        }
      });

      if (user?.role == UserType.Customer) {
        const response = await GetUserByCompanyId();
        receiverId = response.data as string;
      }
      if (user?.role == UserType.Employee) {
        receiverId = userId as string;
      }
    } else {
      if (user?.role == UserType.Customer) {
        const response = await GetUserByCompanyId();
        receiverId = response.data as string;
      } else {
        receiverId = userId as string;
      }
    }

    try {
      await connection!.invoke("SendMessage", newMessage, receiverId);
      setNewMessage("");
    } catch (error) {
      console.log("Erro ao enviar mensagem:", error);
    }

    async function GetUserByCompanyId() {
      const response = await api.get(`/company/ownerUserId/${companyId}`);
      if (response.status != 200) {
        Alert.alert(
          "Um erro interno ocorreu, entre em contato com a plataforma"
        );
      }
      return response;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.header}>
        {messages.length > 0 && (
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather
                name="chevron-left"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.chatHeader}>
              {user?.id === messages[messages.length - 1].senderId
                ? messages[messages.length - 1].receiverName
                : messages[messages.length - 1].senderName}
            </Text>
          </View>
        )}
      </SafeAreaView>
      <ScrollView 
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.senderId === user?.id
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.senderId === user?.id ? styles.myMessageText : styles.otherMessageText
            ]}>
              {msg.content}
            </Text>
            <Text style={styles.messageTime}>
              {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={t("chat.typingMessage") || "Digite sua mensagem..."}
          placeholderTextColor={theme.colors.text.light}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Feather name="send" size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    height: 50,
    flexDirection: "row",
    paddingHorizontal: 15,
    gap: 15,
  },
  chatHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: 4,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  myMessageText: {
    color: theme.colors.text.primary,
  },
  otherMessageText: {
    color: theme.colors.text.primary,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
    color: theme.colors.text.secondary,
    opacity: 0.8,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.tertiary,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: theme.colors.tertiary,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
