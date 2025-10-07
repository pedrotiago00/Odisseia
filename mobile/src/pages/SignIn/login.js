import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity 
} from "react-native";

import api from "../../servicers/api";

import { LinearGradient } from "expo-linear-gradient";

import * as Animatable from 'react-native-animatable';

import { useNavigation } from "@react-navigation/native";

export default function SignIn() {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/cadastrar", {
        email,
        senha,
      });
      console.log("Login bem-sucedido:", response.data);
    } catch (error) {
      console.error("Erro ao logar:", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#243A73", "#2E4C8A"]} style={styles.container}>

      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Bem-vindo ao Odisseia Card Game</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <TextInput 
          placeholder="Digite seu email..." 
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.title}>Senha</Text>
        <TextInput 
          placeholder="Digite sua senha..." 
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Jogo'); handleLogin(); }}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRegister} onPress={ () => navigation.navigate('Cadastro') }>
          <Text style={styles.buttonText}>Não possui uma conta? Cadastre-se</Text>
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