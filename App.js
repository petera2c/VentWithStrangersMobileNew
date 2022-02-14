import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
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
  });

  if (fontsLoaded) {
    return <Routes />;
  } else {
    return <AppLoading />;
  }
}

export default App;
