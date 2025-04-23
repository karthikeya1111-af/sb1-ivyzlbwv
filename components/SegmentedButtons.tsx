import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SegmentedButtonProps {
  buttons: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  selectedId: string;
  onPress: (id: string) => void;
}

export function SegmentedButtons({ buttons, selectedId, onPress }: SegmentedButtonProps) {
  return (
    <View style={styles.container}>
      {buttons.map((button) => (
        <TouchableOpacity
          key={button.id}
          style={[
            styles.button,
            selectedId === button.id && styles.buttonSelected
          ]}
          onPress={() => onPress(button.id)}
        >
          {button.icon && (
            <View style={styles.iconContainer}>
              {button.icon}
            </View>
          )}
          <Text style={[
            styles.buttonText,
            selectedId === button.id && styles.buttonTextSelected
          ]}>
            {button.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    backgroundColor: '#10B981',
  },
  iconContainer: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
  },
  buttonTextSelected: {
    color: '#FFFFFF',
  },
});