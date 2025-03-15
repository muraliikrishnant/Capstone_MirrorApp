import { ActivityIndicator } from "react-native";
import React, { useState, useContext } from "react";
//import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { NavigationProp } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Fontisto, FontAwesome } from "@expo/vector-icons";

// async-storage
//import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
//import { CredentialsContext } from "../types/CredentialsContext";

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
import { getOwner } from "../data/entity/Roles";
import { saveUser } from "../data/entity/Users";
import { User } from "../data/model/Types";

// Extract colors correctly
const { darkLight, primary } = Colors;

const Login = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<MessageType>(MessageType.BLANK);
    //const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const auth = FIREBASE_INIT_AUTH;

    const signIn = async (values: any) => {
        //setLoading(true);
        try {
            const response = await auth().signInWithEmailAndPassword(values.email, values.password);
            navigation.navigate("Loading");
            //await AsyncStorage.setItem('mpCredential', JSON.stringify(response.user));
            //setStoredCredentials(response.user);
            console.log('signed in');
        } catch (error) {
            console.error(error);
        } finally {
            //setLoading(false);
        };
    };

    // Persisting login
    /*const persistLogin = async (credentials: FirebaseResponse, message: string, status: MessageType) => {
        asyncStorage.setItem('mirrorAppCredentials', JSON.stringify(credentials))
            .then(() => {
                handleMessage(message, status);
                setStoredCredentials(credentials);
            })
            .catch((error) => {
                handleMessage('Persisting login failed', MessageType.FAILED);
                console.log(error);
            });
    };*/

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
