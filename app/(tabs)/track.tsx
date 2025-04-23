import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Zap, Car, ShoppingBag, ChevronDown, Plus, Check } from 'lucide-react-native';
import { SegmentedButtons } from '@/components/SegmentedButtons';
import { carbonCalculator } from '@/utils/carbonCalculator';

const habitCategories = [
  { id: 'electricity', label: 'Electricity', icon: <Zap size={20} color="#FBBF24" /> },
  { id: 'transport', label: 'Transport', icon: <Car size={20} color="#38BDF8" /> },
  { id: 'consumption', label: 'Consumption', icon: <ShoppingBag size={20} color="#A78BFA" /> },
];

export default function TrackScreen() {
  const [selectedCategory, setSelectedCategory] = useState('electricity');
  const [formData, setFormData] = useState({
    electricity: { value: '', unit: 'kWh' },
    transport: { value: '', unit: 'km', mode: 'car' },
    consumption: { value: '', unit: 'items', type: 'plastic' },
  });
  const [submittedEntries, setSubmittedEntries] = useState<any[]>([]);

  const handleValueChange = (text: string) => {
    setFormData({
      ...formData,
      [selectedCategory]: {
        ...formData[selectedCategory as keyof typeof formData],
        value: text
      }
    });
  };

  const handleUnitChange = (unit: string) => {
    setFormData({
      ...formData,
      [selectedCategory]: {
        ...formData[selectedCategory as keyof typeof formData],
        unit
      }
    });
  };

  const handleModeChange = (mode: string) => {
    setFormData({
      ...formData,
      transport: {
        ...formData.transport,
        mode
      }
    });
  };

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      consumption: {
        ...formData.consumption,
        type
      }
    });
  };

  const handleSubmit = () => {
    const currentData = formData[selectedCategory as keyof typeof formData];
    
    if (!currentData.value || parseFloat(currentData.value) <= 0) {
      return;
    }
    
    // Calculate carbon impact based on the input
    const carbonImpact = carbonCalculator({
      category: selectedCategory,
      value: parseFloat(currentData.value),
      unit: currentData.unit,
      mode: selectedCategory === 'transport' ? formData.transport.mode : undefined,
      type: selectedCategory === 'consumption' ? formData.consumption.type : undefined,
    });
    
    // Add to entries
    const newEntry = {
      id: Date.now().toString(),
      category: selectedCategory,
      value: currentData.value,
      unit: currentData.unit,
      mode: selectedCategory === 'transport' ? formData.transport.mode : undefined,
      type: selectedCategory === 'consumption' ? formData.consumption.type : undefined,
      impact: carbonImpact,
      date: new Date().toISOString(),
    };
    
    setSubmittedEntries([newEntry, ...submittedEntries]);
    
    // Reset form value
    setFormData({
      ...formData,
      [selectedCategory]: {
        ...formData[selectedCategory as keyof typeof formData],
        value: ''
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <Animated.View 
        entering={FadeIn.delay(200).duration(600)}
        style={styles.header}
      >
        <Text style={styles.title}>Track Your Impact</Text>
        <Text style={styles.subtitle}>Record daily habits to measure your carbon footprint</Text>
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.categorySection}
        >
          <SegmentedButtons
            buttons={habitCategories}
            selectedId={selectedCategory}
            onPress={setSelectedCategory}
          />
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.formContainer}
        >
          {selectedCategory === 'electricity' && (
            <ElectricityForm 
              value={formData.electricity.value}
              unit={formData.electricity.unit}
              onValueChange={handleValueChange}
              onUnitChange={handleUnitChange}
            />
          )}
          
          {selectedCategory === 'transport' && (
            <TransportForm 
              value={formData.transport.value}
              unit={formData.transport.unit}
              mode={formData.transport.mode}
              onValueChange={handleValueChange}
              onUnitChange={handleUnitChange}
              onModeChange={handleModeChange}
            />
          )}
          
          {selectedCategory === 'consumption' && (
            <ConsumptionForm 
              value={formData.consumption.value}
              type={formData.consumption.type}
              onValueChange={handleValueChange}
              onTypeChange={handleTypeChange}
            />
          )}
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Add Entry</Text>
            <Plus size={18} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View
          entering={FadeInDown.delay(500).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Entries</Text>
          </View>
          
          {submittedEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No entries yet today</Text>
              <Text style={styles.emptyStateSubtext}>Start tracking to see your impact</Text>
            </View>
          ) : (
            submittedEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))
          )}
        </Animated.View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ElectricityForm({ value, unit, onValueChange, onUnitChange }: any) {
  return (
    <View>
      <Text style={styles.formLabel}>How much electricity did you use?</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onValueChange}
          placeholder="0"
          placeholderTextColor="#64748B"
          keyboardType="numeric"
        />
        
        <View style={styles.unitSelector}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'kWh' && styles.unitButtonActive]}
            onPress={() => onUnitChange('kWh')}
          >
            <Text style={[styles.unitButtonText, unit === 'kWh' && styles.unitButtonTextActive]}>kWh</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.helpText}>Enter the amount shown on your electricity meter or bill</Text>
    </View>
  );
}

function TransportForm({ value, unit, mode, onValueChange, onUnitChange, onModeChange }: any) {
  return (
    <View>
      <Text style={styles.formLabel}>How did you travel today?</Text>
      
      <View style={styles.transportModes}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'car' && styles.modeButtonActive]}
          onPress={() => onModeChange('car')}
        >
          <Car size={24} color={mode === 'car' ? '#10B981' : '#64748B'} />
          <Text style={[styles.modeButtonText, mode === 'car' && styles.modeButtonTextActive]}>Car</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modeButton, mode === 'bus' && styles.modeButtonActive]}
          onPress={() => onModeChange('bus')}
        >
          <Car size={24} color={mode === 'bus' ? '#10B981' : '#64748B'} />
          <Text style={[styles.modeButtonText, mode === 'bus' && styles.modeButtonTextActive]}>Bus</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modeButton, mode === 'train' && styles.modeButtonActive]}
          onPress={() => onModeChange('train')}
        >
          <Car size={24} color={mode === 'train' ? '#10B981' : '#64748B'} />
          <Text style={[styles.modeButtonText, mode === 'train' && styles.modeButtonTextActive]}>Train</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.formLabel}>Distance traveled:</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onValueChange}
          placeholder="0"
          placeholderTextColor="#64748B"
          keyboardType="numeric"
        />
        
        <View style={styles.unitSelector}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'km' && styles.unitButtonActive]}
            onPress={() => onUnitChange('km')}
          >
            <Text style={[styles.unitButtonText, unit === 'km' && styles.unitButtonTextActive]}>km</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.unitButton, unit === 'mi' && styles.unitButtonActive]}
            onPress={() => onUnitChange('mi')}
          >
            <Text style={[styles.unitButtonText, unit === 'mi' && styles.unitButtonTextActive]}>mi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ConsumptionForm({ value, type, onValueChange, onTypeChange }: any) {
  return (
    <View>
      <Text style={styles.formLabel}>What did you consume?</Text>
      
      <View style={styles.transportModes}>
        <TouchableOpacity
          style={[styles.modeButton, type === 'plastic' && styles.modeButtonActive]}
          onPress={() => onTypeChange('plastic')}
        >
          <ShoppingBag size={24} color={type === 'plastic' ? '#10B981' : '#64748B'} />
          <Text style={[styles.modeButtonText, type === 'plastic' && styles.modeButtonTextActive]}>Plastic</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modeButton, type === 'meat' && styles.modeButtonActive]}
          onPress={() => onTypeChange('meat')}
        >
          <ShoppingBag size={24} color={type === 'meat' ? '#10B981' : '#64748B'} />
          <Text style={[styles.modeButtonText, type === 'meat' && styles.modeButtonTextActive]}>Meat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modeButton, type === 'water' && styles.modeButtonActive]}
          onPress={() => onTypeChange('water')}
        >
          <ShoppingBag size={24} color={type === 'water' ? '#10B981' : '#64748B'} />
          <Text style={[styles.modeButtonText, type === 'water' && styles.modeButtonTextActive]}>Water</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.formLabel}>Quantity:</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onValueChange}
          placeholder="0"
          placeholderTextColor="#64748B"
          keyboardType="numeric"
        />
        
        <View style={styles.unitSelector}>
          <Text style={styles.staticUnit}>items</Text>
        </View>
      </View>
    </View>
  );
}

function EntryCard({ entry }: { entry: any }) {
  const getIcon = () => {
    switch (entry.category) {
      case 'electricity':
        return <Zap size={20} color="#FBBF24" />;
      case 'transport':
        return <Car size={20} color="#38BDF8" />;
      case 'consumption':
        return <ShoppingBag size={20} color="#A78BFA" />;
      default:
        return null;
    }
  };
  
  const getLabel = () => {
    switch (entry.category) {
      case 'electricity':
        return `${entry.value} ${entry.unit} used`;
      case 'transport':
        return `${entry.value} ${entry.unit} by ${entry.mode}`;
      case 'consumption':
        return `${entry.value} ${entry.type} items`;
      default:
        return '';
    }
  };
  
  return (
    <View style={styles.entryCard}>
      <View style={styles.entryIconContainer}>
        {getIcon()}
      </View>
      <View style={styles.entryContent}>
        <Text style={styles.entryLabel}>{getLabel()}</Text>
        <Text style={styles.entryTime}>Today, {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      <View style={styles.entryImpact}>
        <Text style={styles.entryImpactValue}>{entry.impact.toFixed(1)} kg</Text>
        <Text style={styles.entryImpactLabel}>CO₂</Text>
      </View>
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
  scrollView: {
    flex: 1,
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    overflow: 'hidden',
  },
  unitButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#10B981',
  },
  unitButtonText: {
    color: '#94A3B8',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  staticUnit: {
    color: '#94A3B8',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  helpText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
    marginBottom: 16,
  },
  transportModes: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  modeButtonText: {
    color: '#64748B',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  modeButtonTextActive: {
    color: '#10B981',
    fontFamily: 'Poppins-SemiBold',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginRight: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  entryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  entryContent: {
    flex: 1,
  },
  entryLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  entryTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
  },
  entryImpact: {
    alignItems: 'flex-end',
  },
  entryImpactValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  entryImpactLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
  },
  bottomSpacer: {
    height: 100,
  },
});