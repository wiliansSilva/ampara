import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function NecessidadeScreen({ navigation }) {
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingRequests, setCheckingRequests] = useState(true);
    const [hasRequests, setHasRequests] = useState(false);

    /** 🔹 Verifica se o usuário já tem pedidos */
    useEffect(() => {
        const checkUserRequests = async () => {
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

                if (!response.ok) return;

                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    setHasRequests(true);
                }
            } catch (error) {
                console.log("Erro ao verificar pedidos:", error);
            } finally {
                setCheckingRequests(false);
            }
        };

        checkUserRequests();
    }, []);

    /** 🔹 Envia novo pedido */
    const handleMessage = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem("@accessToken");

            const response = await fetch(
                "https://ampara-api-1028004784154.us-central1.run.app/request",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userMessage: mensagem.trim(),
                    }),
                }
            );
            console.log(response);
            if (!response.ok) {
                throw new Error("Erro ao enviar pedido");
            }

            navigation.replace("Conclusion");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível enviar sua mensagem");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Ionicons name="menu-outline" size={28} color="#7A4DCC" />
                        <Ionicons
                            name="notifications-outline"
                            size={26}
                            color="#7A4DCC"
                        />
                    </View>

                    {/* Título */}
                    <Text style={styles.title}>Escreva sua necessidade aqui</Text>
                    <Text style={styles.subtitle}>
                        Você pode enviar até 3 pedidos
                    </Text>

                    {/* Input */}
                    <TextInput
                        style={styles.textInput}
                        multiline
                        placeholder="Insira a descrição do evento aqui"
                        placeholderTextColor="#9B8FA6"
                        onChangeText={setMensagem}
                        value={mensagem}
                        textAlignVertical="top"
                    />

                    {/* Footer */}
                    <View style={styles.footer}>
                        {/* Botão Enviar */}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                {
                                    backgroundColor:
                                        mensagem.trim() && !loading
                                            ? "#7A4DCC"
                                            : "#CCC",
                                },
                            ]}
                            onPress={handleMessage}
                            disabled={!mensagem.trim() || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Enviar mensagem
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* 🔹 Botão Acompanhar pedidos (CONDICIONAL) */}
                        {!checkingRequests && hasRequests && (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("Wishe")
                                }
                                style={styles.secondaryButton}
                            >
                                <Text style={styles.secondaryButtonText}>
                                    Acompanhar meus pedidos
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4E9FB",
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        marginTop: 40,
        fontSize: 18,
        fontWeight: "700",
        color: "#7A4DCC",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: "#9B8FA6",
        textAlign: "center",
    },
    textInput: {
        height: 480,
        marginTop: 40,
        borderColor: "#BFA6E7",
        borderWidth: 1,
        borderRadius: 10,
        padding: 16,
        fontSize: 14,
        color: "#7A4DCC",
        backgroundColor: "#F4E9FB",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        alignItems: "center",
    },
    button: {
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        width: width - 40,
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    secondaryButton: {
        marginTop: 16,
    },
    secondaryButtonText: {
        color: "#9C6ADE",
        fontSize: 15,
        fontWeight: "600",
    },
});
