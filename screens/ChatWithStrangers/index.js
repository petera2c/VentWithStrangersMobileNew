import React, { useContext, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useState from "react-usestateref";

import { faHandsHelping } from "@fortawesome/pro-solid-svg-icons/faHandsHelping";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Screen from "../../components/containers/Screen";
import StarterModal from "../../components/modals/Starter";

import { UserContext } from "../../context";

import { styles } from "../../styles";

import { userSignUpProgress } from "../../util";
import { joinQueue, isUserInQueueListener, leaveQueue } from "./util";

function ChatWithStrangersScreen({ navigation }) {
  const { user } = useContext(UserContext);

  const [isUserInQueue, setIsUserInQueue, isUserInQueueRef] = useState();
  const [starterModal, setStarterModal] = useState(false);

  useEffect(() => {
    let isUserInQueueUnsubscribe;

    if (user)
      isUserInQueueUnsubscribe = isUserInQueueListener(
        setIsUserInQueue,
        user.uid
      );

    return () => {
      if (user && isUserInQueueRef.current) leaveQueue(user.uid);
      if (isUserInQueueUnsubscribe) isUserInQueueUnsubscribe();
    };
  }, [isUserInQueueRef, setIsUserInQueue]);

  return (
    <Screen navigation={navigation} style={{ ...styles.pa16 }}>
      <View style={{ ...styles.box, ...styles.pa32, ...styles.mb16 }}>
        <Text style={{ ...styles.title, ...styles.mb8 }}>
          Chat With Strangers
        </Text>
        <Text style={{ ...styles.pTag, ...styles.tac }}>
          Connect with someone you have no current conversations with
        </Text>
      </View>
      {isUserInQueueRef.current ? (
        <TouchableOpacity
          onPress={() => {
            leaveQueue(user.uid);
          }}
          style={{
            ...styles.box,
            ...styles.fullCenter,
            ...styles.pa32,
            ...styles.mb16,
          }}
        >
          <Text style={{ ...styles.title, ...styles.mb8 }}>
            You Are In Queue
          </Text>
          <Text style={{ ...styles.pTag }}>Click To Leave Queue</Text>
        </TouchableOpacity>
      ) : (
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
      )}
      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={Boolean(starterModal)}
      />
    </Screen>
  );
}

export default ChatWithStrangersScreen;
