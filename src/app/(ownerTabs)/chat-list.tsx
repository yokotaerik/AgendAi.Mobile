import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={40} color={theme.colors.primary} />
      </View>
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
      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
    </TouchableOpacity>
  );

  if (loading) {  
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('chat.title')}</Text>
      </View>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item: ChatDto) => item.receiverId}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={60} color={theme.colors.text.light} />
          <Text style={styles.emptyText}>{t('chat.noChats')}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  lastMessage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
