import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const senhaRef = useRef(null);

    function getRouteByProfile(profile) {
        console.log(profile);
        switch (profile) {
            case "mediator":
                return "Owners";
            case "helper":
                return "HelperLists";
            default:
                return "Onboarding";
        }
    }

    const handleLogin = async () => {
        try {
            setLoading(true);
            console.log("Iniciando login...");

            const response = await fetch(
                "https://ampara-api-1028004784154.us-central1.run.app/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: senha,
                    }),
                }
            );

            console.log("Status da resposta:", response);

            const text = await response.text();

            let data = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            console.log("Corpo da resposta:", data);

            if (!response.ok) {
                const errorMessage = Array.isArray(data.message)
                    ? data.message.join("\n")
                    : data.message || "Erro ao realizar login";

                Alert.alert("Erro", errorMessage);
                return;
            }

            console.log(email)
            const accessToken = data.accessToken;
            await AsyncStorage.setItem("@accessToken", accessToken);
            await AsyncStorage.setItem("@email", email);

            if (!accessToken) {
                Alert.alert("Erro", "Token não retornado pelo servidor");
                return;
            }

            try {
                const { profile } = jwtDecode(accessToken);

                console.log("Payload do token:", profile);

                const route = getRouteByProfile(profile);

                navigation.reset({
                    routes: [{ name: route }],
                });
            } catch (e) {
                console.log("Erro ao decodificar token:", e);
                Alert.alert("Erro", "Token inválido");
            }
        } catch (error) {
            console.log("Erro inesperado:", error);
            if (!response.ok) {
                Alert.alert(
                    "Erro",
                    Array.isArray(data.message)
                        ? data.message.join("\n")
                        : data.message || "Erro ao realizar login"
                );
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoToCreateAccount = () => {
        navigation.navigate("CreateAcc"); // 🔥 ajuste o nome da rota se necessário
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/logo.png")}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Insira seu e-mail aqui"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => senhaRef.current?.focus()}
                blurOnSubmit={false}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
                ref={senhaRef}
                style={styles.input}
                placeholder="Insira sua senha aqui"
                placeholderTextColor="#999"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                returnKeyType="done"
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Acessar minha conta</Text>
                )}
            </TouchableOpacity>

            {/* ✅ BOTÃO CRIAR CONTA */}
            <TouchableOpacity
                style={styles.createAccountButton}
                onPress={handleGoToCreateAccount}
                activeOpacity={0.8}
                disabled={loading}
            >
                <Text style={styles.createAccountText}>Criar conta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4E1F2",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    image: {
        width: 180,
        height: 80,
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        alignSelf: "flex-start",
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#9C6ADE",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },

    // ✅ Criar conta (link/button secundário)
    createAccountButton: {
        marginTop: 18,
        paddingVertical: 10,
    },
    createAccountText: {
        color: "#9C6ADE",
        fontSize: 15,
        fontWeight: "600",
    },
});
