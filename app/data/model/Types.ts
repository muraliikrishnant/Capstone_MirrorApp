export interface Role {
    id: string;
    code: string;
    name: string;
};

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    parent: Role;
    role: Role;
};

export interface Device {
    id: string;
    pitch: number;
    yaw: number;
    user: User;
};

export interface Register {
    user: User;
    deviceId: string;
};
