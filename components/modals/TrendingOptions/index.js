import React from "react";

import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { styles } from "../../../styles";

import { getKeyboardVerticalOffSet } from "../../../util";

function TrendingOptionsModal({ close, options, visible }) {
  return (
    <Modal transparent={true} visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={getKeyboardVerticalOffSet()}
        style={{ ...styles.flexFill }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            close();
            Keyboard.dismiss();
          }}
          style={{
            ...styles.fill,
            ...styles.justifyEnd,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <TouchableWithoutFeedback>
            <SafeAreaView
              style={{
                ...styles.box,
              }}
            >
              <View style={{ ...styles.bgMain, ...styles.pa16 }}>
                <Text style={{ ...styles.title, ...styles.colorWhite }}>
                  Trending Options
                </Text>
              </View>
              <View style={{ ...styles.pa16 }}>
                {options.map((option, index) => (
                  <Option
                    isActive={option.isActive}
                    key={index}
                    onPress={() => {
                      option.onPress();
                      close();
                    }}
                    title={option.title}
                  />
                ))}
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Option({ isActive, onPress, title }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ ...styles.py8 }}>
      <Text
        style={{
          ...styles.fs20,
          ...styles.bold,
          ...(isActive ? styles.colorMain : styles.colorGrey1),
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default TrendingOptionsModal;
