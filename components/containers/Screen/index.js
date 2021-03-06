import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { faChevronLeft } from "@fortawesome/pro-solid-svg-icons/faChevronLeft";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { styles } from "../../../styles";

import { getKeyboardVerticalOffSet } from "../../../util";

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
      <StatusBar hidden={false} style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={getKeyboardVerticalOffSet()}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            ...styles.bgWhite,
            marginTop: getStatusBarHeight(),
          }}
        >
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
                  size={24}
                  style={{ ...styles.colorMain }}
                />
                <Text style={{ ...styles.fs18, ...styles.colorMain }}>
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ flex: 1 }}>
            {Title && <Title />}

            <View style={{ flex: 1, ...styles.bgBlue2, ...style }}>
              {children}
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

export default ScreenContainer;
