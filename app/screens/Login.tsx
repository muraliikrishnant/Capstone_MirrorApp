import { ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { NavigationProp } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Fontisto, FontAwesome } from "@expo/vector-icons";
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
import { getUser } from "../data/entity/Users";
import { User } from "../data/model/Types";
import { MA_CREDENTIAL } from "../types/Constants";
import { removeAppStorageItem, setAppStorageItem } from "../types/Storage";

// Extract colors correctly
const { darkLight, primary } = Colors;

const Login = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<MessageType>(MessageType.BLANK);
    const auth = FIREBASE_INIT_AUTH;

    const signIn = async (values: any) => {
        //setLoading(true);
        try {
            const response = await auth().signInWithEmailAndPassword(values.email, values.password);
            navigation.navigate("Home");
            //await AsyncStorage.setItem('mpCredential', JSON.stringify(response.user));
            //setStoredCredentials(response.user);
        } catch (error) {
            console.error(error);
        } finally {
            //setLoading(false);
        };
    };
    
    const onAuthStateChanged = async (fbAuthUser: FirebaseAuthTypes.User | null) => {
        if (fbAuthUser) {
            console.log("User is signed in: " + fbAuthUser.email);
            const user = await getUser(fbAuthUser.uid) as User;
            await setAppStorageItem(MA_CREDENTIAL, fbAuthUser);
            navigation.navigate('Home');
        } else {
            console.log("User is signed out");
            removeAppStorageItem(MA_CREDENTIAL);
            navigation.navigate('Login');
        };
    };

    useEffect(() => {
        const subscriber = FIREBASE_INIT_AUTH().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    // Handle message
    const handleMessage = (message: string, type: MessageType) => {
        setMessage(message);
        setMessageType(type);
    };

    /*const googleSignIn = async () => {
        setLoading(true);
        try {
            const response = await auth.signInWithPopup(new auth.GoogleAuthProvider());
            console.log(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };*/

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
                                <MsgBox type={messageType}>{message}</MsgBox>
                                { loading ? <ActivityIndicator color={primary} size="large" /> : (
                                    <>
                                        <StyledButton onPress={() => handleSubmit()}>
                                            <FontAwesome name="sign-in" size={24} color={primary} />
                                            <ButtonText> Login</ButtonText>
                                        </StyledButton>
                                    </>
                                )}
                                <Line />
                                { loading ? <ActivityIndicator color={primary} size="large" /> : (
                                    <>
                                        <StyledButton google={true} onPress={() => handleSubmit()}>
                                            <Fontisto name="google" color={primary} size={25} />
                                            <ButtonText>  Sign in with Google</ButtonText>
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
