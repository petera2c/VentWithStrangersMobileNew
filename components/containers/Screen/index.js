import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { faChevronLeft } from "@fortawesome/pro-solid-svg-icons/faChevronLeft";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { styles } from "../../../styles";

function ScreenContainer({ children, goBack, navigation, style, Title }) {
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
        {goBack && (
          <View style={{ ...styles.bgWhite }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.pa16,
              }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                style={{ ...styles.colorGrey11 }}
              />
              <Text style={{ ...styles.fs16, ...styles.colorGrey11 }}>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }}>
            {Title && <Title />}
            <ScrollView style={{ flex: 1, ...styles.bgBlue2, ...style }}>
              {children}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default ScreenContainer;
