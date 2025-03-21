import React from "react";
import { useState, useContext } from "react";
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
} from "../types/Styles";
import { BackgroundImage } from "../types/BaseTypes";

const { primary, red } = Colors;

const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [backgroundImage, setBackgroundImage] = useState<BackgroundImage>(BackgroundImage.GetImage("rear.png"));
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    //const [storageItem, setStorageItem] = useState<StoredItem | null>(null);

    const getImage = (name: string) => {
        setBackgroundImage(BackgroundImage.GetImage(name));
    };

    const setPreset = () => {
        // Save the preset
        console.log("Preset saved");
    };

    const signOut = () => {
        FIREBASE_INIT_AUTH().signOut().then(() => {
            setStoredCredentials(null);
            console.log('in signout');
        }).catch(error => {
            console.error(error);
        });
    };

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
                    <MirrorPosition></MirrorPosition>
                    <ExtraView>
                        <TextLink>
                            <TextLinkContent>Get preset</TextLinkContent>
                        </TextLink>
                        <VLine/>
                        <TextLink onPress={setPreset}>
                            <TextLinkContent>Set preset</TextLinkContent>
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
                <ButtonText text={true}>User: </ButtonText>
                <ButtonText text={true}>Device ID: 1234</ButtonText>
            </BottomContainerRow>
        </StyledContainer>
    );
};

export default Home;
