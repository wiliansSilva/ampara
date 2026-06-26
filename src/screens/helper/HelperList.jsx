import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Modal,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function HelperList({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);

    const handleRequests = async () => {
        try {
            setLoading(true);

            const accessToken = await AsyncStorage.getItem("@accessToken");

            if (!accessToken) {
                console.warn("Token não encontrado");
                return;
            }

            const response = await fetch(
                "https://ampara-api-1028004784154.us-central1.run.app/request/helper/active",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar pedidos");
            }

            const data = await response.json();

            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("@accessToken");

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Excluir conta",
            "Tem certeza que deseja excluir sua conta?",
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
                                await AsyncStorage.getItem("@accessToken");

                            const email =
                                await AsyncStorage.getItem("@email");

                            if (!accessToken || !email) {
                                throw new Error(
                                    "Token ou email não encontrado"
                                );
                            }

                            // Buscar usuários
                            const usersResponse = await fetch(
                                "https://ampara-api-1028004784154.us-central1.run.app/user",
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                }
                            );

                            if (!usersResponse.ok) {
                                throw new Error(
                                    "Erro ao buscar usuários"
                                );
                            }

                            const users =
                                await usersResponse.json();

                            // Encontrar usuário pelo email
                            const user = users.find(
                                (item) =>
                                    item.email?.toLowerCase() ===
                                    email.toLowerCase()
                            );

                            if (!user) {
                                throw new Error(
                                    "Usuário não encontrado"
                                );
                            }

                            const userId = user._id;

                            console.log(
                                "Usuário encontrado:",
                                userId
                            );

                            // Desativar conta
                            const deleteResponse = await fetch(
                                `https://ampara-api-1028004784154.us-central1.run.app/user/deactivate/${userId}`,
                                {
                                    method: "PATCH",
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                }
                            );

                            if (!deleteResponse.ok) {
                                throw new Error(
                                    "Erro ao excluir conta"
                                );
                            }

                            await AsyncStorage.multiRemove([
                                "@accessToken",
                                "@email",
                            ]);

                            Alert.alert(
                                "Conta excluída",
                                "Sua conta foi removida com sucesso."
                            );

                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Login" }],
                            });

                        } catch (error) {
                            console.error(error);

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

    useEffect(() => {
        handleRequests();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <View />

                    <TouchableOpacity
                        onPress={() => setMenuVisible(true)}
                    >
                        <Ionicons
                            name="menu"
                            size={32}
                            color="#9C6ADE"
                        />
                    </TouchableOpacity>
                </View>

                {/* Modal Menu */}
                <Modal
                    visible={menuVisible}
                    transparent
                    animationType="fade"
                >
                    <TouchableOpacity
                        style={styles.overlay}
                        activeOpacity={1}
                        onPress={() => setMenuVisible(false)}
                    >
                        <View style={styles.menuContainer}>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    handleLogout();
                                }}
                            >
                                <Ionicons
                                    name="log-out-outline"
                                    size={22}
                                    color="#6E56A3"
                                />

                                <Text style={styles.menuText}>
                                    Sair
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    handleDeleteAccount();
                                }}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={22}
                                    color="#D9534F"
                                />

                                <Text
                                    style={[
                                        styles.menuText,
                                        { color: "#D9534F" },
                                    ]}
                                >
                                    Deletar conta
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Título */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Pedidos de amparos
                    </Text>

                    <Text style={styles.subtitle}>
                        Selecione uma mensagem abaixo para oferecer
                        sua ajuda ou suporte
                    </Text>
                </View>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator
                            size="large"
                            color="#9C6ADE"
                        />
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={
                            styles.scrollContainer
                        }
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
                                        navigation.replace(
                                            "SelectedsHelp",
                                            {
                                                requestId: item._id,
                                                userMessage:
                                                item.userMessage,
                                            }
                                        )
                                    }
                                >
                                    <Text
                                        style={styles.cardText}
                                    >
                                        {item.userMessage ??
                                            "Pedido sem descrição"}
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
        justifyContent: "flex-start",
        alignItems: "center",
    },

    titleContainer: {
        alignItems: "center",
        marginTop: 10,
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

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "flex-start",
        paddingStart: 30
    },

    menuContainer: {
        marginTop: 80,
        marginRight: 20,
        width: 220,
        backgroundColor: "#FFF",
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