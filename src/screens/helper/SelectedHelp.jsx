import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SelectedHelp({ navigation, route }) {
    const origem = route.params?.from;
    const mensagem =
        route?.params?.mensagem ||
        "Oi, estou passando por um momento difícil. Preciso de alguém para conversar, entender meus sentimentos e me ajudar a encontrar caminhos para seguir em frente.";

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="menu" size={28} color="#9C6ADE" />
                <Ionicons name="notifications-outline" size={28} color="#9C6ADE" />
            </View>

            {/* Título */}
            <Text style={styles.title}>
                Você deseja amparar a pessoa com a mensagem abaixo?
            </Text>

            {/* Card centralizado */}
            <View style={styles.centerContainer}>
                <View style={styles.card}>
                    <Text style={styles.cardText}>{mensagem}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={() => navigation.navigate('Conclusion', { from: "SelectedsHelp" })}
                >
                    <Text style={styles.buttonPrimaryText}>Amparar pessoa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>Voltar para a página inicial</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4E9FB",
        paddingHorizontal: 24,
        paddingTop: 60
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        textAlign: "center",
        color: "#9C6ADE",
        fontWeight: "700",
        lineHeight: 26,
        marginTop: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center", // 🔹 Centraliza verticalmente o card
        alignItems: "center",
    },
    card: {
        backgroundColor: "#DDC7F9",
        borderRadius: 16,
        padding: 20,
        width: "100%",
    },
    cardText: {
        color: "#6E56A3",
        fontSize: 15,
        lineHeight: 22,
    },
    footer: {
        marginBottom: 30,
    },
    buttonPrimary: {
        backgroundColor: "#9C86E0",
        paddingVertical: 14,
        borderRadius: 14,
        width: "100%",
        alignItems: "center",
    },
    buttonPrimaryText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
    backButton: {
        marginTop: 16,
        alignItems: "center",
    },
    backButtonText: {
        color: "#9C6ADE",
        fontSize: 15,
        fontWeight: "600",
    },
});
