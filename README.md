# Introduction

- The project uses [expo](https://expo.dev/) to build the native iOS and Android apps.
- The project also uses [firebase](https://firebase.google.com/) for hosting.
- Project tech Stack:
    - expo
    - react
    - typescript

# Features

- Signup using Email and Password.
    - Form validation using Formik and Yup.
    - ? Calendar control for date of birth.
- Authentication.
- Dashboard with mirror controls.
- Data storage with Firestore.
- Sign out.

# Getting Started

- `brew` is a native iOS package manager available by default in a Mac laptop.
- Install [`asdf`](https://asdf-vm.com/) using `brew`.
    ```shell
    brew install asdf
    ```
    > Instead of using `npm` a universal package manager `asdf` is used.
    >
    > `asdf` requires additional setup before the next steps, which is not the scope of this document. They are found [here](https://asdf-vm.com/guide/getting-started.html).
- Add `nodejs` plugin using `asdf` and install the latest version.
    ```shell
    asdf plugin add nodejs
    asdf install nodejs latest
    ```

# Project setup

- The next step is to install `expo` with a blank template.
    ```shell
    npx create-expo-app MirrorApp --template blank-typescript
    ```
- The `package.json` is already added with the required/necessary packages.
- Then add other packages by installing each from the [`Packages`](#Packages) section below.
- Execute the below commands to add firebase.
    - `npx expo prebuild --clean` and `Y` to continue.

## Packages

### Dependencies

- Expo: `npm i expo`.
    - Expo build properties - config plugin to customize native build properties when using `npx expo prebuild`.
        - Requires configuration in `app.json`.
- Expo status bar: `npx expo install expo-status-bar`.
- Expo Router: `npx expo install expo-router`.
- Expo UI - Android requires this: `npx expo install expo-system-ui`.
- React: `npm i react`.
- React Native: `npm i react-native`.
- React dom: `npm i react-dom`.
- Styled Components require `react-dom`: `npm install styled-components`.
- React Navigation: `npm install @react-navigation/native`.
- React Native Screens: `npx expo install react-native-screens`.
- React Safe area context: `npx expo install react-native-safe-area-context`.
- The Metro bundler for Expo: `npx expo customize metro.config.js`.
- Firebase:
    - Core App: `npx expo install @react-native-firebase/app`.
    - Auth: `npx expo install @react-native-firebase/auth`.
    - Firestore: `npx expo install @react-native-firebase/firestore`.
    - Add the required ios and android configuration in `app.json` including adding the packages to the `plugins` property.
- AsyncStorage to store app data: `npx expo install @react-native-async-storage/async-storage`.
- Splash screen: `npx expo install expo-splash-screen`.
- Formik for form validations: `npm i formik`.
- Moment.Js for date manipulation: `npm i moment`.

### Dev dependencies

- Typescript support for `react`: `npm install --save-dev @types/react`.
- Babel core: `npm install --save-dev @babel/core`.
- Typescript: `npm install --save-dev typescript`.
- Styled-components types for Typescript: `npm install --save-dev @types/styled-components`.

# Run the project

- To create android and ios folders
```shell
npx expo prebuild --clean
```
What we did was to run using `npx expo run:android` and `npx expo run:ios`. Not sure which one to use, lets use prebuild.

To get SHA-1 fingerprint
cd android
./gradlew signingReport
Copy SHA-1 from `debug`.

# Troubleshooting

- Error: No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp()
    - [If you are using React Native, this error can also happen if you did not configure the native side properly.](https://stackoverflow.com/questions/40563140/error-no-firebase-app-default-has-been-created-call-firebase-app-initiali)
