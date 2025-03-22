import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { Alert, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Fontisto, FontAwesome, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { NavigationProp } from '@react-navigation/native';
import { CredentialsContext } from "../types/CredentialsContext";
import { FIREBASE_INIT_AUTH } from "../../config/Firebase";
import MirrorPosition from "../components/controls/Mirror";
import {
    PageTitle,
    InnerContainer,
    StyledFormArea,
    StyledContainer,
    StyledButton,
    ButtonText,
    Colors,
    ExtraView,
    TextLink,
    TextLinkContent,
    InnerContainerNav,
    DirectionButton,
    RightView,
    ControlImage,
    ImageContainer,
    VLine,
    BottomContainerRow,
    StyledInputLabel,
} from "../types/Styles";
import { BackgroundImage, IMirrorAngle } from "../types/BaseTypes";
import { getAppStorageItem } from "../types/Storage";
import { MA_CREDENTIAL } from "../types/Constants";

const { primary, red } = Colors;

const Home = () => {
    const [backgroundImage, setBackgroundImage] = useState<BackgroundImage>(BackgroundImage.GetImage("rear.png"));
    const [messageText, setMessageText] = useState<IMirrorAngle | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [storedItem, setStoredItem] = useState<any>(null);

    const getImage = (name: string) => {
        setBackgroundImage(BackgroundImage.GetImage(name));
    };

    const setPreset = () => {
        // Save the preset
        console.log("Preset saved");
    };

    const signOut = () => {
        FIREBASE_INIT_AUTH().signOut().then(() => {
            setStoredItem(null);
            console.log('in signout');
        }).catch(error => {
            console.error(error);
        });
    };

    // Control back button press
    useEffect(() => {
        const onBackPress = () => {
            Alert.alert("Exit app", "Do you want to exit?", [
                {
                    text: "Cancel",
                    onPress: () => {},
                },
                {
                    text: "Yes",
                    onPress: () => {
                        BackHandler.exitApp()
                    },
                }
            ], {
                cancelable: false,
            });
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => backHandler.remove();
    }, []);

    // Websocket connection
    useEffect(() => {
        const socket = new WebSocket("ws://9490-96-248-104-219.ngrok-free.app");
        socket.onopen = () => {
            setConnected(true);
            const fetchItem = async () => {
                const item = await getAppStorageItem(MA_CREDENTIAL) as any;
                console.log(item);
                setStoredItem(item);
            };
            fetchItem();
            console.log('Connected to the server');
        };
        socket.onclose = (e) => {
            setConnected(false);
            console.log('Disconnected. Check internet or server.');
        };
        socket.onerror = (e) => {
            console.log((e as any).message || 'An error occurred');
        };
        socket.onmessage = (e) => {
            try {
                setMessageText(JSON.parse(e.data));
            } catch (error) {
                console.error("Error parsing JSON", error);
            };
        };
    }, []);

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <RightView>
                <TextLink onPress={signOut}>
                    <FontAwesome name="sign-out" size={24} color={red} />
                </TextLink>
            </RightView>
            <InnerContainer>
                <PageTitle>Dashboard</PageTitle>
                <ImageContainer>
                    <ControlImage source={backgroundImage} />
                </ImageContainer>
                
            <StyledFormArea>
                    <ExtraView>
                        <StyledInputLabel>
                            {messageText?.pitch}
                        </StyledInputLabel>
                        <VLine/>
                        <StyledInputLabel>
                            {messageText?.yaw}
                        </StyledInputLabel>
                    </ExtraView>
                    <ExtraView>
                        <TextLink onPress={setPreset}>
                            <TextLinkContent>Set preset</TextLinkContent>
                        </TextLink>
                        <VLine/>
                        <TextLink>
                            <TextLinkContent>Load preset</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                    <InnerContainerNav>
                        <DirectionButton>
                            <Fontisto name="arrow-left" size={20}/>
                        </DirectionButton>
                        <DirectionButton>
                            <Fontisto name="arrow-up" size={20}/>
                        </DirectionButton>
                        <DirectionButton>
                            <Fontisto name="arrow-down" size={20}/>
                        </DirectionButton>
                        <DirectionButton>
                            <Fontisto name="arrow-right" size={20}/>
                        </DirectionButton>
                    </InnerContainerNav>

                    <InnerContainerNav>
                        <StyledButton mini={true} onPress={() => getImage("left.png")}>
                            <Fontisto name="arrow-left" size={20} color={primary}/>
                            <MaterialCommunityIcons name="mirror" size={24} color={primary}/>
                        </StyledButton>
                        <VLine/>
                        <StyledButton mini={true} onPress={() => getImage("rear.png")}>
                            <Octicons name="mirror" size={24} color={primary}/>
                        </StyledButton>
                        <VLine/>
                        <StyledButton mini={true} onPress={() => getImage("right.png")}>
                            <MaterialCommunityIcons name="mirror" size={24} color={primary}/>
                            <Fontisto name="arrow-right" size={20} color={primary}/>
                        </StyledButton>
                    </InnerContainerNav>
                </StyledFormArea>
            </InnerContainer>
            <BottomContainerRow>
                <ButtonText text={true}>User: {storedItem?.email}</ButtonText>
                <ButtonText text={true}>Device ID: 1234</ButtonText>
            </BottomContainerRow>
        </StyledContainer>
    );
};

export default Home;
