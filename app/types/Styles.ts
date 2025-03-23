import styled from 'styled-components';
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Constants from 'expo-constants';
import { IButtonProps, IDirectionButtonProps, ILabelProps, IPageProps, ITypeProps } from './BaseTypes';

const statusBarHeight = Constants.statusBarHeight;

//colors
export const Colors = {
    primary: '#ffffff',
    secondary: '#E5E7EB',
    tertiary: '#1F2937',
    darkLight: '#9CA3AF',
    brand: '#6D28D9',
    green: '#10B981',
    red: '#EF4444',
};

const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

export const StyledContainer = styled(View)`
    flex: 1;
    padding: 25px;
    padding-top: ${statusBarHeight + 30}px;
    background-color: ${primary};
    height: 100%;
`;

export const InnerContainer = styled(View)`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const StyledFormArea = styled(View)`
    width: 90%;
`;

export const LeftIcon = styled(View)`
    left: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

export const Line = styled(View)`
    height: 1px;
    width: 100%;
    background-color: ${darkLight};
    margin-vertical: 10px;
`;

export const VLine = styled(View)`
    height: 100%;
    width: 1px;
    background-color: ${darkLight};
    margin: 20px;
`;

export const ExtraView = styled(View)`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;

export const RightView = styled(View)`
    align-self: flex-end;
`;

export const ImageContainer = styled(View)`
    width: 225px;
    height: 200px;
    justify-content: center;
    perspective: 500px; /* Add perspective for 3D effect */
`;

export const InnerContainerNav = styled(View)`
    flex-direction: row;
    align-items: center;
    background-color: #ffffff;
    border-radius: 50%;
    padding: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    justify-content: center;
`;

export const InnerContainerRow = styled(View)`
    display: flex;
    width: 100%;
`;

export const BottomContainerRow = styled(View)`
    bottom: 0;
    position: absolute;
    color: ${primary};
    height: 80px;
    width: 100%;
    padding: 20px;
`;

export const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)`
    flex: 1;
`;

export const DashboardContainer = styled(InnerContainer)`
  padding: 25px;
  padding-top: 10px;
  justify-content: center;
`;

export const PageTitle = styled(Text)<IPageProps>`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;

    ${(props) =>
        props.welcome &&
        `
        font-size: 35px;
    `}
`;

export const SubTitle = styled(Text)<IPageProps>`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};

    ${(props) =>
        props.welcome &&
        `
        margin-bottom: 5px;
        font-weight: normal;
    `}
`;

export const StyledInputLabel = styled(Text)<ILabelProps>`
    color: ${tertiary};
    text-align: left;
    ${(props) =>
        props.fontSize && `
            font-size: ${props.fontSize};
        `
    }
`;

export const ButtonText = styled(Text)<IButtonProps>`
    color: ${primary};
    font-size: 16px;

    ${(props) =>
        props.text == true &&
        `
        color: black;`
    }
`;

export const MsgBox = styled(Text)<ITypeProps>`
    text-align: center;
    font-size: 13px;
    color: ${props => {
        switch (props.type) {
            case "SUCCESS":
                return green;
            case "FAILED":
                return red;
            case "INFO":
                return brand;
            case "BLANK":
            default:
                return darkLight;
        }
    }};
`;

export const ExtraText = styled(Text)`
    justify-content: center;
    align-items: center;
    color: ${tertiary};
    font-size: 15px;
`;

export const TextLinkContent = styled(Text)`
    color: ${red};
    font-size: 15px;
`;

export const StyledTextInput = styled(TextInput)`
    background-color: ${secondary};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 5px;
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
`;

export const RightIcon = styled(TouchableOpacity)`
    right: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

export const DirectionButton = styled(TouchableOpacity)<IDirectionButtonProps>`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: ${secondary};
    color: ${primary};
    border: none;
    cursor: pointer;
    margin: 10px;
    transition: background-color 0.3s ease;
    align-items: center;
    justify-content: center;
`;

export const StyledButton = styled(TouchableOpacity)<IButtonProps>`
    padding: 15px;
    background-color: ${brand};
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-vertical: 5px;
    height: 60px;
    flex-direction: row;

    ${(props) =>
        props.google == true &&
        `
        background-color: ${green};
        justify-content: center;`
    }
    ${(props) =>
        props.mini == true && `
        width: 80px;
        `
    }
`;

export const TextLink = styled(TouchableOpacity)`
`;

export const PageLogo = styled(Image)`
    width: 250;
    height: 200;
`;

export const ControlImage = styled(Image)`
    transform-origin: center;
    transition: transform 0.5s ease-in-out; /* Add transition for smooth animation */
`;

export const Avatar = styled(Image)`
  width: 100px;
  height: 100px;
  margin: auto;
  border-radius: 50px;
  border-width: 2px;
  border-color: ${secondary};
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const DashboardImage = styled(Image)`
  height: 50%;
  min-width: 100%;
`;
