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
    deviceId: string;
};
