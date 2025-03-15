import React from "react";

import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { StyledKeyboardAvoidingView } from "../../types/Styles";

const KeyboardAvoidingWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <StyledKeyboardAvoidingView behavior="padding">
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </StyledKeyboardAvoidingView>
    );
};

export default KeyboardAvoidingWrapper;