import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { colors, styles } from "../../../styles";

import { getKeyboardVerticalOffSet } from "../../../util";

import { sendPasswordReset } from "./util";

function ForgotPasswordModal({ setActiveModal, visible }) {
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
            setActiveModal(false);
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
                  Forgot Password
                </Text>
              </View>
              <View style={{ ...styles.pa16 }}>
                <Text style={{ ...styles.pTag, ...styles.tac, ...styles.mb16 }}>
                  Already have an account?&nbsp;
                  <TouchableOpacity
                    onPress={() => {
                      setActiveModal("login");
                    }}
                  >
                    <Text style={{ ...styles.fs20, ...styles.colorMain }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </Text>
                <View>
                  <View>
                    <TextInput
                      name="email"
                      placeholder="Email Address"
                      placeholderTextColor={colors.grey1}
                      style={{ ...styles.input }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      sendPasswordReset({});
                    }}
                    style={{
                      ...styles.buttonPrimary,
                      ...styles.mb16,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.fs24,
                        ...styles.colorWhite,
                      }}
                    >
                      Send Link
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default ForgotPasswordModal;
