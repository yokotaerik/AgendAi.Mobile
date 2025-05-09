import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useTranslation } from 'react-i18next';
import api from '../../api';

interface ReviewModalProps {
  visible: boolean;
  attendanceId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  attendanceId,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(t('error'), t('pleaseSelectRating'));
      return;
    }

    setIsLoading(true);
    try {
      const apiRating = rating ;
      
      await api.post('/attendance/review', {
        attendanceId,
        rating: apiRating,
        comments: comments.trim() || null,
      });

      Alert.alert(t('success'), t('reviewSubmitted'));
      setRating(0);
      setComments('');
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert(t('error'), t('errorSubmittingReview'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starContainer}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={36}
            color={i <= rating ? theme.colors.warning : theme.colors.text.secondary}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('rateYourExperience')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.ratingLabel}>{t('tapToRate')}:</Text>
            <View style={styles.starsContainer}>{renderStars()}</View>

            <Text style={styles.commentsLabel}>{t('leaveComment')}:</Text>
            <TextInput
              style={styles.commentsInput}
              value={comments}
              onChangeText={setComments}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.submitButton, rating === 0 && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading || rating === 0}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>{t('submitReview')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  starContainer: {
    padding: theme.spacing.xs,
  },
  commentsLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  commentsInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
  },
  submitButtonText: {
    color: theme.colors.secondary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
});

export default ReviewModal;