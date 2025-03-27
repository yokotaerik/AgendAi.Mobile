import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

interface ChatDto {
  receiverId: string;
  receiverName: string;
  lastMessage: string;
}

export default function ChatList() {
  const { t } = useTranslation();
  const { user, companyId } = useAuth();
  const [chats, setChats] = useState<ChatDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/message/chat');
      setChats(response.data as ChatDto[]);
      console.log(chats)
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChatItem = ({ item }: { item: ChatDto }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${companyId}/${item.receiverId}`)}
    >
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>  
          {item.receiverName} 
        </Text>
        {item.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage} 
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {  
    return (
      <View style={styles.container}>
        <Text>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('chat.title')}</Text>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item: ChatDto) => item.receiverId}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  listContainer: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: "#000000"
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  messageDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
});
