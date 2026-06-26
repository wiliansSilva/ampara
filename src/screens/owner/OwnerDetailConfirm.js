import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OwnerDetailsConfirm({ navigation, route }) {

    const { data, helper, requestId } = route.params;

    const [loading, setLoading] = useState(false);

    const fetchRequestDetails = async () => {
        try {
            console.log(helper)
            setLoading(true);

            const token = await AsyncStorage.getItem("@accessToken");

            if (!token) return;

            const response = await fetch(
                `https://ampara-api-1028004784154.us-central1.run.app/request/accept-supporter/${requestId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        supporterId: helper.helperId,
                    }),
                }
            );


            if (!response.ok) {
                console.log(response)
                throw new Error("Erro ao buscar detalhes do pedido");
            }

            const result = await response.json();

            console.log("Resposta da API:", result);

            navigation.navigate("Conclusion", {
                from: "ownerDetailConfirm",
            })

        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.outerContainer}>
            <View style={styles.cardContainer}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    {/* TÍTULO MENSAGEM */}
                    <Text style={styles.sectionTitle}>Mensagem</Text>

                    {/* CARD MENSAGEM */}
                    <View style={styles.messageCard}>
                        <Text style={styles.messageText}>
                            {data.userMessage}
                        </Text>
                    </View>

                    {/* TÍTULO AMPARO */}
                    <Text style={[styles.sectionTitle, { marginTop: 35 }]}>Amparo</Text>

                    {/* CARD AMPARO */}
                    <View style={styles.supportCard}>
                        <View style={styles.supportHeader}>
                            <Text style={styles.supportName}>{helper.name}</Text>
                        </View>

                        <View style={styles.supportInfo}>
                            <Text style={styles.supportLabel}>
                                Localidade{" "}
                                <Text style={styles.supportValue}>
                                    {helper.city} ({helper.state})
                                </Text>
                            </Text>

                            <Text style={styles.supportLabel}>
                                Histórico{" "}
                                <Text style={styles.supportValue}>
                                    Já ajudou {helper.totalHelpOffered} pessoas
                                </Text>
                            </Text>
                        </View>
                    </View>

                    {/* LINHA DIVISÓRIA */}
                    <View style={styles.divider} />

                    {/* TEXTO PERGUNTA */}
                    <Text style={styles.questionText}>
                        Você deseja permitir que essa{"\n"}
                        pessoa dê suporte para a{"\n"}
                        mensagem deixada?
                    </Text>

                    {/* BOTÃO */}
                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.7 }]}
                        activeOpacity={0.85}
                        onPress={ () => fetchRequestDetails()}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Permitir amparo</Text>
                        )}
                    </TouchableOpacity>

                    {/* VOLTAR */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        <Text style={[styles.backText, loading && { opacity: 0.5 }]}>
                            Voltar para a página anterior
                        </Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </View>
    );
}

/* ============================ STYLES ============================ */

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    cardContainer: {
        width: "100%",
        maxWidth: 420,
        flex: 1,
        backgroundColor: "#F4E7FF",
        borderRadius: 26,
        overflow: "hidden",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 22,
        paddingTop: 24,
        paddingBottom: 8,
    },

    content: {
        paddingHorizontal: 22,
        paddingTop: 30,
        paddingBottom: 10,
    },

    sectionTitle: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "800",
        color: "#9C83D6",
        marginBottom: 18,
    },

    messageCard: {
        backgroundColor: "#E5D5F5",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1.5,
        borderColor: "#D2BFF2",
    },

    messageText: {
        color: "#9C83D6",
        fontSize: 15,
        fontWeight: "600",
        lineHeight: 22,
    },

    supportCard: {
        backgroundColor: "#E5D5F5",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1.5,
        borderColor: "#D2BFF2",
    },

    supportHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    supportName: {
        fontSize: 18,
        fontWeight: "800",
        color: "#9C83D6",
    },

    supportInfo: {
        gap: 12,
    },

    supportLabel: {
        fontSize: 14,
        fontWeight: "800",
        color: "#9C83D6",
    },

    supportValue: {
        fontWeight: "600",
        color: "#9C83D6",
    },

    divider: {
        height: 1,
        backgroundColor: "#D2BFF2",
        marginVertical: 35,
        width: "80%",
        alignSelf: "center",
    },

    questionText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "900",
        color: "#9C83D6",
        lineHeight: 28,
        marginBottom: 30,
    },

    button: {
        backgroundColor: "#9C83D6",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        width: "100%",
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800",
    },

    backText: {
        textAlign: "center",
        marginTop: 18,
        color: "#9C83D6",
        fontSize: 15,
        fontWeight: "700",
    },
});