import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface Role {
    id: string;
    code: string;
    name: string;
};

export interface User {
    id: string;
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    parent: Role;
    role: Role;
    pitch: number;
    yaw: number;
};

export interface FullUser {
    authUser: FirebaseAuthTypes.User;
    user: User;
};

export interface Register {
    user: User;
};
