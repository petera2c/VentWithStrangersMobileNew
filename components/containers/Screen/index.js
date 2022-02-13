import React from "react";
import { SafeAreaView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { getStatusBarHeight } from "react-native-status-bar-height";

import BottomHeader from "../../navigations/BottomHeader";

import { styles } from "../../../styles";

function ScreenContainer({ children, navigation }) {
  return (
    <PaperProvider
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: "tomato",
          accent: "yellow",
        },
      }}
    >
      <StatusBar style="dark" />

      <SafeAreaView style={{ flex: 1, ...styles.bgWhite }}>
        <View style={{ flex: 1, backgroundColor: "red" }}>{children}</View>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default ScreenContainer;
