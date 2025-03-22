import React from "react";
//import { useEffect, useContext } from "react";
//import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
//import { CredentialsContext } from "../../types/CredentialsContext";
//import { FIREBASE_INIT_AUTH } from "../../../config/Firebase";

// import screens
import LoadingScreen from "../../screens/LoadingScreen";
import Login from "../../screens/Login";
import Signup from "../../screens/Signup";
import Home from "../../screens/Home";

// colors
import { Colors } from "../../types/Styles";

const Stack = createNativeStackNavigator();
const { primary, tertiary } = Colors;

const RootStack = () => {
	/*const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

	const onAuthStateChanged = (activeUser: FirebaseAuthTypes.User | null) => {
	  if (activeUser !== null) {
		setStoredCredentials(activeUser);
	  } else {
		setStoredCredentials(null);
	  };
	  console.log('state changed');
	};
  
	useEffect(() => {
	  const subscriber = FIREBASE_INIT_AUTH().onAuthStateChanged(onAuthStateChanged);
	  return subscriber; // unsubscribe on unmount
	}, []);*/

	return (
		<NavigationContainer>
			<Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "transparent"
                    },
                    headerTintColor: tertiary,
                    headerTransparent: true,
                    headerTitle: "",
                    headerLeft: () => (
                        <View style={{ paddingLeft: 20 }}>
                            {/* Add your custom header left component here */}
                        </View>
                    ),
                    headerShown: false
                }}
                initialRouteName="Login"
            >
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Signup" component={Signup} />
				<Stack.Screen options={{ headerTintColor: primary }} name="Home" component={Home} />
			</Stack.Navigator>
		</NavigationContainer>
    )
};

export default RootStack;
