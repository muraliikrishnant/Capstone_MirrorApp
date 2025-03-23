import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Alert, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Fontisto, FontAwesome, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { FIREBASE_INIT_AUTH } from "../../config/Firebase";
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
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getDevice, getDeviceForUser, saveDevicePreset } from "../data/entity/Devices";
import { Device, FullUser } from "../data/model/Types";

const { primary, red } = Colors;

const Home = () => {
    const [backgroundImage, setBackgroundImage] = useState<BackgroundImage>(BackgroundImage.GetImage("rear.png"));
    const [messageText, setMessageText] = useState<IMirrorAngle | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [storedItem, setStoredItem] = useState<any>(null);
    const [device, setDevice] = useState<Device | null>(null);
    //const [intervalIdRef, setIntervalIdRef] = useState<ReturnType<typeof setInterval> | null>(null);
    var socket = useRef(new WebSocket("ws://92d4-96-248-104-219.ngrok-free.app")).current;

    const getImage = (name: string) => {
        setBackgroundImage(BackgroundImage.GetImage(name));
    };

    const savePreset = async () => {
        if (!device) {
            console.log("Device Not found");
            return;
        };
        // Save the preset
        if (messageText?.pitch !== undefined) {
            device.pitch = messageText.pitch;
        };
        if (messageText?.yaw !== undefined) {
            device.yaw = messageText.yaw;
        };

        await saveDevicePreset(device);
        console.log("Preset saved...");
    };

    const loadPreset = async () => {
        if (!device || !messageText) {
            console.log("Device Not found");
            return;
        };
        // Load preset
        const fsDevice = await getDevice(device.id);
        console.log(fsDevice);
        if (fsDevice?.pitch !== undefined && fsDevice?.yaw !== undefined) {
            setMessageText({ pitch: fsDevice.pitch, yaw: fsDevice.yaw });
        };
        console.log("Preset loaded...")
    };

    const signOut = () => {
        FIREBASE_INIT_AUTH().signOut().then(() => {
            setStoredItem(null);
            console.log('in signout');
        }).catch(error => {
            console.error(error);
        });
    };

    // Websocket connection
    const socketConnect = () => {
        //var socket = new WebSocket("ws://92d4-96-248-104-219.ngrok-free.app");
        socket.onopen = () => {
            setConnected(true);
            const fetchItem = async () => {
                const item = await getAppStorageItem(MA_CREDENTIAL) as FullUser;
                //console.log(item);
                setStoredItem(item);
                socket.send(JSON.stringify(["Connected for " + item?.user.email]));
                setDevice(item?.device);
            };
            setTimeout(fetchItem, 1000);
            /*if (intervalIdRef !== null) {
                clearInterval(intervalIdRef);
            }*/
            console.log('Connected to the server');
        };
        socket.onclose = (e) => {
            setConnected(false);
            console.log('Disconnected. Check internet or server.');
            // Reconnect if socket disconnects.
            setTimeout(socketConnect.bind(this), 1000);
            //setIntervalIdRef(setInterval(socketConnect, 10000));
        };
        socket.onerror = (e) => {
            console.log(e || 'An error occurred');
        };
        socket.onmessage = (e) => {
            try {
                const receivedData = e.data;
                console.log('Received data - ' + receivedData);
                setMessageText(JSON.parse(receivedData));
            } catch (error) {
                console.error("Error parsing JSON", error);
            };
        };
    };

    socketConnect();

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
                        <StyledInputLabel fontSize="25px">
                            {messageText?.pitch}
                        </StyledInputLabel>
                        <VLine/>
                        <StyledInputLabel fontSize="25px">
                            {messageText?.yaw}
                        </StyledInputLabel>
                    </ExtraView>
                    <ExtraView>
                        <TextLink onPress={() => savePreset()}>
                            <TextLinkContent>Save preset</TextLinkContent>
                        </TextLink>
                        <VLine/>
                        <TextLink onPress={() => loadPreset()}>
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
                <ButtonText text={true}>User: {storedItem?.user?.email}</ButtonText>
                <ButtonText text={true}>Device ID: {storedItem?.user?.deviceCode}</ButtonText>
            </BottomContainerRow>
        </StyledContainer>
    );
};

export default Home;
