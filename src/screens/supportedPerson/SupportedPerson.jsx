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
    Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function NecessidadeScreen({ navigation }) {
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingRequests, setCheckingRequests] = useState(true);
    const [hasRequests, setHasRequests] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

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
                console.log(
                    "Erro ao verificar pedidos:",
                    error
                );
            } finally {
                setCheckingRequests(false);
            }
        };

        checkUserRequests();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove([
                "@accessToken",
                "@email",
            ]);

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        } catch (error) {
            console.error(
                "Erro ao sair:",
                error
            );
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Excluir conta",
            "Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const accessToken =
                                await AsyncStorage.getItem(
                                    "@accessToken"
                                );

                            const email =
                                await AsyncStorage.getItem(
                                    "@email"
                                );

                            if (
                                !accessToken ||
                                !email
                            ) {
                                throw new Error(
                                    "Token ou email não encontrado"
                                );
                            }

                            const usersResponse =
                                await fetch(
                                    "https://ampara-api-1028004784154.us-central1.run.app/user",
                                    {
                                        method: "GET",
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`,
                                        },
                                    }
                                );

                            if (
                                !usersResponse.ok
                            ) {
                                throw new Error(
                                    "Erro ao buscar usuário"
                                );
                            }

                            const users =
                                await usersResponse.json();

                            const user =
                                users.find(
                                    (item) =>
                                        item.email?.toLowerCase() ===
                                        email.toLowerCase()
                                );

                            if (!user) {
                                throw new Error(
                                    "Usuário não encontrado"
                                );
                            }

                            const deleteResponse =
                                await fetch(
                                    `https://ampara-api-1028004784154.us-central1.run.app/user/deactivate/${user._id}`,
                                    {
                                        method: "PATCH",
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`,
                                        },
                                    }
                                );

                            if (
                                !deleteResponse.ok
                            ) {
                                throw new Error(
                                    "Erro ao excluir conta"
                                );
                            }

                            await AsyncStorage.multiRemove(
                                [
                                    "@accessToken",
                                    "@email",
                                ]
                            );

                            Alert.alert(
                                "Conta excluída",
                                "Sua conta foi removida com sucesso."
                            );

                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: "Login",
                                    },
                                ],
                            });
                        } catch (error) {
                            console.error(
                                error
                            );

                            Alert.alert(
                                "Erro",
                                error.message ||
                                "Não foi possível excluir a conta."
                            );
                        }
                    },
                },
            ]
        );
    };

    const handleMessage = async () => {
        try {
            setLoading(true);

            const token =
                await AsyncStorage.getItem(
                    "@accessToken"
                );

            const response = await fetch(
                "https://ampara-api-1028004784154.us-central1.run.app/request",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userMessage:
                            mensagem.trim(),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Erro ao enviar pedido"
                );
            }

            navigation.replace(
                "Conclusion"
            );
        } catch (error) {
            console.log(error);

            Alert.alert(
                "Erro",
                "Não foi possível enviar sua mensagem"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : "height"
            }
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <View style={styles.container}>
                    {/* HEADER */}

                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() =>
                                setMenuVisible(
                                    true
                                )
                            }
                        >
                            <Ionicons
                                name="menu"
                                size={32}
                                color="#7A4DCC"
                            />
                        </TouchableOpacity>

                        <View
                            style={{
                                width: 32,
                            }}
                        />
                    </View>

                    {/* MENU */}

                    <Modal
                        visible={
                            menuVisible
                        }
                        transparent
                        animationType="fade"
                    >
                        <TouchableOpacity
                            style={
                                styles.overlay
                            }
                            activeOpacity={
                                1
                            }
                            onPress={() =>
                                setMenuVisible(
                                    false
                                )
                            }
                        >
                            <View
                                style={
                                    styles.menuContainer
                                }
                            >
                                <TouchableOpacity
                                    style={
                                        styles.menuItem
                                    }
                                    onPress={() => {
                                        setMenuVisible(
                                            false
                                        );

                                        handleLogout();
                                    }}
                                >
                                    <Ionicons
                                        name="log-out-outline"
                                        size={
                                            22
                                        }
                                        color="#6E56A3"
                                    />

                                    <Text
                                        style={
                                            styles.menuText
                                        }
                                    >
                                        Sair
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={
                                        styles.menuItem
                                    }
                                    onPress={() => {
                                        setMenuVisible(
                                            false
                                        );

                                        handleDeleteAccount();
                                    }}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={
                                            22
                                        }
                                        color="#D9534F"
                                    />

                                    <Text
                                        style={[
                                            styles.menuText,
                                            {
                                                color: "#D9534F",
                                            },
                                        ]}
                                    >
                                        Deletar
                                        conta
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    {/* TÍTULO */}

                    <Text style={styles.title}>
                        Escreva sua
                        necessidade aqui
                    </Text>

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Você pode enviar
                        até 3 pedidos
                    </Text>

                    {/* INPUT */}

                    <TextInput
                        style={styles.textInput}
                        multiline
                        placeholder="Insira a descrição do evento aqui"
                        placeholderTextColor="#9B8FA6"
                        onChangeText={setMensagem}
                        value={mensagem}
                        textAlignVertical="top"
                    />

                    {/* FOOTER */}

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                {
                                    backgroundColor:
                                        mensagem.trim() &&
                                        !loading
                                            ? "#7A4DCC"
                                            : "#CCC",
                                },
                            ]}
                            onPress={
                                handleMessage
                            }
                            disabled={
                                !mensagem.trim() ||
                                loading
                            }
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text
                                    style={
                                        styles.buttonText
                                    }
                                >
                                    Enviar
                                    mensagem
                                </Text>
                            )}
                        </TouchableOpacity>

                        {!checkingRequests &&
                            hasRequests && (
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate(
                                            "Wishe"
                                        )
                                    }
                                    style={
                                        styles.secondaryButton
                                    }
                                >
                                    <Text
                                        style={
                                            styles.secondaryButtonText
                                        }
                                    >
                                        Acompanhar
                                        meus
                                        pedidos
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
        backgroundColor:
            "#F4E9FB",
        paddingTop: 60,
        paddingHorizontal: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent:
            "space-between",
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
        borderColor:
            "#BFA6E7",
        borderWidth: 1,
        borderRadius: 10,
        padding: 16,
        fontSize: 14,
        color: "#7A4DCC",
        backgroundColor:
            "#F4E9FB",
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

    overlay: {
        flex: 1,
        backgroundColor:
            "rgba(0,0,0,0.3)",
        alignItems:
            "flex-start",
        paddingStart: 30,
    },

    menuContainer: {
        marginTop: 80,
        width: 220,
        backgroundColor:
            "#FFF",
        borderRadius: 16,
        paddingVertical: 10,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },

    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 14,
    },

    menuText: {
        marginLeft: 12,
        fontSize: 16,
        color: "#6E56A3",
        fontWeight: "500",
    },
});