import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import api from "../../servicers/api";

import * as Animatable from 'react-native-animatable';

import { useNavigation } from "@react-navigation/native";

export default function Cadastro() {
  const navigation = useNavigation();

  const [nome, setNome] = React.useState("");
  const [idade, setIdade] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const handleCadastro = async () => {
    try {
      const response = await api.post("/cadastrar", {
        nome,
        idade,
        email,
        senha,
      });
      console.log("Usuário cadastrado com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

  return (
    <ImageBackground source={require("../../assets/Background.jpeg")} style={styles.container} resizeMode="cover">
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Cadastre-se</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>
        <TextInput 
          placeholder="Digite seu nome..." 
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.title}>Idade</Text>
        <TextInput 
          placeholder="Digite sua idade..." 
          style={styles.input}
          value={idade}
          onChangeText={setIdade}
        />

        <Text style={styles.title}>Email</Text>
        <TextInput 
          placeholder="Digite seu email..." 
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.title}>Senha</Text>
        <TextInput 
          placeholder="Digite sua senha..." 
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('SignIn'); handleCadastro(); }}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

      </Animatable.View>
    </ImageBackground>
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