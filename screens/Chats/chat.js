import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { off } from "firebase/database";

import KarmaBadge from "../../components/views/KarmaBadge";
import MakeAvatar from "../../components/views/MakeAvatar";
import Message from "./message";

import { styles } from "../../styles";

import { capitolizeFirstChar, getUserBasicInfo } from "../../util";
import {
  getConversationPartnerUserID,
  getMessages,
  isUserTypingListener,
  messageListener,
  readConversation,
  sendMessage,
  setConversationIsTyping,
} from "./util";

let typingTimer;

function Chat({
  activeChatUserBasicInfos,
  activeConversation,
  isChatInConversationsArray,
  navigation,
  setActiveChatUserBasicInfos,
  setActiveConversation,
  setGroupChatEditting,
  setIsCreateGroupModalVisible,
  userID,
}) {
  const dummyRef = useRef();
  const textInput = useRef(null);
  const isUserTypingTimeout = useRef();

  const scrollToBottom = () => {
    if (dummyRef.current) dummyRef.current.scrollToEnd({ animated: true });
  };

  const [allowToSetIsUserTypingToDB, setAllowToSetIsUserTypingToDB] = useState(
    true
  );
  const [arrayOfUsersTyping, setArrayOfUsersTyping] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messageString, setMessageString] = useState("");
  const [showPartnerIsTyping, setShowPartnerIsTyping] = useState(false);

  useEffect(() => {
    let messageListenerUnsubscribe;
    let isUserTypingUnsubscribe;

    setCanLoadMore(true);
    setShowPartnerIsTyping(false);

    readConversation(activeConversation, userID);

    if (
      activeConversation &&
      activeConversation.members &&
      activeConversation.members.length >= 2
    ) {
      isUserTypingUnsubscribe = isUserTypingListener(
        activeConversation.id,
        isUserTypingTimeout,
        getConversationPartnerUserID(activeConversation.members, userID),
        scrollToBottom,
        setArrayOfUsersTyping,
        setShowPartnerIsTyping,
        userID
      );

      let chatMemberIDArray = [];

      for (let index in activeConversation.members) {
        if (activeConversation.members[index] !== userID)
          chatMemberIDArray.push(activeConversation.members[index]);
      }
      const getAllMemberData = async (chatMemberIDArray) => {
        let tempArray = [];
        for (let index in chatMemberIDArray) {
          await getUserBasicInfo((newBasicUserInfo) => {
            tempArray.push(newBasicUserInfo);
          }, chatMemberIDArray[index]);
        }
        setActiveChatUserBasicInfos(tempArray);
      };
      getAllMemberData(chatMemberIDArray);
    }

    getMessages(
      activeConversation.id,
      [],
      scrollToBottom,
      setCanLoadMore,
      setMessages
    );

    messageListenerUnsubscribe = messageListener(
      activeConversation.id,
      scrollToBottom,
      setMessages
    );

    return () => {
      readConversation(activeConversation, userID);

      if (isUserTypingUnsubscribe) off(isUserTypingUnsubscribe);

      if (messageListenerUnsubscribe) messageListenerUnsubscribe();
    };
  }, [
    activeConversation,
    isChatInConversationsArray,
    setActiveChatUserBasicInfos,
    userID,
  ]);

  return (
    <View style={{ ...styles.flexFill }}>
      <View
        style={{
          ...styles.flexRow,
          ...styles.alignCenter,
          ...styles.bgWhite,
          ...styles.borderBottom,
          ...styles.pa16,
        }}
      >
        <View
          onClick={() => {
            if (!activeConversation.is_group) return;
            setGroupChatEditting(activeConversation);
            setIsCreateGroupModalVisible(true);
          }}
          style={{
            ...styles.flexRow,
            ...styles.flexFill,
            ...styles.alignCenter,
          }}
        >
          <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
            {activeChatUserBasicInfos &&
              activeChatUserBasicInfos.map((userBasicInfo, index) => (
                <View
                  key={userBasicInfo.id}
                  style2={{ transform: "translateX(" + index * -28 + "px)" }}
                >
                  <MakeAvatar
                    displayName={userBasicInfo.displayName}
                    userBasicInfo={userBasicInfo}
                  />
                </View>
              ))}
          </View>

          {!activeConversation.is_group &&
            activeChatUserBasicInfos &&
            activeChatUserBasicInfos[0] && (
              <TouchableOpacity
                onPress={() =>
                  navigation.jumpTo("Profile", {
                    userID: activeChatUserBasicInfos[0].id,
                  })
                }
                style={{ ...styles.flexRow, ...styles.alignCenter }}
              >
                <Text style={{ ...styles.titleSmall, ...styles.mr8 }}>
                  {capitolizeFirstChar(activeChatUserBasicInfos[0].displayName)}
                </Text>

                <KarmaBadge
                  noOnClick
                  userBasicInfo={activeChatUserBasicInfos[0]}
                />
              </TouchableOpacity>
            )}
          {activeConversation.is_group && (
            <Text
              className="button-1"
              style2={{
                transform:
                  activeChatUserBasicInfos &&
                  activeChatUserBasicInfos.length > 1
                    ? "translateX(-" +
                      (activeChatUserBasicInfos.length - 1) * 28 +
                      "px)"
                    : "",
              }}
            >
              {activeConversation.chat_name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            setActiveConversation(false);
          }}
        >
          <Text style={{ ...styles.fs20, ...styles.colorGrey11 }}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <View style={{ ...styles.flexFill }}>
        {!messages ||
          ((messages && messages.length) === 0 && (
            <Text style={{ ...styles.title }}>
              The conversation has been started but no messages have been sent!
            </Text>
          ))}

        <ScrollView
          ref={dummyRef}
          style={{ ...styles.flexFill, ...styles.bgWhite }}
        >
          <View style={{ ...styles.pa16 }}>
            {canLoadMore && (
              <TouchableOpacity
                onPress={() =>
                  getMessages(
                    activeConversation.id,
                    messages,
                    scrollToBottom,
                    setCanLoadMore,
                    setMessages,
                    false
                  )
                }
                style={{ ...styles.buttonPrimary, ...styles.mb16 }}
              >
                <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                  Load More Messages
                </Text>
              </TouchableOpacity>
            )}
            {messages.map((message, index) => {
              let shouldShowDisplayName = false;

              if (
                activeChatUserBasicInfos &&
                activeChatUserBasicInfos.length > 1
              )
                shouldShowDisplayName = true;

              if (
                messages[index - 1] &&
                messages[index - 1].userID === message.userID
              )
                shouldShowDisplayName = false;

              return (
                <Message
                  activeConversationID={activeConversation.id}
                  activeChatUserBasicInfos={activeChatUserBasicInfos}
                  key={index}
                  message={message}
                  setMessages={setMessages}
                  shouldShowDisplayName={shouldShowDisplayName}
                  userID={userID}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>

      {false && (
        <View
          className="ease-in-out x-fill"
          style={{
            maxHeight: showPartnerIsTyping ? 56 : 0,
          }}
        >
          <View className="bg-none ov-hidden full-center">
            <View className="align-end pl16">
              {activeChatUserBasicInfos && activeChatUserBasicInfos[0] && (
                <MakeAvatar
                  displayName={activeChatUserBasicInfos[0].displayName}
                  userBasicInfo={activeChatUserBasicInfos[0]}
                />
              )}
              <Text>...</Text>
            </View>
          </View>
        </View>
      )}
      {false && (
        <View
          className="ease-in-out x-fill"
          style={{
            maxHeight: arrayOfUsersTyping.length > 0 ? "56px" : "0",
          }}
        >
          <View className="bg-none ov-hidden full-center">
            <View className="align-end pl16">
              <Text className="">
                {arrayOfUsersTyping.length}
                {arrayOfUsersTyping.length === 1
                  ? " person is "
                  : " people are "}
                typing...
              </Text>
            </View>
          </View>
        </View>
      )}

      <View
        style={{
          ...styles.flexRow,
          ...styles.alignCenter,
          ...styles.bgWhite,
          ...styles.borderTop,
          ...styles.pa8,
        }}
      >
        <TextInput
          onChangeText={(text) => {
            if (text === "\n") return;
            setMessageString(text);

            if (!allowToSetIsUserTypingToDB) {
              if (!typingTimer) {
                typingTimer = setTimeout(() => {
                  setAllowToSetIsUserTypingToDB(true);

                  if (typingTimer) typingTimer = undefined;
                }, 500);
              }
            } else {
              setConversationIsTyping(activeConversation.id, undefined, userID);
              setAllowToSetIsUserTypingToDB(false);
            }
          }}
          placeholder="Type a helpful message here..."
          ref={textInput}
          style={{ ...styles.input, ...styles.flexFill, ...styles.mr8 }}
          value={messageString}
          rows={1}
        />

        <TouchableOpacity
          className={"button-2 "}
          onPress={() => {
            if (!messageString) return;
            setConversationIsTyping(activeConversation.id, true, userID);
            setAllowToSetIsUserTypingToDB(true);
            sendMessage(activeConversation.id, messageString, userID);
            setMessageString("");
          }}
          style={{ ...styles.buttonPrimary }}
        >
          <Text style={{ ...styles.fs20, ...styles.colorWhite }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Chat;
