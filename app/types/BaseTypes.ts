import { Octicons } from "@expo/vector-icons";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

enum MessageType {
    BLANK = "BLANK",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    INFO = "INFO",
};

enum MovementType {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
};

interface IButtonProps {
    google?: boolean;
    text?: boolean;
    mini?: boolean;
};

interface IDirectionButtonProps {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};

interface IImage {
    name: string;
    image: any;
};

interface ILabelProps {
    fontSize: string;
};

interface IMirrorAngle {
    pitch: number;
    yaw: number;
};

interface IPageProps {
    welcome?: boolean;
};

interface ITextInput {
    label: string;
    icon: React.ComponentProps<typeof Octicons>['name'];
    isPassword?: boolean;
    hidePassword?: boolean;
    setHidePassword?: (hidePassword: boolean) => void;
    [key: string]: any; // This allows for any additional props
};

interface ITypeProps {
    type: MessageType;
};

class StoredItem {
    value?: FirebaseAuthTypes.User | null;
    hasValue?: boolean;
};

class BackgroundImage {
    private static images: Array<IImage> = [
        { name: 'left.png', image: require('../../assets/images/left.png') },
        { name: 'right.png', image: require('../../assets/images/right.png') },
        { name: 'rear.png', image: require('../../assets/images/rear.png') },
    ];

    static GetImage = (name: string) => {
        const found = BackgroundImage.images.find(e => e.name === name);
        return found ? found.image : null;
    };
};

export { BackgroundImage, IButtonProps, IDirectionButtonProps, ILabelProps, IMirrorAngle,
    IPageProps, ITextInput, ITypeProps, MessageType, MovementType, StoredItem };
