import React, { useEffect, useState } from "react";

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

import { faEye } from "@fortawesome/pro-solid-svg-icons/faEye";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { colors, styles } from "../../../styles";

import { login } from "./util";

function LoginModal({ setActiveModal }) {
  const [canSeePassword, setCanSeePassword] = useState(false);

  return (
    <Modal transparent={true}>
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
                  Sign In
                </Text>
              </View>
              <View style={{ ...styles.pa16 }}>
                <View>
                  <TextInput
                    name="email"
                    placeholder="Email Address"
                    placeholderTextColor={colors.grey1}
                    style={{ ...styles.input, ...styles.mb8 }}
                  />
                  <View
                    style={{
                      ...styles.flexRow,
                      ...styles.alignCenter,
                    }}
                  >
                    <TextInput
                      name="password"
                      placeholder="Password"
                      placeholderTextColor={colors.grey1}
                      secureTextEntry={canSeePassword ? false : true}
                      style={{
                        ...styles.input,
                        ...styles.flexFill,
                        ...styles.mr8,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setCanSeePassword(!canSeePassword)}
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        size={24}
                        style={{
                          ...(canSeePassword
                            ? styles.colorMain
                            : styles.colorGrey1),
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      ...styles.pTag,
                      ...styles.tac,
                      ...styles.mb16,
                    }}
                  >
                    Have you forgotten your password?{" "}
                    <TouchableOpacity
                      onPress={() => {
                        setActiveModal("forgotPassword");
                      }}
                    >
                      <Text style={{ ...styles.fs20, ...styles.colorMain }}>
                        Password reset
                      </Text>
                    </TouchableOpacity>
                  </Text>

                  <TouchableOpacity
                    onPress={() => {}}
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
                      Sign In
                    </Text>
                  </TouchableOpacity>

                  <Text style={{ ...styles.pTag, ...styles.tac }}>
                    Don't have an account?&nbsp;{" "}
                    <TouchableOpacity
                      onPress={() => {
                        setActiveModal("signUp");
                      }}
                    >
                      <Text style={{ ...styles.fs20, ...styles.colorMain }}>
                        Create Account
                      </Text>
                    </TouchableOpacity>
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default LoginModal;