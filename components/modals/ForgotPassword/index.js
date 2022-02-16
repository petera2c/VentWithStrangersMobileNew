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

import { colors, styles } from "../../../styles";

import { sendPasswordReset } from "./util";

function ForgotPasswordModal({ setActiveModal, visible }) {
  return (
    <Modal transparent={true} visible={visible}>
      <KeyboardAvoidingView behavior="padding" style={{ ...styles.flexFill }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setActiveModal(false);
            Keyboard.dismiss();
          }}
          style={{
            ...styles.fill,
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <TouchableWithoutFeedback>
            <SafeAreaView
              style={{
                ...styles.bgWhite,
                overflow: "hidden",
                ...styles.br8,
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
