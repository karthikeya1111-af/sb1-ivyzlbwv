import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChartBar as BarChart3, TrendingUp, TrendingDown } from 'lucide-react-native';

interface DailySummaryCardProps {
  ecoPoints: number;
  co2Saved: number;
  percentChange: number;
}

export function DailySummaryCard({ ecoPoints, co2Saved, percentChange }: DailySummaryCardProps) {
  const isPositiveChange = percentChange >= 0;
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Summary</Text>
        <BarChart3 size={20} color="#10B981" />
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Eco-Points</Text>
          <Text style={styles.statValue}>{ecoPoints}</Text>
          <View style={styles.changeContainer}>
            {isPositiveChange ? (
              <TrendingUp size={14} color="#10B981" />
            ) : (
              <TrendingDown size={14} color="#EF4444" />
            )}
            <Text style={[
              styles.changeText,
              isPositiveChange ? styles.positiveChange : styles.negativeChange
            ]}>
              {isPositiveChange ? '+' : ''}{percentChange}%
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>CO₂ Saved</Text>
          <Text style={styles.statValue}>{co2Saved} kg</Text>
          <Text style={styles.statSubtitle}>Today</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
  },
  positiveChange: {
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
  divider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 16,
  },
});