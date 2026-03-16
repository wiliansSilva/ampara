import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    Animated,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {

    const insets = useSafeAreaInsets();

    const data = [
        {
            image: require("../../assets/woman_one.png"),
            title: "Aqui você encontra apoio!",
            subtitle: "Encontre ajuda para recomeçar. Moradia, trabalho, saúde, orientação e muito mais de mulher para mulher."
        },
        {
            image: require("../../assets/woman_two.png"),
            title: "Conexão que transforma",
            subtitle: "Seja para pedir ajuda ou oferecer apoio,\naqui você faz parte de uma rede que cuida\ne transforma."
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
            navigation.replace("SupportedPersons");
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>
                {data[currentIndex].title}
            </Text>

            <Text style={styles.description}>
                {data[currentIndex].subtitle}
            </Text>

            <View style={styles.imageContainer}>

                <ImageBackground
                    source={data[currentIndex].image}
                    style={styles.imageBackground}
                    imageStyle={styles.imageStyle}
                >

                    <LinearGradient
                        colors={["rgba(244,225,242,0)", "#F4E1F2"]}
                        start={[0.5, 0]}
                        end={[0.5, 1]}
                        style={styles.gradient}
                        pointerEvents="none"
                    />

                </ImageBackground>

            </View>

            <View
                style={[
                    styles.footer,
                ]}
            >

                <View style={styles.footerSide} />

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

                <View style={styles.footerSideRight}>
                    <TouchableOpacity onPress={handleNext}>
                        <Ionicons name="arrow-forward" size={28} color="#7A4DCC" />
                    </TouchableOpacity>
                </View>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F4E1F2",
        paddingHorizontal: 24,
        alignItems: "center",
    },

    logo: {
        marginTop: 20,
        width: 180,
        height: 60
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

    imageContainer: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    imageBackground: {
        width: "100%",
        height: "100%",
        maxHeight: 360,
        justifyContent: "flex-end",
        alignItems: "center",
    },

    imageStyle: {
        resizeMode: "contain",
    },

    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
    },

    footer: {

        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "auto",
    },

    footerSide: {
        flex: 1,
    },

    footerSideRight: {
        flex: 1,
        alignItems: "space-between",
    },

    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },

});