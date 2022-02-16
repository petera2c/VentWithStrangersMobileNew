import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { faHandsHelping } from "@fortawesome/pro-solid-svg-icons/faHandsHelping";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Screen from "../../components/containers/Screen";
import StarterModal from "../../components/modals/Starter";

import { UserContext } from "../../context";

import { styles } from "../../styles";

import { userSignUpProgress } from "../../util";
import { joinQueue } from "./util";

function ChatWithStrangersScreen({ navigation }) {
  const { user } = useContext(UserContext);

  const [starterModal, setStarterModal] = useState();

  return (
    <Screen navigation={navigation} style={{ ...styles.pa16 }}>
      <View style={{ ...styles.box, ...styles.pa32, ...styles.mb16 }}>
        <Text style={{ ...styles.title, ...styles.mb8 }}>
          Chat With Strangers
        </Text>
        <Text style={{ ...styles.pTag, ...styles.tac }}>
          This button will only connect you with someone you have no current
          conversations with
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          const userInteractionIssues = userSignUpProgress(user);

          if (userInteractionIssues) {
            if (userInteractionIssues === "NSI") setStarterModal(true);
            return;
          }

          joinQueue(user.uid);
        }}
        style={{
          ...styles.box,
          ...styles.fullCenter,
          ...styles.pa32,
          ...styles.mb16,
        }}
      >
        <FontAwesomeIcon
          icon={faHandsHelping}
          size={32}
          style={{ ...styles.colorMain, ...styles.mb8 }}
        />
        <Text style={{ ...styles.title }}>Start Chatting</Text>
      </TouchableOpacity>
      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={starterModal}
      />
    </Screen>
  );
}

export default ChatWithStrangersScreen;
