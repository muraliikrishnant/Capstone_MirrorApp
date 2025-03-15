import React, { createContext } from 'react';
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

// Credential context
export const CredentialsContext = React.createContext<{
        storedCredentials: FirebaseAuthTypes.User | null;
        setStoredCredentials: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
    }>({
        storedCredentials: null,
        setStoredCredentials: () => {},
    });