import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { getStatusBarHeight } from "react-native-status-bar-height";

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
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={{ flex: 1, ...styles.bgBlue2, ...styles.pa16 }}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default ScreenContainer;
