import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const senhaRef = useRef(null);

    const handleLogin = () => {
        console.log("Email:", email);
        console.log("Senha:", senha);
        // lógica de login
    };

    return (
        <View style={styles.container}>
            {/* Imagem acima do email */}
            <Image
                source={require("../../assets/logo.png")} // 🔥 substitua pelo caminho da sua imagem local
                style={styles.image}
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

            <Text style={styles.forgot}>Esqueceu a sua senha?</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Acessar minha conta</Text>
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
        marginBottom: 30, // espaço entre imagem e email
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
    forgot: {
        color: "#000",
        fontSize: 14,
        marginBottom: 25,
        alignSelf: "flex-start",
    },
    button: {
        backgroundColor: "#9C6ADE",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
