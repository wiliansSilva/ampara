import React, { useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ActivityIndicator,
} from "react-native";

export default function CriarContaScreen({ navigation }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        description: "", // profissão
        birth: "", // dd-mm-yyyy (visual)
        city: "",
        state: "",
        profile: "mediator", // mediator | helped
    });

    const [loading, setLoading] = useState(false);

    // refs para o "Next"
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const passwordRef = useRef(null);
    const descriptionRef = useRef(null);
    const birthRef = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);

    function handleChange(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    // ===========================
    // MASCARA DATA
    // ===========================
    function formatBirthDate(value) {
        const numbers = value.replace(/\D/g, "");

        if (numbers.length <= 2) return numbers;

        if (numbers.length <= 4)
            return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;

        return `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(
            4,
            8
        )}`;
    }

    // ===========================
    // VALIDADORES
    // ===========================
    const errors = useMemo(() => {
        const e = {};

        if (!form.name.trim()) e.name = "Informe seu nome";

        if (!form.email.trim()) {
            e.email = "Informe seu email";
        } else {
            const emailOk = form.email.includes("@") && form.email.includes(".");
            if (!emailOk) e.email = "Email inválido";
        }

        if (!form.phone.trim()) e.phone = "Informe seu telefone";

        if (!form.password.trim()) {
            e.password = "Informe sua senha";
        } else if (form.password.trim().length < 6) {
            e.password = "A senha deve ter no mínimo 6 caracteres";
        }

        if (!form.description.trim()) e.description = "Informe sua profissão";

        if (!form.birth.trim()) {
            e.birth = "Informe sua data de nascimento";
        } else {
            const birthOk = /^\d{2}-\d{2}-\d{4}$/.test(form.birth.trim());
            if (!birthOk) e.birth = "Formato inválido. Use dd-mm-yyyy";
        }

        if (!form.city.trim()) e.city = "Informe sua cidade";

        if (!form.state.trim()) {
            e.state = "Informe seu estado";
        } else if (form.state.trim().length !== 2) {
            e.state = "O estado deve ter 2 letras (ex: RS)";
        }

        if (!form.profile) e.profile = "Selecione um perfil";

        return e;
    }, [form]);

    const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

    function getFirstErrorMessage() {
        const order = [
            "name",
            "email",
            "phone",
            "password",
            "description",
            "birth",
            "city",
            "state",
            "profile",
        ];

        for (const key of order) {
            if (errors[key]) return errors[key];
        }
        return "Verifique os campos";
    }

    async function handleSubmit() {
        if (!isValid) {
            Alert.alert("Atenção", getFirstErrorMessage());
            return;
        }

        try {
            setLoading(true);

            const [day, month, year] = form.birth.trim().split("-");

            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                password: form.password,
                description: form.description.trim(),
                birth: `${year}-${month}-${day}`, // yyyy-mm-dd
                city: form.city.trim(),
                state: form.state.trim().toUpperCase(),
                profile: form.profile === "mediator" ? "helper" : "person",
            };

            console.log("PAYLOAD CADASTRO:", payload);

            const response = await fetch(
                "https://ampara-api-1028004784154.us-central1.run.app/user",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const text = await response.text();

            let data = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            console.log("Resposta cadastro:", data);

            if (!response.ok) {
                Alert.alert("Erro", data.message || "Erro ao criar conta");
                return;
            }

            Alert.alert("Sucesso", "Conta criada com sucesso!");
            navigation.goBack();
        } catch (err) {
            console.log("Erro ao cadastrar:", err);
            Alert.alert("Erro", "Não foi possível conectar ao servidor");
        } finally {
            setLoading(false);
        }
    }

    // ===========================
    // UI
    // ===========================
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.outerContainer}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.cardContainer}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.content}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text style={styles.title}>Criar conta</Text>
                            <Text style={styles.subtitle}>
                                Preencha os dados abaixo para continuar
                            </Text>

                            {/* ====== INPUTS ====== */}
                            <Text style={styles.label}>Nome</Text>
                            <TextInput
                                style={[styles.input, errors.name && styles.inputError]}
                                placeholder="Digite seu nome"
                                placeholderTextColor="#B9A6E8"
                                value={form.name}
                                onChangeText={(t) => handleChange("name", t)}
                                returnKeyType="next"
                                onSubmitEditing={() => emailRef.current?.focus()}
                            />
                            {!!errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                ref={emailRef}
                                style={[styles.input, errors.email && styles.inputError]}
                                placeholder="Digite seu email"
                                placeholderTextColor="#B9A6E8"
                                value={form.email}
                                onChangeText={(t) => handleChange("email", t)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                                onSubmitEditing={() => phoneRef.current?.focus()}
                            />
                            {!!errors.email && (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            )}

                            <Text style={styles.label}>Telefone</Text>
                            <TextInput
                                ref={phoneRef}
                                style={[styles.input, errors.phone && styles.inputError]}
                                placeholder="+55 00 00000-0000"
                                placeholderTextColor="#B9A6E8"
                                value={form.phone}
                                onChangeText={(t) => handleChange("phone", t)}
                                keyboardType="phone-pad"
                                returnKeyType="next"
                                onSubmitEditing={() => passwordRef.current?.focus()}
                            />
                            {!!errors.phone && (
                                <Text style={styles.errorText}>{errors.phone}</Text>
                            )}

                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                ref={passwordRef}
                                style={[styles.input, errors.password && styles.inputError]}
                                placeholder="Digite sua senha"
                                placeholderTextColor="#B9A6E8"
                                value={form.password}
                                onChangeText={(t) => handleChange("password", t)}
                                secureTextEntry
                                returnKeyType="next"
                                onSubmitEditing={() => descriptionRef.current?.focus()}
                            />
                            {!!errors.password && (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            )}

                            <Text style={styles.label}>Profissão</Text>
                            <TextInput
                                ref={descriptionRef}
                                style={[styles.input, errors.description && styles.inputError]}
                                placeholder="Ex: Psicóloga, Advogada..."
                                placeholderTextColor="#B9A6E8"
                                value={form.description}
                                onChangeText={(t) => handleChange("description", t)}
                                returnKeyType="next"
                                onSubmitEditing={() => birthRef.current?.focus()}
                            />
                            {!!errors.description && (
                                <Text style={styles.errorText}>{errors.description}</Text>
                            )}

                            <Text style={styles.label}>Data de nascimento</Text>
                            <TextInput
                                ref={birthRef}
                                style={[styles.input, errors.birth && styles.inputError]}
                                placeholder="12-04-1995"
                                placeholderTextColor="#B9A6E8"
                                value={form.birth}
                                onChangeText={(t) =>
                                    handleChange("birth", formatBirthDate(t))
                                }
                                keyboardType="number-pad"
                                maxLength={10}
                                returnKeyType="next"
                                onSubmitEditing={() => cityRef.current?.focus()}
                            />
                            {!!errors.birth && (
                                <Text style={styles.errorText}>{errors.birth}</Text>
                            )}

                            <Text style={styles.label}>Cidade</Text>
                            <TextInput
                                ref={cityRef}
                                style={[styles.input, errors.city && styles.inputError]}
                                placeholder="Ex: Pelotas"
                                placeholderTextColor="#B9A6E8"
                                value={form.city}
                                onChangeText={(t) => handleChange("city", t)}
                                returnKeyType="next"
                                onSubmitEditing={() => stateRef.current?.focus()}
                            />
                            {!!errors.city && (
                                <Text style={styles.errorText}>{errors.city}</Text>
                            )}

                            <Text style={styles.label}>Estado</Text>
                            <TextInput
                                ref={stateRef}
                                style={[styles.input, errors.state && styles.inputError]}
                                placeholder="RS"
                                placeholderTextColor="#B9A6E8"
                                value={form.state}
                                onChangeText={(t) => handleChange("state", t.toUpperCase())}
                                autoCapitalize="characters"
                                maxLength={2}
                                returnKeyType="done"
                                onSubmitEditing={Keyboard.dismiss}
                            />
                            {!!errors.state && (
                                <Text style={styles.errorText}>{errors.state}</Text>
                            )}

                            {/* ====== RADIO BUTTON ====== */}
                            <Text style={styles.label}>Perfil</Text>

                            <View
                                style={[
                                    styles.radioGroup,
                                    errors.profile && styles.radioGroupError,
                                ]}
                            >
                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={() => handleChange("profile", "mediator")}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.radioOuter}>
                                        {form.profile === "mediator" && (
                                            <View style={styles.radioInner} />
                                        )}
                                    </View>
                                    <Text style={styles.radioText}>Pessoa que ajuda</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={() => handleChange("profile", "helped")}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.radioOuter}>
                                        {form.profile === "helped" && (
                                            <View style={styles.radioInner} />
                                        )}
                                    </View>
                                    <Text style={styles.radioText}>Pessoa amparada</Text>
                                </TouchableOpacity>
                            </View>

                            {!!errors.profile && (
                                <Text style={styles.errorText}>{errors.profile}</Text>
                            )}

                            <View style={{ height: 30 }} />
                        </ScrollView>

                        {/* Footer fixo */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    (!isValid || loading) && styles.buttonDisabled,
                                ]}
                                disabled={!isValid || loading}
                                onPress={handleSubmit}
                                activeOpacity={0.8}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            (!isValid || loading) &&
                                            styles.buttonTextDisabled,
                                        ]}
                                    >
                                        Criar conta
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation?.goBack?.()}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.backText}>
                                    Voltar para o login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}
/* ============================ STYLES ============================ */

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        width: "100%",
        maxWidth: 420,
        flex: 1,
    },

    cardContainer: {
        flex: 1,
        backgroundColor: "#F4E7FF",
        borderRadius: 26,
        overflow: "hidden",
    },

    content: {
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 10,
    },

    title: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "700",
        color: "#9C83D6",
        marginTop: 50,
    },

    subtitle: {
        textAlign: "center",
        fontSize: 14,
        color: "#B9A6E8",
        marginTop: 6,
        marginBottom: 20,
        fontWeight: "600",
    },

    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#9C83D6",
        marginBottom: 8,
        marginTop: 12,
    },

    input: {
        height: 52,
        backgroundColor: "#E5D5F5",
        borderRadius: 14,
        paddingHorizontal: 16,
        color: "#7A64B6",
        fontSize: 15,
        borderWidth: 1.5,
        borderColor: "#D2BFF2",
    },

    inputError: {
        borderColor: "#E65C5C",
    },

    errorText: {
        marginTop: 6,
        color: "#E65C5C",
        fontSize: 12,
        fontWeight: "700",
    },

    radioGroup: {
        marginTop: 6,
        backgroundColor: "#E5D5F5",
        borderRadius: 18,
        padding: 14,
        borderWidth: 1.5,
        borderColor: "#D2BFF2",
    },

    radioGroupError: {
        borderColor: "#E65C5C",
    },

    radioItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },

    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: "#9C83D6",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 999,
        backgroundColor: "#9C83D6",
    },

    radioText: {
        color: "#7A64B6",
        fontSize: 15,
        fontWeight: "700",
    },

    footer: {
        paddingHorizontal: 22,
        paddingBottom: 22,
        paddingTop: 10,
    },

    button: {
        backgroundColor: "#9C83D6",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
    },

    buttonDisabled: {
        backgroundColor: "#CBB8F0",
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800",
    },

    buttonTextDisabled: {
        color: "#F3EDFF",
    },

    backText: {
        textAlign: "center",
        marginTop: 16,
        color: "#9C83D6",
        fontSize: 15,
        fontWeight: "700",
    },
});
