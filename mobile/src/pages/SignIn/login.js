import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ImageBackground,
} from "react-native";
// REMOVIDO: import * as SecureStore from 'expo-secure-store'; 
// IMPORTADO: Nosso adaptador de storage
import storage from "../../servicers/storage"; 

import api from "../../servicers/api";

import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";

export default function SignIn() {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
        alert("Por favor, preencha o email e a senha.");
        return;
    }
    try {
      const response = await api.post("/usuarios/login", {
        email,
        senha,
      });
      console.log("Login bem-sucedido:", response.data);

      const { token, usuario } = response.data;

      // CORRIGIDO: Salva o token e os dados usando o 'storage'
      await storage.setItem('token', token);
      await storage.setItem('usuario', JSON.stringify(usuario)); // Salva o usuário como texto
      
      // 4. SÓ DEPOIS DE SALVAR, NAVEGUE PARA O MENU
      navigation.navigate('Menu');

    } catch (error) {
      console.error("Erro ao logar:", error.response?.data || error.message);
      // Informa o erro específico do backend (ex: "Email ou senha inválidos")
      alert(`Falha no login: ${error.response?.data?.message || 'Verifique suas credenciais.'}`);
    }
  };

  return (
    <ImageBackground source={require("../../assets/Background.jpeg")} style={styles.container} resizeMode="cover">    
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
          autoCapitalize="none" // Desativa o auto-capitalize
        />
        <Text style={styles.title}>Senha</Text>
        <TextInput 
          placeholder="Digite sua senha..." 
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRegister} onPress={ () => navigation.navigate('Cadastro') }>
          {/* Este Text estava com o estilo errado, corrigi */}
          <Text style={styles.buttonRegisterText}>Não possui uma conta? Cadastre-se</Text>
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
  // Corrigido: Havia dois 'buttonText', renomeei este
  buttonRegisterText: {
    color: '#a1a1a1',
  }
});