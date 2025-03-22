import React from "react";
import { ExtraView, StyledInputLabel, VLine } from "../../types/Styles";
import { IMirrorAngle } from "../../types/BaseTypes";

const MirrorPosition = () => {
    const [messageText, setMessageText] = React.useState<IMirrorAngle | null>(null);
    const wsUrl = "";
    var ws = React.useRef(new WebSocket(wsUrl)).current;
    console.log(wsUrl);
    
    React.useEffect(() => {
        const serverMessagesList: string[] = [];
        ws.onopen = () => {
            console.log('Connected to the server');
        };
        ws.onclose = (e) => {
            console.log('Disconnected. Check internet or server.');
        };
        ws.onerror = (e) => {
            console.log((e as any).message || 'An error occurred');
        };
        ws.onmessage = (e) => {
            try {
                setMessageText(JSON.parse(e.data));
            } catch (error) {
                console.error("Error parsing JSON", error);
            };
        };
    }, []);
    
    return (
        <ExtraView>
            <StyledInputLabel>
                {messageText?.pitch}
            </StyledInputLabel>
            <VLine/>
            <StyledInputLabel>
                {messageText?.yaw}
            </StyledInputLabel>
        </ExtraView>
    );
};

export default MirrorPosition;
