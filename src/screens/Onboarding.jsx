import React, {useState, useEffect, useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    Image,
    Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
// ajuste a proporção se quiser a imagem maior/menor
const IMAGE_HEIGHT = Math.round(height * 0.55);

export default function HomeScreen({ navigation }) {

    const data = [
        {
            image: require("../../assets/woman_one.png"),
            title: "Aqui você encontra apoio!",
            subtitle: "Encontre ajuda para recomeçar. Moradia, trabalho, saúde, orientação e muito mais de mulher para mulher."
        },
        {
            image: require("../../assets/woman_two.png"),
            title: "Conexão que transforma",
            subtitle: "Seja para pedir ajuda ou oferecer apoio, \n" +
                "aqui você faz parte de uma rede que cuida \n" +
                "e transforma."
        },
        {
            image: require("../../assets/womans.png"),
            title: "Juntas somos mais fortes.",
            subtitle: "A força de uma comunidade está no cuidado. Aqui, você não está sozinha."
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const animations = useRef(data.map(() => new Animated.Value(0))).current;


    useEffect(() => {
        animations.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: index === currentIndex ? 1 : 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.replace('SupportedPersons');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton}>
                <Ionicons name="close" size={26} color="#9C6ADE" />
            </TouchableOpacity>

            <Image
                source={require("../../assets/logo.png")} // 🔥 substitua pelo caminho da sua imagem local
                style={styles.logo}
            />

            <Text style={styles.title}>{data[currentIndex].title}</Text>

            <Text style={styles.description}>
                {data[currentIndex].subtitle}
            </Text>

            {/* ImageBackground garante que o degradê fique sobre a imagem real */}
            <ImageBackground
                source={data[currentIndex].image}
                style={[styles.imageBackground, { height: IMAGE_HEIGHT }]}
                imageStyle={styles.imageStyle}
                resizeMode="contain"
            >
                {/* Degradê posicionado na parte inferior da imagem */}
                <LinearGradient
                    colors={["rgba(244,225,242,0)", "#F4E1F2"]} // do transparente ao background
                    start={[0.5, 0]}
                    end={[0.5, 1]}
                    style={[styles.gradient, { height: Math.round(IMAGE_HEIGHT * 0.30) }]}
                    pointerEvents="none"
                />
            </ImageBackground>


            <View style={styles.footer}>

                <View style={styles.dotsContainer}>
                    {data.map((_, index) => {
                        const backgroundColor = animations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: ["#ccc", "#7A4DCC"],
                        });

                        const scale = animations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.5],
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor,
                                        transform: [{ scale }],
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Botão Próximo */}
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Ionicons name="arrow-forward" size={28} color="#7A4DCC" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4E1F2", // mesmo que o degradê final
        paddingTop: 60,
        paddingHorizontal: 24,
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        top: 60,
        right: 22,
        zIndex: 10,
    },
    logo: {
        marginTop: 80,
    },
    title: {
        marginTop: 18,
        fontSize: 18,
        fontWeight: "700",
        color: "#7A4DCC",
        textAlign: "center",
    },
    description: {
        marginTop: 12,
        fontSize: 14,
        color: "#9B8FA6",
        textAlign: "center",
        marginHorizontal: 12,
        lineHeight: 20,
    },
    imageBackground: {
        width: "100%",
        marginTop: 8,
        justifyContent: "flex-end", // garante que o degradê fique na parte baixa
        alignItems: "center",
    },
    imageStyle: {
        width: "100%",
        height: "100%",
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 50,
    },
    footer: {
        position: "absolute",
        bottom: 30, // espaçamento do rodapé
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between", // dots no meio + botão no fim
        alignItems: "center",
        paddingHorizontal: 30,
    },

    dotsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center", // centraliza os dots
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#C8A8F0",
        marginHorizontal: 5,
    },

    activeDot: {
        width: 20,
        borderRadius: 5,
        backgroundColor: "#7A4DCC",
    },

    nextButton: {
        position: "absolute",
        right: 30,
    },


});
