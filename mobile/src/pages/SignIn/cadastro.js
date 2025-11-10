import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
// Importa o 'api' (axios) para fazer requisições
import api from "../../servicers/api";

// Importa a biblioteca para animações
import * as Animatable from 'react-native-animatable';

// Importa o hook para navegação
import { useNavigation } from "@react-navigation/native";

export default function Cadastro() {
  const navigation = useNavigation();

  // --- Estados do Formulário ---
  // Armazena o que o usuário digita em cada campo
  const [nome, setNome] = React.useState("");
  const [idade, setIdade] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  /**
   * Função chamada ao pressionar o botão "Cadastrar".
   * Envia os dados do formulário para a API.
   */
  const handleCadastro = async () => {
    try {
      // 1. Tenta fazer um POST para a rota de cadastro com os dados do state
      const response = await api.post("/usuarios/cadastrar", {
        nome,
        idade,
        email,
        senha,
      });
      // 2. Se der certo, loga a resposta e...
      console.log("Usuário cadastrado com sucesso:", response.data);
      // 3. ...navega o usuário de volta para a tela de Login
      navigation.navigate('SignIn');
      
    } catch (error) {
      // 4. Se der errado (ex: email já existe), loga o erro e avisa o usuário
      console.error("Erro ao cadastrar usuário:", error);
      alert("Falha no cadastro. Tente novamente.");
    }
  };

  return (
    // Imagem de fundo cobrindo a tela
    <ImageBackground source={require("../../assets/Background.jpeg")} style={styles.container} resizeMode="cover">
      
      {/* Cabeçalho animado */}
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Cadastre-se</Text>
      </Animatable.View>

      {/* Formulário animado */}
      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>
        <TextInput 
          placeholder="Digite seu nome..." 
          style={styles.input}
          value={nome}
          onChangeText={setNome} // Atualiza o state 'nome' ao digitar
        />

        <Text style={styles.title}>Idade</Text>
        <TextInput 
          placeholder="Digite sua idade..." 
          style={styles.input}
          value={idade}
          onChangeText={setIdade} // Atualiza o state 'idade'
        />

        <Text style={styles.title}>Email</Text>
        <TextInput 
          placeholder="Digite seu email..." 
          style={styles.input}
          value={email}
          onChangeText={setEmail} // Atualiza o state 'email'
        />
        <Text style={styles.title}>Senha</Text>
        <TextInput 
          placeholder="Digite sua senha..." 
          style={styles.input}
          value={senha}
          onChangeText={setSenha} // Atualiza o state 'senha'
        />

        {/* Botão de Cadastro */}
        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

      </Animatable.View>
    </ImageBackground>
  );
}

// Estilos
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
  // Note: Havia dois 'buttonText' aqui, o que é um pequeno bug no seu CSS.
  // O 'buttonRegisterText' abaixo está sendo sobrescrito pelo 'buttonText' de cima.
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center',
  },
  buttonText: { // Este estilo está duplicado e sendo ignorado
    color: '#a1a1a1',
  }
});