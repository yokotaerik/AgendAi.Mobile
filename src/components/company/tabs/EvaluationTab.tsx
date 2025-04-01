import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Evaluation {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  date: string;
}

interface EvaluationTabProps {
  evaluations: Evaluation[];
}

const EvaluationTab: React.FC<EvaluationTabProps> = ({ evaluations }) => {
  const { t } = useTranslation();

  const renderEvaluationItem = ({ item }: { item: Evaluation }) => (
    <View style={styles.evaluationItem}>
      <View style={styles.evaluationHeader}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={styles.star}>
            {star <= item.rating ? '★' : '☆'}\
          </Text>
        ))}
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('evaluations')}</Text>
      <FlatList
        data={evaluations}
        renderItem={renderEvaluationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  evaluationItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  evaluationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 20,
    color: '#FFD700',
    marginRight: 4,
  },
  comment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default EvaluationTab; 