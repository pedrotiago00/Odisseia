import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Menu() {
  const navigation = useNavigation();

  const botoes = [
    { label: "Iniciar Jogo", route: "Setup" },
    { label: "Marcador de Vida", route: "Setup" },
    { label: "Deck", route: "Deck" },
    { label: "Campeonato", route: "Campeonato" },
    { label: "Modo Solo", route: "Setup" },
  ];

  return (
    <ImageBackground 
      source={require("../../assets/BackgroundMenu.png")} 
      style={styles.container}
      blurRadius={2}
    >
      <View style={styles.overlay} />

      <Animatable.View 
        animation="fadeInDown"
        duration={1200}
        style={styles.header}
      >
        <Text style={styles.title}>ODISSEIA</Text>
        <Text style={styles.subtitle}>Escolha seu modo de jogo</Text>
      </Animatable.View>

      <Animatable.View 
        animation="fadeInUp"
        duration={1200}
        delay={400}
        style={styles.buttonContainer}
      >
        {botoes.map((btn, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(btn.route)}
          >
            <Text style={styles.buttonText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </Animatable.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 3,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 8,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    gap: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "rgba(36,58,115,0.9)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    borderWidth: 1,
    borderColor: "#4A69BD",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});