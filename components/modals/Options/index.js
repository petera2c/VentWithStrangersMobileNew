import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { colors, styles } from "../../../styles";

function OptionsModal({ close, options, title, visible }) {
  return (
    <Modal transparent={true} visible={visible}>
      <KeyboardAvoidingView behavior="padding" style={{ ...styles.flexFill }}>
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
                ...styles.bgWhite,
                ...styles.br8,
              }}
            >
              <View style={{ ...styles.bgMain, ...styles.pa16 }}>
                <Text style={{ ...styles.title, ...styles.colorWhite }}>
                  {title}
                </Text>
              </View>
              <View style={{ ...styles.pa16 }}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    onPress={option.onPress}
                    style={{ ...styles.buttonSecondary, ...styles.mb8 }}
                  >
                    <Text style={{ ...styles.fs20, ...styles.colorMain }}>
                      {option.text}
                    </Text>
                    {option.icon && (
                      <FontAwesomeIcon
                        icon={option.icon}
                        style={{ ...styles.colorMain, ...styles.ml8 }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default OptionsModal;