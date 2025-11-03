import React, { useEffect, useState } from "react";
import { 
  View, 
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator
} from "react-native";

import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';

export default function Welcome() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          navigation.replace('Menu'); // Vai direto para o Menu
        } else {
          setIsLoading(false); // Não tem token, mostra login
        }
      } catch (e) {
        console.error("Falha ao checar token:", e);
        setIsLoading(false);
      }
    };

    // Splash de 1.5 segundos antes de checar token
    setTimeout(() => {
      checkToken();
    }, 1500);

  }, [navigation]);

  return (
    <ImageBackground 
      source={require("../../assets/Background.jpeg")} 
      style={styles.container} 
      resizeMode="cover"
    >
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require("../../assets/Logo.png")}
          style={{ width: '100%', height: undefined, aspectRatio: 3 }}
          resizeMode="contain"
        />
      </View>

      {isLoading ? (
        // Spinner enquanto verifica token
        <ActivityIndicator size="large" color="#FFFFFF" style={{ flex: 1 }} />
      ) : (
        // Formulário de login
        <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Odisseia Card Game - Late Pledge</Text>
          <Text style={styles.text}>Faça o login para começar a jogar</Text>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.buttonText}>Acessar</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerLogo:{
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerForm:{
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
    textAlign: 'center'
  },
  text:{
    color: '#a1a1a1',
    textAlign: 'center',
    marginBottom: 20
  },
  button:{
    backgroundColor: '#243A73',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText:{
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  }
});
