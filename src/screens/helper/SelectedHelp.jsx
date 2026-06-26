import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function SelectedHelp({ navigation, route }) {
    const { requestId, userMessage } = route.params;

    const [loading, setLoading] = useState(false);

    const mensagem =
        userMessage ||
        "Oi, estou passando por um momento difícil. Preciso de alguém para conversar, entender meus sentimentos e me ajudar a encontrar caminhos para seguir em frente.";

    const handleAvailableSupporter = async () => {
        try {
            setLoading(true);

            const accessToken = await AsyncStorage.getItem("@accessToken");

            const response = await fetch(
                `https://ampara-api-1028004784154.us-central1.run.app/request/offer-support/${requestId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.log("Erro ao amparar:", errorText);
                throw new Error("Erro ao amparar pessoa");
            }

            navigation.navigate("Conclusion", {
                from: "SelectedHelp",
                requestId,
            });
        } catch (error) {
            console.log("Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
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
                    onPress={handleAvailableSupporter}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonPrimaryText}>
                            Amparar pessoa
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    disabled={loading}
                >
                    <Text style={styles.backButtonText}>
                        Voltar para a página inicial
                    </Text>
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
        paddingTop: 60,
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
        justifyContent: "center",
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
        justifyContent: "center",
        minHeight: 52,
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
