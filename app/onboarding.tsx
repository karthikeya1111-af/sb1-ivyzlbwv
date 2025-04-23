import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ArrowRight, Leaf } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PAGES = [
  {
    title: "Track Your Impact",
    description: "Monitor your daily habits like electricity use, transportation choices, and consumption patterns to see your carbon footprint.",
    image: "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Earn Eco-Points",
    description: "Make eco-friendly choices and earn points that help you level up your eco-avatar and climb the leaderboards.",
    image: "https://images.pexels.com/photos/3519441/pexels-photo-3519441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Complete Challenges",
    description: "Take on weekly eco-challenges to reduce your carbon footprint and earn special badges and rewards.",
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Make a Difference",
    description: "Join a community of earth-conscious individuals and see the collective impact of your sustainable choices.",
    image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  }
];

export default function Onboarding() {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentPage < PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
      scrollViewRef.current?.scrollTo({ x: width * (currentPage + 1), animated: true });
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Animated.View 
        entering={FadeIn.delay(200).duration(600)} 
        style={styles.skipContainer}
      >
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {PAGES.map((page, index) => (
          <View key={index} style={[styles.page, { width }]}>
            <Animated.View 
              entering={FadeIn.delay(300).duration(800)} 
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: page.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.overlay} />
            </Animated.View>
            
            <Animated.View 
              entering={FadeInUp.delay(500).duration(800)} 
              style={styles.content}
            >
              <View style={styles.logoContainer}>
                <Leaf color="#10B981" size={32} />
                <Text style={styles.logoText}>CarbonCutter</Text>
              </View>
              
              <Text style={styles.title}>{page.title}</Text>
              <Text style={styles.description}>{page.description}</Text>
            </Animated.View>
          </View>
        ))}
      </ScrollView>
      
      <Animated.View 
        entering={FadeInDown.delay(800).duration(600)} 
        style={styles.footer}
      >
        <View style={styles.paginationContainer}>
          {PAGES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentPage && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentPage === PAGES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  skipContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: '#94A3B8',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  page: {
    flex: 1,
  },
  imageContainer: {
    height: '55%',
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  description: {
    color: '#94A3B8',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
    marginRight: 8,
  },
  paginationDotActive: {
    backgroundColor: '#10B981',
    width: 24,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginRight: 8,
  },
});