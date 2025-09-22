import { View, Text, StyleSheet } from "react-native"

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hello World</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        justifyContent: "center",
    },
    title: {
        color: "red",
        fontSize: 24,
        fontWeight: "bold",
    },
})