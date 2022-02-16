import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { styles } from "../../../styles";

function ScreenContainer({ children, style }) {
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
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <ScrollView style={{ flex: 1, ...styles.bgBlue2, ...style }}>
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default ScreenContainer;
