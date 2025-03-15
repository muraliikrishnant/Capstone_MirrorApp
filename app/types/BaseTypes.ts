import { Octicons } from "@expo/vector-icons";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

enum MessageType {
    BLANK = "BLANK",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    INFO = "INFO",
};

interface ITextInput {
    label: string;
    icon: React.ComponentProps<typeof Octicons>['name'];
    isPassword?: boolean;
    hidePassword?: boolean;
    setHidePassword?: (hidePassword: boolean) => void;
    [key: string]: any; // This allows for any additional props
};

interface IPageProps {
    welcome?: boolean;
};

interface IButtonProps {
    google?: boolean;
    text?: boolean;
    mini?: boolean;
};

interface ITypeProps {
    type: MessageType;
};

interface Image {
    name: string;
    image: any;
};

interface IDirectionButtonProps {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};

class StoredItem {
    value?: FirebaseAuthTypes.User | null;
    hasValue?: boolean;
};

class BackgroundImage {
    private static images: Array<Image> = [
        { name: 'left.png', image: require('../../assets/images/left.png') },
        { name: 'right.png', image: require('../../assets/images/right.png') },
        { name: 'rear.png', image: require('../../assets/images/rear.png') },
    ];

    static GetImage = (name: string) => {
        const found = BackgroundImage.images.find(e => e.name === name);
        return found ? found.image : null;
    };
};

export { IButtonProps, IDirectionButtonProps, IPageProps, StoredItem,
    ITextInput, ITypeProps, BackgroundImage, MessageType };
