import React from "react";
import { 
  View, 
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";

import * as Animatable from 'react-native-animatable';

import { useNavigation } from "@react-navigation/native";

export default function Welcome() {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require("../../assets/Background.jpeg")} style={styles.container} resizeMode="cover">
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require("../../assets/Logo.png")}
          style={{ width: '100%', height: undefined, aspectRatio: 3 }}
          resizeMode="contain"
        />
      </View>

      <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>

        <Text style={styles.title}>Odisseia Card Game - Late Pledge</Text>
        <Text style={styles.text}>Faça o login para começar a jogar</Text>

        <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('Setup') }>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </Animatable.View>
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
    paddingEnd: '5%'
  },

  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12
  },

  text:{
    color: '#a1a1a1'
  },

  button:{
    position: 'absolute',
    backgroundColor: '#243A73',
    borderRadius: 50,
    paddingVertical: 8,
    width: '60%',
    alignSelf: 'center',
    bottom: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText:{
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  }
})