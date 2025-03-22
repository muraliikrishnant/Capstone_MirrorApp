import { FullUser } from "./Types";

export const isFullUser = (fullUser: FullUser): fullUser is FullUser => {
    return (fullUser as FullUser).authUser !== undefined;
};
