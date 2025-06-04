import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dimensions } from 'react-native';
import { theme } from '../../../styles/theme';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../api';
import { PerformanceDashboardDto } from '../../../types/dashboard';
import { useCurrency } from '../../../contexts/CurrencyContext';
// import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const PerformanceDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { companyId } = useAuth();
  const { format } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<PerformanceDashboardDto | null>(null);
  
  // Filtros de data
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchDashboardData();
    }
  }, [companyId, startDate, endDate]);

  const fetchDashboardData = async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/reports', {
        params: {
          companyId,
          startDate: startDate.toUTCString(),
          endDate: endDate.toUTCString(),
        },
      });

      
      setDashboardData(response.data as PerformanceDashboardDto);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(t('fetchDashboardError'));
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (value: number) => {
    return format(value);
  };

  const formatDuration = (durationString: string) => {
    const [hours, minutes] = durationString.split(':');
    return `${hours}h${minutes}min`;
  };

  const getConfirmationRate = () => {
    if (!dashboardData || dashboardData.totalAppointments === 0) return 0;
    return Math.round((dashboardData.confirmedAppointments / dashboardData.totalAppointments) * 100);
  };

  const getCancellationRate = () => {
    if (!dashboardData || dashboardData.totalAppointments === 0) return 0;
    return Math.round((dashboardData.canceledAppointments / dashboardData.totalAppointments) * 100);
  };

  const getEmployeeChartData = () => {
    if (!dashboardData || !dashboardData.employeePerformances.length) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }

    return {
      labels: dashboardData.employeePerformances.map(emp => emp.employeeName.split(' ')[0]),
      datasets: [
        {
          data: dashboardData.employeePerformances.map(emp => emp.totalAppointments),
        },
      ],
    };
  };

  const getRevenueChartData = () => {
    if (!dashboardData || !dashboardData.employeePerformances.length) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }

    return {
      labels: dashboardData.employeePerformances.map(emp => emp.employeeName.split(' ')[0]),
      datasets: [
        {
          data: dashboardData.employeePerformances.map(emp => emp.totalRevenueGenerated),
        },
      ],
    };
  };

  const getStatusChartData = () => {
    if (!dashboardData) return [];

    const confirmed = dashboardData.confirmedAppointments;
    const canceled = dashboardData.canceledAppointments;
    const pending = dashboardData.totalAppointments - confirmed - canceled;

    return [
      {
        name: t('confirmed'),
        population: confirmed,
        color: theme.colors.success,
        legendFontColor: theme.colors.text.primary,
        legendFontSize: 12,
      },
      {
        name: t('canceled'),
        population: canceled,
        color: theme.colors.error,
        legendFontColor: theme.colors.text.primary,
        legendFontSize: 12,
      },
      {
        name: t('pending'),
        population: pending,
        color: theme.colors.warning,
        legendFontColor: theme.colors.text.primary,
        legendFontSize: 12,
      },
    ];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
          <Text style={styles.retryButtonText}>{t('retry')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('performanceDashboard')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filtros de data */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>{t('filterByPeriod')}</Text>
          <View style={styles.dateFilters}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>{t('startDate')}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.text.primary}
                />
                <Text style={styles.dateText}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                  maximumDate={endDate}
                />
              )}
            </View>

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>{t('endDate')}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.text.primary}
                />
                <Text style={styles.dateText}>
                  {endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                  minimumDate={startDate}
                  maximumDate={new Date()}
                />
              )}
            </View>
          </View>
        </View>

        {dashboardData ? (
          <>
            {/* Resumo geral */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('generalSummary')}</Text>
              <View style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                  <Ionicons name="calendar" size={24} color={theme.colors.primary} />
                  <Text style={styles.metricValue}>{dashboardData.totalAppointments}</Text>
                  <Text style={styles.metricLabel}>{t('totalAppointments')}</Text>
                </View>

                <View style={styles.metricCard}>
                  <Ionicons name="cash-outline" size={24} color={theme.colors.success} />
                  <Text style={styles.metricValue}>{formatCurrency(dashboardData.totalRevenue)}</Text>
                  <Text style={styles.metricLabel}>{t('totalRevenue')}</Text>
                </View>

                <View style={styles.metricCard}>
                  <Ionicons name="time-outline" size={24} color={theme.colors.warning} />
                  <Text style={styles.metricValue}>{formatDuration(dashboardData.averageDuration)}</Text>
                  <Text style={styles.metricLabel}>{t('avgDuration')}</Text>
                </View>

                <View style={styles.metricCard}>
                  <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.primary} />
                  <Text style={styles.metricValue}>{getConfirmationRate()}%</Text>
                  <Text style={styles.metricLabel}>{t('confirmationRate')}</Text>
                </View>
              </View>
            </View>

            {/* Status dos agendamentos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('appointmentStatus')}</Text>
              <View style={styles.chartContainer}>
                {/* <PieChart
                  data={getStatusChartData()}
                  width={screenWidth - 40}
                  height={200}
                  chartConfig={{
                    backgroundColor: theme.colors.background,
                    backgroundGradientFrom: theme.colors.background,
                    backgroundGradientTo: theme.colors.background,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                /> */}
              </View>
            </View>

            {/* Desempenho por funcionário */}
            {dashboardData.employeePerformances.length > 0 && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{t('appointmentsByEmployee')}</Text>
                  <View style={styles.chartContainer}>
                    {/* <BarChart
                      yAxisSuffix=""
                      data={getEmployeeChartData()}
                      width={screenWidth - 40}
                      height={220}
                      yAxisLabel=""
                      chartConfig={{
                        backgroundColor: theme.colors.primary,
                        backgroundGradientFrom: theme.colors.primary,
                        backgroundGradientTo: theme.colors.primary,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        },
                      }}
                      style={{
                        marginVertical: 8,
                        borderRadius: 16,
                      }}
                    /> */}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{t('revenueByEmployee')}</Text>
                  <View style={styles.chartContainer}>
                    {/* <BarChart
                      yAxisSuffix=""
                      data={getRevenueChartData()}
                      width={screenWidth - 40}
                      height={220}
                      yAxisLabel="R$"
                      chartConfig={{
                        backgroundColor: theme.colors.success,
                        backgroundGradientFrom: theme.colors.success,
                        backgroundGradientTo: theme.colors.success,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        },
                      }}
                      style={{
                        marginVertical: 8,
                        borderRadius: 16,
                      }}
                    /> */}
                  </View>
                </View>

                {/* Detalhes por funcionário */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{t('employeeDetails')}</Text>
                  {dashboardData.employeePerformances.map((employee) => (
                    <View key={employee.employeeId} style={styles.employeeCard}>
                      <Text style={styles.employeeName}>{employee.employeeName}</Text>
                      <View style={styles.employeeStats}>
                        <View style={styles.employeeStat}>
                          <Text style={styles.employeeStatLabel}>{t('appointments')}</Text>
                          <Text style={styles.employeeStatValue}>{employee.totalAppointments}</Text>
                        </View>
                        <View style={styles.employeeStat}>
                          <Text style={styles.employeeStatLabel}>{t('revenue')}</Text>
                          <Text style={styles.employeeStatValue}>
                            {formatCurrency(employee.totalRevenueGenerated)}
                          </Text>
                        </View>
                        <View style={styles.employeeStat}>
                          <Text style={styles.employeeStatLabel}>{t('avgDuration')}</Text>
                          <Text style={styles.employeeStatValue}>
                            {formatDuration(employee.averageDuration)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="analytics-outline" size={48} color={theme.colors.text.light} />
            <Text style={styles.emptyText}>{t('noDashboardData')}</Text>
            <Text style={styles.emptySubtext}>{t('tryDifferentDates')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 24,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  filterContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  filterTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  dateFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  dateLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginVertical: theme.spacing.xs,
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.light,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  employeeCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  employeeName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  employeeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  employeeStat: {
    alignItems: 'center',
  },
  employeeStatLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.light,
    marginBottom: theme.spacing.xs,
  },
  employeeStatValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});

export default PerformanceDashboard;