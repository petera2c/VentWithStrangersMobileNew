import React, { useContext, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";

import { faEye } from "@fortawesome/pro-solid-svg-icons/faEye";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { colors, styles } from "../../../styles";

import { UserContext } from "../../../context";

import { getKeyboardVerticalOffSet } from "../../../util";

import { signUp } from "./util";

function SignUpModal({ setActiveModal, visible }) {
  const navigation = useNavigation();
  const { setUserBasicInfo } = useContext(UserContext);

  const [canSeePassword, setCanSeePassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
                  Create an Account
                </Text>
              </View>

              <View style={{ ...styles.pa16 }}>
                <TextInput
                  autoCapitalize="none"
                  autocorrect={false}
                  name="displayName"
                  onChangeText={(text) => setDisplayName(text)}
                  placeholder="Display Name"
                  placeholderTextColor={colors.grey1}
                  style={{ ...styles.input }}
                  value={displayName}
                />
                <TextInput
                  autoCapitalize="none"
                  autocorrect={false}
                  name="email"
                  onChangeText={(text) => setEmail(text)}
                  placeholder="Email Address"
                  placeholderTextColor={colors.grey1}
                  style={{ ...styles.input }}
                  value={email}
                />
                <Text style={{ ...styles.pTag, ...styles.tac, ...styles.mb16 }}>
                  (Your email address will never be shown to anyone.)
                </Text>
                <View>
                  <View>
                    <TextInput
                      autoCapitalize="none"
                      autocorrect={false}
                      name="password"
                      onChangeText={(text) => setPassword(text)}
                      placeholder="Password"
                      placeholderTextColor={colors.grey1}
                      required
                      secureTextEntry={canSeePassword ? false : true}
                      style={{ ...styles.input }}
                      type={canSeePassword ? "" : "password"}
                      value={password}
                    />
                  </View>
                  <View>
                    <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
                      <TextInput
                        autoCapitalize="none"
                        autocorrect={false}
                        name="passwordConfirm"
                        onChangeText={(text) => setPasswordConfirm(text)}
                        placeholder="Confirm Password"
                        placeholderTextColor={colors.grey1}
                        secureTextEntry={canSeePassword ? false : true}
                        style={{
                          ...styles.input,
                          ...styles.flexFill,
                          ...styles.mr8,
                        }}
                        value={passwordConfirm}
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
                  onPress={() =>
                    signUp(
                      { email, displayName, password, passwordConfirm },
                      navigation,
                      setActiveModal,
                      setUserBasicInfo
                    )
                  }
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
