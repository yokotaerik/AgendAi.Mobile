import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
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
        <ActivityIndicator size="large" color="#0000ff" />
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
          <View style={{ display: "flex", alignItems: "center", height:50, flexDirection: "row", gap: 5}}>
            <Feather
              name="chevron-left"
              size={24}
              color="black"
              style ={{marginTop: 5}}
              onPress={() => router.back()}
            />
            <Text style={styles.chatHeader}>
              {user?.id === messages[messages.length - 1].senderId
                ? messages[messages.length - 1].receiverName
                : messages[messages.length - 1].senderName}
            </Text>
          </View>
        )}
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.messagesContainer}>
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
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  chatHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
