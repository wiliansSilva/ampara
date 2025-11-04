import React, { useState, useRef } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function NecessidadeScreen({navigation}) {

    const [mensagem, setMensagem] = useState("");

    const handleMessage = () => {
        console.log("Mensagem enviada:", mensagem);
        navigation.replace('SuccesPersons');
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
                        <Ionicons name="notifications-outline" size={26} color="#7A4DCC" />
                    </View>

                    {/* Título */}
                    <Text style={styles.title}>Escreva sua necessidade aqui</Text>
                    <Text style={styles.subtitle}>Você enviar até 3 pedidos</Text>

                    {/* Caixa de texto */}
                    <TextInput
                        style={styles.textInput}
                        multiline
                        placeholder="Insira a descrição do evento aqui"
                        placeholderTextColor="#9B8FA6"
                        onChangeText={setMensagem}
                        textAlignVertical="top"
                    />

                    {/* Botão fixo no rodapé */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: mensagem.trim() ? "#7A4DCC" : "#CCC" },
                            ]}
                            onPress={handleMessage}
                            disabled={!mensagem.trim()}
                        >
                            <Text style={styles.buttonText}>Enviar mensagem</Text>
                        </TouchableOpacity>
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
    },
    button: {
        backgroundColor: "#D3B9F7",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        width: width - 40,
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
