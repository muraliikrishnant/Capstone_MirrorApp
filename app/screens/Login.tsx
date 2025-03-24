import { ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { NavigationProp } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { FontAwesome } from "@expo/vector-icons";
import MCATextInput from "../components/controls/MCATextInput";
import KeyboardAvoidingWrapper from "../components/controls/KeyboardAvoidingWrapper";
import Car from "../../assets/images/Car.png";
import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Colors,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent
} from "../types/Styles";
import { FIREBASE_INIT_AUTH } from "../../config/Firebase";
import { MessageType } from "../types/BaseTypes";
import { FullUser } from "../data/model/Types";
import { MA_CREDENTIAL } from "../types/Constants";
import { removeAppStorageItem, setAppStorageItem } from "../types/Storage";
import { getFullUser } from "../data/Orchestrate";
import { getRandomInt } from "../types/Utils";

// Extract colors correctly
const { darkLight, primary } = Colors;

const Login = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<MessageType>(MessageType.BLANK);
    const auth = FIREBASE_INIT_AUTH;

    // Handle message
    const handleMessage = (message: string, type: MessageType) => {
        setMessage(message);
        setMessageType(type);
    };

    const signIn = async (values: any) => {
        setLoading(true);
        try {
            const userCredential = await auth().signInWithEmailAndPassword(values.email, values.password);
            //console.log(userCredential);
            navigation.navigate("Home");
        } catch (error) {
            console.error("Error during login : " + values.email, error);
        } finally {
            setLoading(false);
        };
    };
    
    const onAuthStateChanged = async (fbAuthUser: FirebaseAuthTypes.User | null) => {
        if (fbAuthUser) {
            if (!fbAuthUser.emailVerified) {
                //await FIREBASE_INIT_AUTH().signOut();
                handleMessage("Signup complete or user not verified. Check your email to verify!", MessageType.FAILED);
                navigation.navigate("Login", { screen: "Signup", random: getRandomInt(-100, 100) });
            } else if (fbAuthUser.emailVerified) {
                console.log("User is signed in: " + fbAuthUser.email);
                const fullUser = await getFullUser(fbAuthUser) as FullUser;
                //console.log(fullUser);
                await setAppStorageItem(MA_CREDENTIAL, fullUser);
                navigation.navigate('Home');
            };
        } else {
            const logoutMsg = "User is signed out";
            console.log(logoutMsg);
            handleMessage(logoutMsg, MessageType.INFO);
            removeAppStorageItem(MA_CREDENTIAL);
            navigation.navigate('Login', { screen: "Signout", random: getRandomInt(-100, 100) });
            console.log("sign out out");
        };
    };

    useEffect(() => {
        const subscriber = FIREBASE_INIT_AUTH().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={Car} />
                    <PageTitle>Mirror Controller</PageTitle>
                    <SubTitle>Account Login</SubTitle>
                    
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={(values) => {
                            signIn(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
                                <MCATextInput
                                    label="Email Address"
                                    icon="mail"
                                    placeholder="Jon.Doe@gmail.com"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    value={values.email}
                                    keyboardType="email-address"
                                />

                                <MCATextInput
                                    label="Password"
                                    icon="lock"
                                    placeholder="* * * * * * * *"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    value={values.password}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />
                                <Line/>
                                {message && (
                                    <>
                                        <MsgBox type={messageType}>{message}</MsgBox>
                                        <Line/>
                                    </>
                                )}
                                { loading ? <ActivityIndicator color={primary} size="large" /> : (
                                    <>
                                        <StyledButton onPress={() => handleSubmit()}>
                                            <FontAwesome name="sign-in" size={24} color={primary} />
                                            <ButtonText> Login</ButtonText>
                                        </StyledButton>
                                    </>
                                )}
                                <ExtraView>
                                    <ExtraText>Don't have an account already? </ExtraText>
                                    <TextLink onPress={() => navigation.navigate("Signup")}>
                                        <TextLinkContent>Signup</TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                            </StyledFormArea>
                        )}
                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

export default Login;
