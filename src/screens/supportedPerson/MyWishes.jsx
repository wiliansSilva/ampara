import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    FlatList,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MeusPedidos({ navigation }) {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    /** 🔹 Busca pedidos do usuário */
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = await AsyncStorage.getItem("@accessToken");

                const response = await fetch(
                    "https://ampara-api-1028004784154.us-central1.run.app/request/user",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao buscar pedidos");
                }

                const data = await response.json();

                const formattedData = data.map((item) => ({
                    id: item._id,
                    titulo: "Mensagem enviada",
                    mensagem: item.userMessage,
                    status: formatStatus(item.status),
                }));

                setPedidos(formattedData);
            } catch (error) {
                console.log(error);
                Alert.alert(
                    "Erro",
                    "Não foi possível carregar seus pedidos"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    /** 🔹 Padroniza status */
    const formatStatus = (status) => {
        switch (status) {
            case "pending":
                return "Aguardando";
            case "in_progress":
                return "Em andamento";
            case "finished":
                return "Concluído";
            default:
                return status;
        }
    };

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>

            <Text style={styles.cardMessage}>{item.mensagem}</Text>

            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusValue}>{item.status}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8D9F0" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="menu" size={28} color="#8B7BA8" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons
                        name="notifications-outline"
                        size={28}
                        color="#8B7BA8"
                    />
                </TouchableOpacity>
            </View>

            {/* Título */}
            <Text style={styles.title}>Meus pedidos</Text>

            {/* Loader */}
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#9F7FD4"
                    style={{ marginTop: 40 }}
                />
            ) : (
                <FlatList
                    data={pedidos}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Botão Voltar */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E8D9F0",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    menuButton: {
        padding: 5,
    },
    notificationButton: {
        padding: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        color: "#9F7FD4",
        textAlign: "center",
        marginTop: 30,
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    card: {
        backgroundColor: "#D9C9E8",
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#9F7FD4",
        marginBottom: 16,
    },
    cardMessage: {
        fontSize: 15,
        color: "#8B7BA8",
        lineHeight: 22,
        marginBottom: 24,
    },
    statusLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#9F7FD4",
        marginBottom: 8,
    },
    statusValue: {
        fontSize: 15,
        color: "#8B7BA8",
    },
    backButton: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: "#E8D9F0",
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#9F7FD4",
    },
});
