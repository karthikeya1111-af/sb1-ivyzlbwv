import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Award, Medal, Settings, ChevronRight, LogOut, Bell, Moon, CircleHelp as HelpCircle, Leaf } from 'lucide-react-native';
import { ProgressRing } from '@/components/ProgressRing';

export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  const userStats = {
    level: 8,
    points: 765,
    nextLevelPoints: 1000,
    progress: 0.765, // 76.5% to next level
    badges: 12,
    challenges: 6,
    streak: 7,
    co2Saved: 87.5,
  };
  
  const badges = [
    { id: 1, title: 'Energy Saver', icon: <Award size={28} color="#FBBF24" />, tier: 'gold' },
    { id: 2, title: 'Transport Pro', icon: <Award size={28} color="#94A3B8" />, tier: 'silver' },
    { id: 3, title: 'Eco Warrior', icon: <Award size={28} color="#F59E0B" />, tier: 'bronze' },
    { id: 4, title: 'Streak Master', icon: <Award size={28} color="#94A3B8" />, tier: 'silver' },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <Animated.View 
        entering={FadeIn.delay(200).duration(600)}
        style={styles.header}
      >
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.profileCard}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alex Mitchell</Text>
              <Text style={styles.profileUsername}>@alexeco</Text>
            </View>
          </View>
          
          <View style={styles.levelContainer}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Level {userStats.level}</Text>
              <Text style={styles.pointsText}>{userStats.points} / {userStats.nextLevelPoints} points</Text>
            </View>
            
            <ProgressRing 
              radius={32}
              strokeWidth={6}
              progress={userStats.progress}
              color="#10B981"
            />
          </View>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <Award size={20} color="#10B981" />
            <Text style={styles.statValue}>{userStats.badges}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
          
          <View style={styles.statCard}>
            <Medal size={20} color="#F59E0B" />
            <Text style={styles.statValue}>{userStats.challenges}</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>
          
          <View style={styles.statCard}>
            <Leaf size={20} color="#38BDF8" />
            <Text style={styles.statValue}>{userStats.co2Saved}kg</Text>
            <Text style={styles.statLabel}>CO₂ Saved</Text>
          </View>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(500).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Badges</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesContainer}
          >
            {badges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={[styles.badgeIconContainer, styles[`${badge.tier}Badge`]]}>
                  {badge.icon}
                </View>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeTier}>{badge.tier}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.settingsSection}
        >
          <Text style={styles.settingsSectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#94A3B8" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#334155', true: '#10B98180' }}
              thumbColor={notifications ? '#10B981' : '#64748B'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={20} color="#94A3B8" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#334155', true: '#10B98180' }}
              thumbColor={isDarkMode ? '#10B981' : '#64748B'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color="#94A3B8" />
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, styles.logoutItem]}>
            <View style={styles.settingLeft}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  badgesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  badgeCard: {
    width: 100,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  goldBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
  },
  silverBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  bronzeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  badgeTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeTier: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
    textTransform: 'capitalize',
  },
  settingsSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 24,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#EF4444',
    marginLeft: 12,
  },
  bottomSpacer: {
    height: 100,
  },
});