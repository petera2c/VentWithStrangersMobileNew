import React, { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { colors, styles } from "../../../styles";

function DeleteAccountModal({ close, submit, visible }) {
  const textInput = useRef(null);

  const [inputString, setInputString] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
                overflow: "hidden",
                ...styles.br8,
              }}
            >
              <View style={{ ...styles.pa16 }}>
                <View>
                  <Text style={{ ...styles.title, ...styles.mb16 }}>
                    Permanently Delete Account
                  </Text>
                </View>
                <View className="flex-fill column x-fill ov-auto gap16 py16 px32">
                  <Text
                    style={{ ...styles.pTag, ...styles.tac, ...styles.mb16 }}
                  >
                    {isDeleting
                      ? "Loading..."
                      : "This will permanently delete every single item we have related to your account. None of this information will be recoverable. Are you sure you want to proceed?"}
                  </Text>
                  {!isDeleting && (
                    <TextInput
                      autoCapitalize="none"
                      onChangeText={(text) => {
                        setInputString(text);
                      }}
                      placeholder={`Type "delete permanently" to continue`}
                      placeholderTextColor={colors.grey1}
                      ref={textInput}
                      style={{ ...styles.input, ...styles.mb16 }}
                      value={inputString}
                    />
                  )}
                </View>
                {!isDeleting && (
                  <View
                    className="full-center border-top pa16"
                    style={{
                      ...styles.flexRow,
                      ...styles.borderTop,
                      ...styles.pt16,
                    }}
                  >
                    <TouchableOpacity
                      className="grey-1 border-all py8 px32 mx4 br4"
                      onPress={() => close()}
                      style={{
                        ...styles.flexFill,
                        ...styles.border,
                        ...styles.mr8,
                        ...styles.pa8,
                      }}
                    >
                      <Text
                        style={{
                          ...styles.fs20,
                          ...styles.colorGrey1,
                          ...styles.tac,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={
                        "py8 px32 mx4 br4 " +
                        (inputString === "delete permanently"
                          ? "TouchableOpacity-2"
                          : "grey-1")
                      }
                      onPress={() => {
                        if (inputString === "delete permanently") {
                          setIsDeleting(true);
                          submit();
                        } else {
                          textInput.current.focus();
                        }
                      }}
                      style={{
                        ...styles.flexFill,
                        ...styles.border,
                        ...(inputString === "delete permanently"
                          ? styles.buttonPrimary
                          : { ...styles.border, ...styles.pa8 }),
                        ...styles.ml8,
                      }}
                    >
                      <Text
                        style={{
                          ...styles.fs20,
                          ...(inputString === "delete permanently"
                            ? styles.colorWhite
                            : styles.colorGrey1),
                          ...styles.tac,
                        }}
                      >
                        Yes, Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default DeleteAccountModal;
