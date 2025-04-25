import React, { useEffect, useRef, useState } from "react";
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
import ToggleSwitch from "../components/controls/ToggleSwitch";

const { primary, red } = Colors;
const MAX = 20, MIN = -20;

const Home = () => {
    // Initialize local mirror angle so mirror UI updates with button presses.
    const [backgroundImage, setBackgroundImage] = useState(BackgroundImage.GetImage("rear.png"));
    const [messageText, setMessageText] = useState<IMirrorAngle>({ pitch: 0, yaw: 0 });
    const [connected, setConnected] = useState<boolean>(false);
    const [storedItem, setStoredItem] = useState<FullUser | null>(null);
    const [hideButton, setHideButton] = useState<boolean>(false);
    const [pitch, setPitch] = useState<number>(0);
    const [yaw, setYaw] = useState<number>(0);
    // Track waiting state, auto-adjust flag, and whether we've received the initial base angle.
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [autoAdjust, setAutoAdjust] = useState<boolean>(false); 
    const [hasReceivedBaseAngle, setHasReceivedBaseAngle] = useState<boolean>(false);

    // Initialize WebSocket connection using your ngrok URL.
    const socket = useRef(new WebSocket("wss://car-rutgers.loca.lt/")).current;

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
        return value >= MIN && value <= MAX;
    };

    // Update the local angle based solely on button presses.
    // Up/Down buttons update pitch (rotateX), left/right buttons update yaw (rotateY).
    const changeAngle = (movementType: MovementType) => {
        if (messageText) {
            let updatedAngle = { ...messageText };
            switch (movementType) {
                case MovementType.UP:
                    const pitchUp = updatedAngle.pitch + 1;
                    if (validateAngle(pitchUp)) updatedAngle.pitch = pitchUp;
                    break;
                case MovementType.DOWN:
                    const pitchDown = updatedAngle.pitch - 1;
                    if (validateAngle(pitchDown)) updatedAngle.pitch = pitchDown;
                    break;
                case MovementType.LEFT:
                    const yawLeft = updatedAngle.yaw - 1;
                    if (validateAngle(yawLeft)) updatedAngle.yaw = yawLeft;
                    break;
                case MovementType.RIGHT:
                    const yawRight = updatedAngle.yaw + 1;
                    if (validateAngle(yawRight)) updatedAngle.yaw = yawRight;
                    break;
            }
            console.log("New local angle:", updatedAngle);
            setMessageText(updatedAngle);
        }
    };

    // Send explicit angle updates (pitch and yaw only) to the server when the send angle button is pressed.
    const sendAngleToServer = () => {
        if (messageText && socket.readyState === WebSocket.OPEN) {
            const payload = { pitch: messageText.pitch, yaw: messageText.yaw };
            console.log("Sending explicit angle payload:", payload);
            socket.send(JSON.stringify(payload));
            setIsWaiting(true);
        }
    };

    // Handle auto-adjust toggle separately.
    const handleToggleAutoAdjust = () => {
        const newVal = !autoAdjust;
        setAutoAdjust(newVal);
        // Send a separate JSON packet for autoAdjust toggle.
        if (socket.readyState === WebSocket.OPEN) {
            const autoPayload = { autoAdjust: newVal ? "True" : "False" };
            console.log("Sending autoAdjust payload:", autoPayload);
            socket.send(JSON.stringify(autoPayload));
        }
    };

    const savePreset = async () => {
        if (storedItem?.user && messageText) {
            setPitch(messageText.pitch);
            setYaw(messageText.yaw);
            storedItem.user.pitch = messageText.pitch;
            storedItem.user.yaw = messageText.yaw;
            await saveDevicePreset(storedItem.user);
            await setAppStorageItem(MA_CREDENTIAL, storedItem);
            console.log("Preset saved...");
        } else {
            console.log("Preset couldn't be saved...");
        }
    };

    const loadPreset = async () => {
        const angleInfo = getAngleInfo();
        console.log("Loading preset:", angleInfo);
        if (angleInfo?.pitch !== undefined && angleInfo?.yaw !== undefined) {
            setMessageText({ pitch: angleInfo.pitch, yaw: angleInfo.yaw });
        }
        console.log("Preset loaded...");
    };

    const signOut = () => {
        FIREBASE_INIT_AUTH().signOut().then(() => {
            setStoredItem(null);
        }).catch(error => {
            console.error(error);
        });
    };

    const moveLeft = () => changeAngle(MovementType.LEFT);
    const moveRight = () => changeAngle(MovementType.RIGHT);
    const moveUp = () => changeAngle(MovementType.UP);
    const moveDown = () => changeAngle(MovementType.DOWN);

    // WebSocket connection setup.
    const socketConnect = () => {
        socket.onopen = () => {
            setConnected(true);
            const fetchItem = async () => {
                const item = await getAppStorageItem(MA_CREDENTIAL) as FullUser;
                setStoredItem(item);
                setPitch(item?.user.pitch);
                setYaw(item?.user.yaw);
                socket.send(JSON.stringify({ info: "Connected", email: item?.user.email }));
            };
            setTimeout(fetchItem, 1000);
            console.log("Connected to the server");
        };

        socket.onclose = (e) => {
            setConnected(false);
            console.log("Disconnected. Check internet or server.");
            setTimeout(socketConnect, 1000);
        };

        socket.onerror = (e) => {
            console.log(e || "An error occurred");
        };

        socket.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                console.log("Received data:", data);
                if (data.status) {
                    if (data.status === "waiting") {
                        setIsWaiting(true);
                    } else if (data.status === "ready") {
                        // Update local base angle from the ready packet.
                        setMessageText({ pitch: data.pitch, yaw: data.yaw });
                        setIsWaiting(false);
                        console.log("Updated local angle from ready message:", data);
                    }
                } else {
                    // Assume it's the initial base angle if not already set.
                    if (!hasReceivedBaseAngle) {
                        setMessageText(data);
                        setHasReceivedBaseAngle(true);
                        console.log("Updated local base angle from server:", data);
                    }
                }
            } catch (error) {
                console.error("Error parsing JSON", error);
            }
        };
    };

    socketConnect();

    // Handle Android back button press.
    useEffect(() => {
        const onBackPress = () => {
            Alert.alert("Exit app", "Do you want to exit?", [
                { text: "Cancel", onPress: () => {} },
                { text: "Yes", onPress: () => BackHandler.exitApp() }
            ], { cancelable: false });
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
                    {/* Mirror image rotates based on local pitch and yaw values. */}
                    <ControlImage 
                        source={backgroundImage} 
                        style={{
                            transform: [
                                { rotateX: `${messageText?.pitch || 0}deg` },
                                { rotateY: `${messageText?.yaw || 0}deg` }
                            ]
                        }}
                    />
                </ImageContainer>
                <StyledFormArea>
                    <ExtraView>
                        <StyledInputLabel fontSize="25px">
                            {messageText?.pitch}
                        </StyledInputLabel>
                        <VLine />
                        <StyledInputLabel fontSize="25px">
                            {messageText?.yaw}
                        </StyledInputLabel>
                    </ExtraView>
                    <ExtraView>
                        <TextLink onPress={savePreset}>
                            <TextLinkContent disabled={false}>Save preset</TextLinkContent>
                        </TextLink>
                        <VLine />
                        <TextLink disabled={pitch === undefined} onPress={loadPreset}>
                            <TextLinkContent>Load preset</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                    <InnerContainerNav>
                        <DirectionButton onPress={moveLeft}>
                            <Fontisto name="arrow-left" size={20} />
                        </DirectionButton>
                        <DirectionButton onPress={moveUp}>
                            <Fontisto name="arrow-up" size={20} />
                        </DirectionButton>
                        <DirectionButton onPress={moveDown}>
                            <Fontisto name="arrow-down" size={20} />
                        </DirectionButton>
                        <DirectionButton onPress={moveRight}>
                            <Fontisto name="arrow-right" size={20} />
                        </DirectionButton>
                    </InnerContainerNav>
                    {/* Send Angle button sends only pitch and yaw. */}
                    <StyledButton onPress={sendAngleToServer} disabled={isWaiting || autoAdjust}>
                        <ButtonText>
                            {autoAdjust 
                                ? "cannot use during dl inference" 
                                : (isWaiting ? "Waiting..." : "Send Angle")}
                        </ButtonText>
                    </StyledButton>
                    {/* Auto-Adjust Toggle with Label */}
                    <ExtraView style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <StyledInputLabel fontSize="16px" style={{ marginRight: 10 }}>
                            Use Auto-Adjust DL Model
                        </StyledInputLabel>
                        <ToggleSwitch value={autoAdjust} onToggle={handleToggleAutoAdjust} />
                    </ExtraView>
                    {hideButton && (
                        <InnerContainerNav>
                            <StyledButton mini={true} onPress={() => getImage("left.png")}>
                                <Fontisto name="arrow-left" size={20} color={primary} />
                                <MaterialCommunityIcons name="mirror" size={24} color={primary} />
                            </StyledButton>
                            <VLine />
                            <StyledButton mini={true} onPress={() => getImage("rear.png")}>
                                <Octicons name="mirror" size={24} color={primary} />
                            </StyledButton>
                            <VLine />
                            <StyledButton mini={true} onPress={() => getImage("right.png")}>
                                <MaterialCommunityIcons name="mirror" size={24} color={primary} />
                                <Fontisto name="arrow-right" size={20} color={primary} />
                            </StyledButton>
                        </InnerContainerNav>
                    )}
                </StyledFormArea>
            </InnerContainer>
            <BottomContainerRow>
                <ButtonText text={true}>
                    Name: {storedItem?.user?.firstName} {storedItem?.user?.lastName}
                </ButtonText>
                <ButtonText text={true}>
                    Email: {storedItem?.user?.email}
                </ButtonText>
            </BottomContainerRow>
        </StyledContainer>
    );
};

export default Home;
