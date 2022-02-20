import React from "react";
import { View } from "react-native";

import { useFonts } from "expo-font";

import Routes from "./screens/index";
import "./config/firebase_init";

function App() {
  let [fontsLoaded] = useFonts({
    "nunito-extra-light": require("./assets/fonts/NunitoSans-ExtraLight.ttf"),
    "nunito-light": require("./assets/fonts/NunitoSans-Light.ttf"),
    "nunito-regular": require("./assets/fonts/NunitoSans-regular.ttf"),
    "nunito-semi-bold": require("./assets/fonts/NunitoSans-SemiBold.ttf"),
    "nunito-bold": require("./assets/fonts/NunitoSans-Bold.ttf"),
    "nunito-extra-bold": require("./assets/fonts/NunitoSans-ExtraBold.ttf"),
    "nunito-light-italic": require("./assets/fonts/NunitoSans-LightItalic.ttf"),
    "nunito-italic": require("./assets/fonts/NunitoSans-Italic.ttf"),
    "nunito-bold-italic": require("./assets/fonts/NunitoSans-BoldItalic.ttf"),
  });

  if (fontsLoaded) {
    return <Routes />;
  } else {
    return <View />;
  }
}

export default App;
