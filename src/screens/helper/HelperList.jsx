import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function HelperList({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);

    const handleRequests = async () => {
        try {
            setLoading(true);

            const accessToken = await AsyncStorage.getItem("@accessToken");

            if (!accessToken) {
                console.warn("Token não encontrado");
                return;
            }

            console.log("Token", accessToken);

            const response = await fetch(
                "https://ampara-api-1028004784154.us-central1.run.app/request/helper/active",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                }
            );

            console.log("Status da resposta:", response.status);

            if (!response.ok) {
                throw new Error("Erro ao buscar pedidos");
            }

            const data = await response.json();
            console.log(data)
            setRequests(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Chama ao abrir a tela
    useEffect(() => {
        handleRequests();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="menu" size={28} color="#9C6ADE" />
                    <Ionicons name="notifications-outline" size={28} color="#9C6ADE" />
                </View>

                {/* Título */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Pedidos de amparos</Text>
                    <Text style={styles.subtitle}>
                        Selecione uma mensagem abaixo para oferecer sua ajuda ou suporte
                    </Text>
                </View>

                {/* Loader ou Lista */}
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#9C6ADE" />
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {requests.length === 0 ? (
                            <Text style={styles.emptyText}>
                                Nenhum pedido disponível no momento
                            </Text>
                        ) : (
                            requests.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() =>
                                        navigation.replace("SelectedsHelp", {
                                            requestId: item._id,
                                            userMessage: item.userMessage,
                                        })
                                    }
                                >
                                    <Text style={styles.cardText}>
                                        {item.userMessage ?? "Pedido sem descrição"}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                )}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F4E9FB",
    },
    container: {
        flex: 1,
        backgroundColor: "#F4E9FB",
        paddingTop: 20,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    titleContainer: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#9C6ADE",
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        color: "#B299D6",
        marginTop: 5,
        paddingHorizontal: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    scrollContainer: {
        paddingTop: 20,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: "#DDC7F9",
        borderRadius: 16,
        padding: 18,
        marginBottom: 15,
    },
    cardText: {
        color: "#6E56A3",
        fontSize: 15,
        lineHeight: 22,
    },
    emptyText: {
        textAlign: "center",
        color: "#9C6ADE",
        marginTop: 40,
        fontSize: 14,
    },
});
