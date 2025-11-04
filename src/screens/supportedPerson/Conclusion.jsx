import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ou use react-native-vector-icons

export default function SucessoScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Ionicons name="heart" size={40} color="#9C6ADE" style={styles.icon} />

            <Text style={styles.title}>Seu pedido foi enviado com sucesso!</Text>

            <Text style={styles.subtitle}>
                Recebemos a sua mensagem. Em breve vamos entrar em contato para te
                ajudar da melhor forma possível.
            </Text>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("Wishe")}
            >
                <Text style={styles.backText}>Voltar para a página inicial</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4E9FB",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#9C6ADE",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        textAlign: "center",
        color: "#B299D6",
        marginBottom: 40,
        lineHeight: 22,
    },
    backButton: {
        position: "absolute",
        bottom: 40,
    },
    backText: {
        color: "#9C6ADE",
        fontSize: 15,
        fontWeight: "600",
    },
});
