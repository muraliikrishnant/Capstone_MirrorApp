import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
//import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Formik } from "formik";
import MCATextInput from "../components/controls/MCATextInput";
import KeyboardAvoidingWrapper from "../components/controls/KeyboardAvoidingWrapper";
import {
    StyledContainer,
    InnerContainer,
    PageTitle,
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
import { ActivityIndicator } from "react-native";
import { FIREBASE_INIT_AUTH } from "../../config/Firebase";
import { MessageType } from "../types/BaseTypes";
import { Register } from "../data/model/Types";
import { registerUser } from "../data/Orchestrate";

// Extract colors correctly
const { brand, darkLight, primary } = Colors;

const SignUp = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(moment().subtract(18, "years").toDate());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<MessageType>(MessageType.BLANK);

    // Actual date of birth
    const [dob, setDob] = useState<Date | undefined>(undefined);

    const auth = FIREBASE_INIT_AUTH;
    const onDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate);
    };

    const showDatePicker = () => {
        setShow(true);
    };

    const createUser = async (values: any) => {
        setLoading(true);
        try {
            const response = await auth().createUserWithEmailAndPassword(values.email, values.password);
            await registerUser({
                user: {
                    uid: response.user.uid,
                    email:  values.email.toLowerCase(),
                    firstName: values.firstName,
                    lastName: values.lastName,
                    dateOfBirth: values.dateOfBirth,
                    deviceCode: values.deviceCode,
                },
                deviceCode: values.deviceCode,
            } as Register);
            //console.log(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        };
    };

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle>Account SignUp</PageTitle>

                    {/*show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode='date'
                            is24Hour={true}
                            display="default"
                            onChange={onDateChange}
                        />
                    )*/}
                    
                    <Formik
                        initialValues={{ firstName: "", lastName: "", dateOfBirth: "", email: "", deviceCode: "", password: "", confirmPassword: "" }}
                        onSubmit={(values) => {
                            createUser(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
                                <MCATextInput
                                    label="First Name"
                                    icon="person"
                                    placeholder="Jon"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange("firstName")}
                                    onBlur={handleBlur("firstName")}
                                    value={values.firstName}
                                />

                                <MCATextInput
                                    label="Last Name"
                                    icon="person"
                                    placeholder="Doe"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange("lastName")}
                                    onBlur={handleBlur("lastName")}
                                    value={values.lastName}
                                />

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
                                    label="Date of Birth"
                                    icon="calendar"
                                    placeholder="YYYY - MM - DD"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange("dateOfBirth")}
                                    onBlur={handleBlur("dateOfBirth")}
                                    value={values.dateOfBirth}
                                    isDate={true}
                                    editable={false}
                                    showDatePicker={showDatePicker}
                                />

                                <MCATextInput
                                    label="Device Code"
                                    icon="gear"
                                    placeholder="Device Code"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange("deviceCode")}
                                    onBlur={handleBlur("deviceCode")}
                                    value={values.deviceCode}
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

                                <MCATextInput
                                    label="Confirm Password"
                                    icon="lock"
                                    placeholder="* * * * * * * *"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange("confirmPassword")}
                                    onBlur={handleBlur("confirmPassword")}
                                    value={values.confirmPassword}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />

                                <MsgBox type={messageType}>{message}</MsgBox>
                                {loading ? <ActivityIndicator color={primary} size="large" /> : (
                                    <StyledButton onPress={() => handleSubmit()}>
                                        <ButtonText>Create Account</ButtonText>
                                    </StyledButton>
                                )}
                                <Line />
                                <ExtraView>
                                    <ExtraText>Already have an account? </ExtraText>
                                    <TextLink onPress={() => navigation.navigate("Login")}>
                                        <TextLinkContent>Login</TextLinkContent>
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

export default SignUp;