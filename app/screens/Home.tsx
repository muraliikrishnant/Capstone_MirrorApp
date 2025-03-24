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
import { BackgroundImage, IMirrorAngle, MovementType } from "../types/BaseTypes";
import { getAppStorageItem, setAppStorageItem } from "../types/Storage";
import { MA_CREDENTIAL } from "../types/Constants";
import { saveDevicePreset } from "../data/entity/Users";
import { FullUser } from "../data/model/Types";

const { primary, red } = Colors;
const MAX = 20, MIN = -20;

const Home = () => {
    const [backgroundImage, setBackgroundImage] = useState<BackgroundImage>(BackgroundImage.GetImage("rear.png"));
    const [messageText, setMessageText] = useState<IMirrorAngle | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [storedItem, setStoredItem] = useState<FullUser | null>(null);
    //const [intervalIdRef, setIntervalIdRef] = useState<ReturnType<typeof setInterval> | null>(null);
    var socket = useRef(new WebSocket("ws://0ffd-96-248-104-219.ngrok-free.app")).current;

    const getImage = (name: string) => {
        setBackgroundImage(BackgroundImage.GetImage(name));
    };

    const getAngleInfo = () => {
        return {
            pitch: storedItem?.user?.pitch,
            yaw: storedItem?.user?.yaw,
        };
    };

    const validateAngle = (value: number): boolean => {
        return value >= MIN && value <= MAX ? true : false;
    };

    const changeAngle = (movementType: MovementType) => {
        if (messageText) {
            switch (movementType) {
                case MovementType.UP:
                    const yawUp = messageText.yaw + 1;
                    messageText.yaw = validateAngle(yawUp) ? yawUp : messageText.yaw;
                    break;
                case MovementType.DOWN:
                    const yawDown = messageText.yaw - 1;
                    messageText.yaw = validateAngle(yawDown) ? yawDown : messageText.yaw;
                    break;
                case MovementType.LEFT:
                    const pitchLeft = messageText.pitch - 1;
                    messageText.pitch = validateAngle(pitchLeft) ? pitchLeft : messageText.pitch;
                    break;
                case MovementType.RIGHT:
                    const pitchRight = messageText.pitch + 1;
                    messageText.pitch = validateAngle(pitchRight) ? pitchRight : messageText.pitch;
                    break;
            };
            setMessageText({ pitch: messageText.pitch, yaw: messageText.yaw });
            socket.send(JSON.stringify(messageText));
        };
    };

    const savePreset = async () => {
        // Save the preset
        if (storedItem?.user) {
            if (messageText?.pitch !== undefined) {
                storedItem.user.pitch = messageText.pitch;
            };
            if (messageText?.yaw !== undefined) {
                storedItem.user.yaw = messageText.yaw;
            };

            await saveDevicePreset(storedItem?.user);
            await setAppStorageItem(MA_CREDENTIAL, storedItem);
            console.log("Preset saved...");
        } else {
            console.log("Preset couldn't be saved...");
        };
    };

    const loadPreset = async () => {
        // Load preset
        const angleInfo = getAngleInfo();
        console.log(angleInfo);
        if (angleInfo?.pitch !== undefined && angleInfo?.yaw !== undefined) {
            setMessageText({ pitch: angleInfo.pitch, yaw: angleInfo.yaw });
        };
        console.log("Preset loaded...")
    };

    const signOut = () => {
        FIREBASE_INIT_AUTH().signOut().then(() => {
            setStoredItem(null);
        }).catch(error => {
            console.error(error);
        });
    };

    const moveLeft = () => {
        changeAngle(MovementType.LEFT);
    };

    const moveRight = () => {
        changeAngle(MovementType.RIGHT);
    };

    const moveUp = () => {
        changeAngle(MovementType.UP);
    };

    const moveDown = () => {
        changeAngle(MovementType.DOWN);
    };

    // Websocket connection
    const socketConnect = () => {
        socket.onopen = () => {
            setConnected(true);
            const fetchItem = async () => {
                const item = await getAppStorageItem(MA_CREDENTIAL) as FullUser;
                //console.log(item);
                setStoredItem(item);
                socket.send(JSON.stringify(["Connected for " + item?.user.email]));
            };
            setTimeout(fetchItem, 1000);
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
                        <DirectionButton onPress={() => moveLeft()}>
                            <Fontisto name="arrow-left" size={20}/>
                        </DirectionButton>
                        <DirectionButton onPress={() => moveUp()}>
                            <Fontisto name="arrow-up" size={20}/>
                        </DirectionButton>
                        <DirectionButton onPress={() => moveDown()}>
                            <Fontisto name="arrow-down" size={20}/>
                        </DirectionButton>
                        <DirectionButton onPress={() => moveRight()}>
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
                <ButtonText text={true}>Name: {storedItem?.user?.firstName} {storedItem?.user?.lastName}</ButtonText>
                <ButtonText text={true}>Email: {storedItem?.user?.email}</ButtonText>
            </BottomContainerRow>
        </StyledContainer>
    );
};

export default Home;
