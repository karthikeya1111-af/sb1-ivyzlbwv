import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { Leaf, Zap, Car, ShoppingBag, TrendingUp, Award, Gift, ChartBar as BarChart3 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { DailySummaryCard } from '@/components/DailySummaryCard';
import { TipCard } from '@/components/TipCard';
import { StreakBadge } from '@/components/StreakBadge';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Animated.Text 
              entering={FadeInDown.delay(200).duration(700)}
              style={styles.greeting}
            >
              Hello, Alex
            </Animated.Text>
            <Animated.View 
              entering={FadeInDown.delay(300).duration(700)}
              style={styles.streakContainer}
            >
              <StreakBadge days={7} />
            </Animated.View>
          </View>
          
          <Animated.View 
            entering={FadeInDown.delay(200).duration(700)}
            style={styles.logoContainer}
          >
            <Leaf color="#10B981" size={24} />
          </Animated.View>
        </View>
        
        <Animated.View 
          entering={FadeInDown.delay(400).duration(700)}
        >
          <DailySummaryCard 
            ecoPoints={138}
            co2Saved={12.5}
            percentChange={+8}
          />
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(500).duration(700)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Track Habits</Text>
            <TouchableOpacity onPress={() => router.push('/track')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.habitCardsContainer}
          >
            <HabitCard 
              title="Electricity"
              icon={<Zap size={24} color="#FBBF24" />}
              color="#FBBF24"
              bgColor="#422006"
              onPress={() => router.push('/track')}
            />
            <HabitCard 
              title="Transport"
              icon={<Car size={24} color="#38BDF8" />}
              color="#38BDF8"
              bgColor="#082F49"
              onPress={() => router.push('/track')}
            />
            <HabitCard 
              title="Consumption"
              icon={<ShoppingBag size={24} color="#A78BFA" />}
              color="#A78BFA"
              bgColor="#2E1065"
              onPress={() => router.push('/track')}
            />
          </ScrollView>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(600).duration(700)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Eco Tips</Text>
          </View>
          
          <TipCard 
            title="Use energy-efficient lighting"
            description="Replace regular light bulbs with LED ones to save up to 80% electricity."
            color="#10B981"
            icon={<Zap size={24} color="#10B981" />}
          />
          
          <TipCard 
            title="Walk for short distances"
            description="For trips under 1 mile, walking instead of driving can save 0.5kg of CO2."
            color="#38BDF8"
            icon={<Car size={24} color="#38BDF8" />}
          />
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(700).duration(700)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Challenge</Text>
            <TouchableOpacity onPress={() => router.push('/challenges')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.challengeCard}
            onPress={() => router.push('/challenges')}
          >
            <View style={styles.challengeIconContainer}>
              <Award size={28} color="#F59E0B" />
            </View>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>Plastic-Free Week</Text>
              <View style={styles.challengeProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '70%' }]} />
                </View>
                <Text style={styles.progressText}>5/7 days</Text>
              </View>
              <Text style={styles.challengeReward}>Reward: 200 Eco-Points</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface HabitCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onPress: () => void;
}

function HabitCard({ title, icon, color, bgColor, onPress }: HabitCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.habitCard, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <View style={[styles.habitIconContainer, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <Text style={[styles.habitTitle, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  streakContainer: {
    marginTop: 4,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#10B981',
  },
  habitCardsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  habitCard: {
    width: 110,
    height: 110,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    justifyContent: 'space-between',
  },
  habitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 8,
  },
  challengeCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 8,
  },
  challengeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  challengeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
  },
  challengeReward: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#F59E0B',
  },
  bottomSpacer: {
    height: 100,
  },
});