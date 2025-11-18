import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HelperList({ navigation }) {
    const pedidos = [
        "Oi, estou passando por um momento difícil. Preciso de alguém para conversar, entender meus sentimentos e me ajudar a encontrar caminhos para seguir em frente.",
        "Olá, estou enfrentando muita ansiedade e não sei por onde começar a resolver isso. Precisava de alguém para me ouvir sem julgamentos.",
        "Sou mãe solo e estou sobrecarregada, tanto financeiramente quanto emocionalmente. Precisava de ajuda para organizar as coisas e me sentir mais segura.",
        "Passei por uma situação difícil e queria apoio para entender meus direitos. Acho que preciso conversar com alguém que possa me orientar melhor.",
        "Passei por uma situação difícil e queria apoio para entender meus direitos. Acho que preciso conversar com alguém que possa me orientar melhor.",
        "Passei por uma situação difícil e queria apoio para entender meus direitos. Acho que preciso conversar com alguém que possa me orientar melhor.",
        "Passei por uma situação difícil e queria apoio para entender meus direitos. Acho que preciso conversar com alguém que possa me orientar melhor.",

    ];

    return (
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

            {/* Lista */}
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {pedidos.map((texto, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => navigation.replace('SelectedsHelp')}
                    >
                        <Text style={styles.cardText}>{texto}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4E9FB",
        paddingTop: 60,
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
    },
    scrollContainer: {
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
});
