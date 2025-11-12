import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import styles from './styles';

export default function CircularCounters({ counters, icons, onOpenModal }) {
  return (
    <>
      {counters.map((value, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.sealButton}
          onPress={() => onOpenModal(index, value)}
        >
          <ImageBackground source={icons[index]} style={styles.sealBackground} resizeMode="contain">
            <Text style={styles.sealValue}>{value}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </>
  );
}