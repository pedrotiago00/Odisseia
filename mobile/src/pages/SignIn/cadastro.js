import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as Animatable from 'react-native-animatable';

export default function Cadastro() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#243A73", "#2E4C8A"]} style={styles.container}>

      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Cadastre-se</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>
        <TextInput 
          placeholder="Digite seu nome..." 
          style={styles.input}
        />

        <Text style={styles.title}>Idade</Text>
        <TextInput 
          placeholder="Digite sua idade..." 
          style={styles.input}
        />

        <Text style={styles.title}>Email</Text>
        <TextInput 
          placeholder="Digite seu email..." 
          style={styles.input}
        />
        <Text style={styles.title}>Senha</Text>
        <TextInput 
          placeholder="Digite sua senha..." 
          style={styles.input}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

      </Animatable.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },

  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  containerForm: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },

  title: {
    fontSize: 20,
    marginTop: 28,
  },

  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#243A73',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#a1a1a1',
  }
});