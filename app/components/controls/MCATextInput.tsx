import { TouchableOpacity } from "react-native";
import { ITextInput } from "../../types/BaseTypes";
import { Octicons, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import {
    Colors,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
}  from "../../types/Styles";

// Extract colors correctly
const { brand, darkLight } = Colors;

const MCATextInput: React.FC<ITextInput> = ({ label, icon, ...props }) => {
    return (
        <View>
            <LeftIcon pointerEvents="none">
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            {!props.isDate && <StyledTextInput {...props} />}
            {props.isDate && (
                <TouchableOpacity onPress={props.showDatePicker}>
                    <StyledTextInput {...props} />
                </TouchableOpacity>
            )}
            {props.isPassword && (
                <RightIcon onPress={() => props.setHidePassword && props.setHidePassword(!props.hidePassword)}>
                    <Ionicons name={props.hidePassword ? 'eye-off' : 'eye'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    );
};

export default MCATextInput;
