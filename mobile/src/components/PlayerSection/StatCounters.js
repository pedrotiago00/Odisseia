import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';

export default function StatCounters({ stats, onOpenModal, onOpenIconModal }) {
  return (
    <>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statItem}>
          {/* Botão para o ÍCONE */}
          <TouchableOpacity onPress={() => onOpenIconModal(index)}>
            <Image source={stat.icon} style={styles.statIcon} resizeMode="contain" />
          </TouchableOpacity>
          {/* Botão para o VALOR */}
          <TouchableOpacity onPress={() => onOpenModal(index, stat.value)}>
            <Text style={styles.statValue}>{stat.value}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
}