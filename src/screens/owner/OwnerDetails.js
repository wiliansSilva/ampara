import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

export default function OwnerDetails({navigation}) {
    const route = useRoute();
    const { requestId, userMessage } = route.params;

    const [amparadores, setAmparadores] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequestDetails();
    }, []);

    const fetchRequestDetails = async () => {
        try {
            const token = await AsyncStorage.getItem("@accessToken");

            if (!token) return;

            const response = await fetch(
                `https://ampara-api-1028004784154.us-central1.run.app/request/mediator/${requestId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar detalhes do pedido");
            }

            const data = await response.json();
            console.log(data)
            //const request = data.find((item) => item._id === requestId);

            setAmparadores(data.availableSupporters || []);
            setData(data || []);
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Ionicons name="menu" size={34} color="#9C83D6" />
                <Ionicons
                    name="notifications-outline"
                    size={30}
                    color="#9C83D6"
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#9C83D6" />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* ================= MENSAGEM ================= */}
                    <Text style={styles.sectionTitle}>Mensagem</Text>

                    <View style={styles.card}>
                        <Text style={styles.messageText}>
                            {userMessage}
                        </Text>

                        <Text style={styles.timeText}>
                            Pedido em andamento
                        </Text>
                    </View>

                    {/* ================= PESSOA AJUDADA ================= */}
                    <Text style={styles.sectionTitle}>Pessoa ajudada</Text>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Nome</Text>
                            <View style={styles.placeholderName} />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Idade</Text>
                            <Text style={styles.value}>—</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Localidade</Text>
                            <Text style={styles.value}>—</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Histórico</Text>
                            <Text style={styles.value}>Primeiro pedido</Text>
                        </View>
                    </View>

                    {/* ================= AMPARADORES ================= */}
                    <Text style={styles.sectionTitle}>Amparos Recebidos</Text>

                    {amparadores.length === 0 ? (
                        <Text style={styles.emptyText}>
                            Nenhum amparo recebido até o momento
                        </Text>
                    ) : (
                        amparadores.map((item) => (
                            <View key={item.helperId} style={styles.card}>
                                <Text style={styles.nome}>{item.name}</Text>

                                <Text style={styles.descricao}>
                                    {item.descricao}
                                </Text>

                                <Text style={styles.subInfo}>
                                    <Text style={styles.bold}>Localidade </Text>
                                    {item.city + ` (${item.state})`}
                                </Text>

                                <Text style={styles.subInfo}>
                                    <Text style={styles.bold}>Histórico </Text>
                                    {"Já amparou " + item.totalHelpOffered + " pessoas"}
                                </Text>

                                <TouchableOpacity style={styles.button}
                                                  onPress={() =>
                                                      navigation.replace("OwnerDetailsConfirm", {
                                                          data: data,
                                                          helper: item,
                                                          requestId: data._id
                                                      })
                                                  }>
                                    <Text style={styles.buttonText}>
                                        Selecionar
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
        marginBottom: 10,
    },

    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    sectionTitle: {
        fontSize: 20,
        color: "#8B75C9",
        fontWeight: "600",
        marginBottom: 10,
        marginTop: 20,
    },

    card: {
        backgroundColor: "#E5D5F5",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },

    messageText: {
        color: "#7A64B6",
        fontSize: 15,
        lineHeight: 22,
    },

    timeText: {
        marginTop: 10,
        color: "#9C83D6",
        fontSize: 13,
        fontWeight: "600",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    label: {
        color: "#816ABD",
        fontWeight: "600",
        fontSize: 15,
    },

    value: {
        color: "#705CAE",
        fontSize: 15,
    },

    placeholderName: {
        width: 120,
        height: 16,
        backgroundColor: "#BFA7E8",
        borderRadius: 8,
    },

    /* Amparadores */
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    avatar: {
        width: 45,
        height: 45,
        borderRadius: 25,
        marginRight: 12,
    },

    nome: {
        fontSize: 18,
        color: "#775EC5",
        fontWeight: "700",
        marginBottom: 6,
    },

    descricao: {
        color: "#7A64B6",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 14,
    },

    subInfo: {
        color: "#7A64B6",
        fontSize: 14,
        marginBottom: 6,
    },

    bold: {
        fontWeight: "700",
        color: "#775EC5",
    },

    button: {
        marginTop: 14,
        borderWidth: 2,
        borderColor: "#9C83D6",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    buttonText: {
        color: "#9C83D6",
        fontWeight: "600",
        fontSize: 16,
    },

    emptyText: {
        textAlign: "center",
        color: "#8B75C9",
        fontSize: 16,
        marginTop: 10,
    },
});
