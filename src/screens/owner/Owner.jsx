import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Owner({ navigation }) {
    const [mensagens, setMensagens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveRequests();
    }, []);

    const fetchActiveRequests = async () => {
        try {
            const token = await AsyncStorage.getItem("@accessToken");

            if (!token) {
                console.warn("Token não encontrado");
                return;
            }

            const response = await fetch(
                "https://ampara-api-1028004784154.us-central1.run.app/request/mediator/active",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar pedidos ativos");
            }

            const data = await response.json();
            setMensagens(data);
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleButton = (requestId, userMessage) => {
        navigation.navigate("OwnerDetails", {
            requestId,
            userMessage,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vinda</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#9C83D6" />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {mensagens.length === 0 ? (
                        <Text style={styles.emptyText}>
                            Nenhum pedido ativo no momento
                        </Text>
                    ) : (
                        mensagens.map((msg) => (
                            <View key={msg._id} style={styles.card}>
                                <Text style={styles.cardTitle}>Mensagem</Text>

                                <Text style={styles.messageText}>
                                    {msg.userMessage}
                                </Text>

                                <View style={styles.amparosContainer}>
                                    <Ionicons
                                        name="heart"
                                        size={20}
                                        color="#9C83D6"
                                    />
                                    <Text style={styles.amparosLabel}>
                                        Amparos recebidos:{" "}
                                    </Text>
                                    <Text style={styles.amparosValue}>
                                        {msg.amparos ?? 0} amparos
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() =>
                                        handleButton(
                                            msg._id,
                                            msg.userMessage
                                        )
                                    }
                                >
                                    <Text style={styles.buttonText}>
                                        Analisar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4E7FF",
        paddingTop: 50,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 25,
        marginBottom: 20,
    },

    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "600",
        color: "#9C83D6",
        marginBottom: 20,
    },

    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    card: {
        backgroundColor: "#E5D5F5",
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#8B75C9",
        marginBottom: 10,
    },

    messageText: {
        fontSize: 15,
        color: "#7C69B0",
        marginBottom: 15,
        lineHeight: 22,
    },

    amparosContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    amparosLabel: {
        fontSize: 15,
        color: "#8B75C9",
        marginLeft: 6,
    },

    amparosValue: {
        fontSize: 15,
        color: "#8B75C9",
        fontWeight: "600",
    },

    button: {
        borderWidth: 2,
        borderColor: "#9C83D6",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    buttonText: {
        color: "#9C83D6",
        fontSize: 16,
        fontWeight: "600",
    },

    emptyText: {
        textAlign: "center",
        color: "#8B75C9",
        fontSize: 16,
        marginTop: 40,
    },
});
