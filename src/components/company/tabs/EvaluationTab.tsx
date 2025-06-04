import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { ReviewDto } from "../../../types/schedule";
import { theme } from "../../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EvaluationTabProps {
  evaluations: ReviewDto[];
}

const EvaluationTab: React.FC<EvaluationTabProps> = ({ evaluations }) => {
  const { t } = useTranslation();
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
  };

  const renderEvaluationItem = ({ item }: { item: ReviewDto }) => (
    <View style={styles.evaluationItem}>
      <View style={styles.evaluationHeader}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={styles.star}>
            {star <= item.rating ? "★" : "☆"}
          </Text>
        ))}
      </View>
      <Text style={styles.comment}>{item.comments}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("reviews")}</Text>
      {evaluations && evaluations.length > 0 ? (
        <FlatList
          data={evaluations}
          renderItem={renderEvaluationItem}
          keyExtractor={(_, index) => `evaluation-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="star-outline" size={48} color={theme.colors.tertiary} />
          <Text style={styles.emptyText}>{t("noReviewsFound")}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.md,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  evaluationItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  evaluationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  userName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  date: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.sm,
  },
  star: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.warning,
    marginRight: theme.spacing.xs,
  },
  comment: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "500",
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
});

export default EvaluationTab;
