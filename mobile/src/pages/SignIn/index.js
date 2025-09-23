import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SignIn() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Please enter your credentials.</Text>
    </View>
  );
}