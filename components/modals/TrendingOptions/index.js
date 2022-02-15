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

function ForgotPasswordModal({ close, pathname, setPathname }) {
  return (
    <Modal transparent={true}>
      <KeyboardAvoidingView behavior="padding" style={{ ...styles.flexFill }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            close();
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
                  Trending Options
                </Text>
              </View>
              <View style={{ ...styles.pa16 }}>
                <Option
                  isActive={pathname === "/trending"}
                  onPress={() => {
                    setPathname("/trending");
                    close();
                  }}
                  title="Trending Today"
                />
                <Option
                  isActive={pathname === "/trending/this-week"}
                  onPress={() => {
                    setPathname("/trending/this-week");
                    close();
                  }}
                  title="Trending This Week"
                />
                <Option
                  isActive={pathname === "/trending/this-month"}
                  onPress={() => {
                    setPathname("/trending/this-month");
                    close();
                  }}
                  title="Trending This Month"
                />
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

export default ForgotPasswordModal;
