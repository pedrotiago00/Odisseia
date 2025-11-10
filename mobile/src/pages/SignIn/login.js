import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ImageBackground,
} from "react-native";
// IMPORTADO: Nosso adaptador de storage universal (Web/Mobile)
import storage from "../../servicers/storage";

// Importa o 'api' (axios)
import api from "../../servicers/api";

import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";

export default function SignIn() {
  const navigation = useNavigation();

  // --- Estados do Formulário ---
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  /**
   * Função chamada ao pressionar "Entrar".
   * Valida, envia para a API, e salva o token se tiver sucesso.
   */
  const handleLogin = async () => {
    // 1. Validação simples para não enviar requisição à toa
    if (!email || !senha) {
        alert("Por favor, preencha o email e a senha.");
        return;
    }
    try {
      // 2. Tenta fazer o POST para a rota de login
      const response = await api.post("/usuarios/login", {
        email,
        senha,
      });
      console.log("Login bem-sucedido:", response.data);

      // 3. Pega o token e os dados do usuário da resposta
      const { token, usuario } = response.data;

      // 4. Salva o token e o usuário no storage universal
      await storage.setItem('token', token);
      await storage.setItem('usuario', JSON.stringify(usuario)); // Salva o objeto do usuário como string
      
      // 5. SÓ DEPOIS DE SALVAR, navega para o Menu principal
      navigation.navigate('Menu');

    } catch (error) {
      // 6. Se der erro (ex: senha errada)
      console.error("Erro ao logar:", error.response?.data || error.message);
      // Mostra a mensagem de erro específica vinda do backend (ex: "Email ou senha inválidos")
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
          autoCapitalize="none" // Facilita a digitação de email
        />
        <Text style={styles.title}>Senha</Text>
        <TextInput 
          placeholder="Digite sua senha..." 
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true} // Esconde a senha
        />

        {/* Botão de Login */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Botão para ir ao Cadastro */}
        <TouchableOpacity style={styles.buttonRegister} onPress={ () => navigation.navigate('Cadastro') }>
          {/* Corrigido: O estilo aqui deve ser 'buttonRegisterText' */}
          <Text style={styles.buttonRegisterText}>Não possui uma conta? Cadastre-se</Text>
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center',
  },
  // Corrigido: Nome do estilo para o texto de cadastro
  buttonRegisterText: {
    color: '#a1a1a1',
  }
});