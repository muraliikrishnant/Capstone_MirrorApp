import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_INIT_AUTH } from '../../config/Firebase';
import {
  Avatar,
  DashboardImage,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  InnerContainer,
  DashboardContainer,
  ButtonText,
  Line,
} from "../types/Styles";

// Async storage
//import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
import { CredentialsContext } from '../types/CredentialsContext';

const Dashboard = ({ navigation }: { navigation: NavigationProp<any> }) => {
  // credentials context
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  //const { name, email, photoUrl } = storedCredentials;

  const name = "", email = "", photoUrl = ""

  const AvatarImg = photoUrl
    ? {
        uri: photoUrl,
      }
    : require('../../assets/images/Car.png');

  const clearLogin = () => {
    // Clear the credentials
    FIREBASE_INIT_AUTH().signOut();
    navigation.navigate('Loading');
  };

  return (
    <>
      <StatusBar style="light" />
      <InnerContainer>
        <DashboardImage resizeMode="cover" source={require('../../assets/images/Car.png')} />

        <DashboardContainer>
          <PageTitle welcome={true}>Welcome! Buddy</PageTitle>
          <SubTitle welcome={true}>{'Muralii Krishnan Thirumalai'}</SubTitle>
          <SubTitle welcome={true}>{'m.thiru@mailinator.com'}</SubTitle>

          <StyledFormArea>
            <Avatar resizeMode="cover" source={AvatarImg} />

            <Line />
            <StyledButton onPress={clearLogin}>
              <ButtonText>Logout</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </DashboardContainer>
      </InnerContainer>
    </>
  );
};

export default Dashboard;