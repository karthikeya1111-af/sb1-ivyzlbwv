import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Award, Users, ChevronRight, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const challenges = [
  {
    id: '1',
    title: 'Plastic-Free Week',
    description: 'Avoid using single-use plastics for 7 days',
    reward: 200,
    progress: 5,
    total: 7,
    category: 'consumption',
    endDate: '2025-06-07',
    isActive: true,
  },
  {
    id: '2',
    title: 'Public Transport Champion',
    description: 'Use public transportation instead of car for 5 days',
    reward: 150,
    progress: 3,
    total: 5,
    category: 'transport',
    endDate: '2025-06-10',
    isActive: true,
  },
  {
    id: '3',
    title: 'Energy Saver',
    description: 'Reduce your electricity consumption by 20% this week',
    reward: 250,
    progress: 0,
    total: 1,
    category: 'electricity',
    endDate: '2025-06-14',
    isActive: true,
  },
  {
    id: '4',
    title: 'Meatless Days',
    description: 'Go vegetarian for 3 days this week',
    reward: 125,
    progress: 2,
    total: 3,
    category: 'consumption',
    endDate: '2025-06-08',
    isActive: true,
  },
];

const completedChallenges = [
  {
    id: '5',
    title: 'Water Conservation',
    description: 'Reduce water consumption by taking shorter showers',
    reward: 100,
    progress: 7,
    total: 7,
    category: 'consumption',
    endDate: '2025-05-28',
    isActive: false,
  },
  {
    id: '6',
    title: 'Zero Waste Weekend',
    description: 'Generate no trash for an entire weekend',
    reward: 150,
    progress: 2,
    total: 2,
    category: 'consumption',
    endDate: '2025-05-21',
    isActive: false,
  },
];

export default function ChallengesScreen() {
  const [activeChallenges, setActiveChallenges] = useState(challenges);
  const [completedChallengesList, setCompletedChallengesList] = useState(completedChallenges);
  const [activeTab, setActiveTab] = useState('active');
  
  const router = useRouter();
  
  const handleCompleteChallenge = (challengeId: string) => {
    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (!challenge) return;
    
    // Move to completed list
    setActiveChallenges(activeChallenges.filter(c => c.id !== challengeId));
    setCompletedChallengesList([
      {...challenge, isActive: false, progress: challenge.total},
      ...completedChallengesList
    ]);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <Animated.View 
        entering={FadeIn.delay(200).duration(600)}
        style={styles.header}
      >
        <Text style={styles.title}>Weekly Challenges</Text>
        <Text style={styles.subtitle}>Complete eco-challenges to earn rewards</Text>
      </Animated.View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'active' && (
          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            {activeChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id}
                challenge={challenge}
                onComplete={handleCompleteChallenge}
              />
            ))}
          </Animated.View>
        )}
        
        {activeTab === 'leaderboard' && (
          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            <LeaderboardSection />
          </Animated.View>
        )}
        
        {activeTab === 'completed' && (
          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            {completedChallengesList.length > 0 ? (
              completedChallengesList.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id}
                  challenge={challenge}
                  onComplete={() => {}}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Award size={40} color="#64748B" />
                <Text style={styles.emptyStateText}>No completed challenges yet</Text>
                <Text style={styles.emptyStateSubtext}>Complete active challenges to see them here</Text>
              </View>
            )}
          </Animated.View>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ChallengeCard({ challenge, onComplete }: any) {
  const getCategoryColor = () => {
    switch (challenge.category) {
      case 'electricity':
        return '#FBBF24';
      case 'transport':
        return '#38BDF8';
      case 'consumption':
        return '#A78BFA';
      default:
        return '#10B981';
    }
  };
  
  const progressPercentage = (challenge.progress / challenge.total) * 100;
  const color = getCategoryColor();
  
  const daysLeft = () => {
    const endDate = new Date(challenge.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  return (
    <View style={styles.challengeCard}>
      <View style={[styles.challengeBadge, { backgroundColor: `${color}20` }]}>
        <Award size={24} color={color} />
      </View>
      
      <View style={styles.challengeContent}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>
        
        <View style={styles.challengeProgressContainer}>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercentage}%`, backgroundColor: color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {challenge.progress}/{challenge.total} {challenge.isActive ? 'completed' : 'days'}
          </Text>
        </View>
        
        <View style={styles.challengeFooter}>
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardLabel}>Reward:</Text>
            <Text style={[styles.rewardValue, { color }]}>
              {challenge.reward} Points
            </Text>
          </View>
          
          {challenge.isActive ? (
            daysLeft() > 0 ? (
              <View style={styles.timeLeftContainer}>
                <Clock size={14} color="#64748B" />
                <Text style={styles.timeLeftText}>{daysLeft()} days left</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.completeButton, { backgroundColor: color }]}
                onPress={() => onComplete(challenge.id)}
              >
                <Text style={styles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.completedBadge}>
              <CheckCircle size={14} color="#10B981" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function LeaderboardSection() {
  const leaderboardData = [
    { rank: 1, name: 'Sarah J.', points: 1200, avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { rank: 2, name: 'Alex M.', points: 1050, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { rank: 3, name: 'Jamie K.', points: 980, avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { rank: 4, name: 'Taylor B.', points: 850, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { rank: 5, name: 'Jordan T.', points: 820, avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { rank: 6, name: 'You', points: 765, isCurrentUser: true, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { rank: 7, name: 'Casey L.', points: 720, avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  ];
  
  return (
    <View style={styles.leaderboardContainer}>
      <View style={styles.leaderboardHeader}>
        <View style={styles.leaderboardTitle}>
          <Users size={20} color="#10B981" />
          <Text style={styles.leaderboardTitleText}>Global Leaderboard</Text>
        </View>
        <TouchableOpacity style={styles.leaderboardAction}>
          <Text style={styles.leaderboardActionText}>This Week</Text>
          <ChevronRight size={16} color="#10B981" />
        </TouchableOpacity>
      </View>
      
      {leaderboardData.map((item) => (
        <View
          key={item.rank}
          style={[
            styles.leaderboardItem,
            item.isCurrentUser && styles.currentUserItem
          ]}
        >
          <Text style={[
            styles.rankText,
            item.rank <= 3 && styles.topRankText,
            item.isCurrentUser && styles.currentUserRankText
          ]}>
            {item.rank}
          </Text>
          
          <View style={styles.userContainer}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <Text style={[
              styles.userName,
              item.isCurrentUser && styles.currentUserName
            ]}>
              {item.name}
            </Text>
          </View>
          
          <Text style={[
            styles.pointsText,
            item.isCurrentUser && styles.currentUserPointsText
          ]}>
            {item.points} pts
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    color: '#94A3B8',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  challengeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  challengeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
    marginBottom: 12,
  },
  challengeProgressContainer: {
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
    marginRight: 4,
  },
  rewardValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  timeLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLeftText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
  completeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  completeButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#10B981',
    marginLeft: 4,
  },
  emptyState: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  leaderboardContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leaderboardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardTitleText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  leaderboardAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardActionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#10B981',
    marginRight: 4,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  currentUserItem: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    marginVertical: 4,
    borderBottomWidth: 0,
    paddingHorizontal: 8,
  },
  rankText: {
    width: 30,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    textAlign: 'center',
  },
  topRankText: {
    color: '#F59E0B',
  },
  currentUserRankText: {
    color: '#10B981',
  },
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  currentUserName: {
    fontFamily: 'Poppins-SemiBold',
    color: '#10B981',
  },
  pointsText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  currentUserPointsText: {
    color: '#10B981',
  },
  bottomSpacer: {
    height: 100,
  },
});