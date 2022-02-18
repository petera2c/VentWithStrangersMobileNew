import React, { useContext, useState } from "react";

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

import { UserContext } from "../../../context";
import { signUp } from "./util";

function SignUpModal({ navigate, setActiveModal, visible }) {
  const { setUserBasicInfo } = useContext(UserContext);

  const [canSeePassword, setCanSeePassword] = useState(false);
  const [confirmPasswordString, setConfirmPasswordString] = useState("");
  const [displayNameString, setDisplayNameString] = useState("");
  const [emailString, setEmailString] = useState("");
  const [passwordString, setPasswordString] = useState("");

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
                  Create an Account
                </Text>
              </View>

              <View style={{ ...styles.pa16 }}>
                <TextInput
                  autoCapitalize="none"
                  name="displayName"
                  onChangeText={(text) => setDisplayNameString(text)}
                  placeholder="Display Name"
                  placeholderTextColor={colors.grey1}
                  style={{ ...styles.input }}
                  value={displayNameString}
                />
                <TextInput
                  autoCapitalize="none"
                  name="email"
                  onChangeText={(text) => setEmailString(text)}
                  placeholder="Email Address"
                  placeholderTextColor={colors.grey1}
                  style={{ ...styles.input }}
                  value={emailString}
                />
                <Text style={{ ...styles.pTag, ...styles.tac, ...styles.mb16 }}>
                  (Your email address will never be shown to anyone.)
                </Text>
                <View>
                  <View>
                    <TextInput
                      autoCapitalize="none"
                      name="password"
                      onChangeText={(text) => setPasswordString(text)}
                      placeholder="Password"
                      placeholderTextColor={colors.grey1}
                      required
                      secureTextEntry={canSeePassword ? false : true}
                      style={{ ...styles.input }}
                      type={canSeePassword ? "" : "password"}
                      value={passwordString}
                    />
                  </View>
                  <View>
                    <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
                      <TextInput
                        autoCapitalize="none"
                        name="passwordConfirm"
                        onChangeText={(text) => confirmPasswordString(text)}
                        placeholder="Confirm Password"
                        placeholderTextColor={colors.grey1}
                        secureTextEntry={canSeePassword ? false : true}
                        style={{
                          ...styles.input,
                          ...styles.flexFill,
                          ...styles.mr8,
                        }}
                        value={confirmPasswordString}
                      />
                      <TouchableOpacity
                        onPress={() => setCanSeePassword(!canSeePassword)}
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{
                            ...(canSeePassword
                              ? styles.colorMain
                              : styles.colorGrey1),
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
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
                    Create Account
                  </Text>
                </TouchableOpacity>

                <Text style={{ ...styles.pTag, ...styles.tac }}>
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
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default SignUpModal;
