import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  RefreshControl,
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
  const isUserTypingTimeout = useRef();
  const textInput = useRef(null);

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
  const [refreshing, setRefreshing] = useState(false);
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

    setTimeout(() => setRefreshing(false), 400);

    return () => {
      readConversation(activeConversation, userID);

      if (isUserTypingUnsubscribe) off(isUserTypingUnsubscribe);

      if (messageListenerUnsubscribe) messageListenerUnsubscribe();
    };
  }, [
    activeConversation,
    isChatInConversationsArray,
    refreshing,
    setActiveChatUserBasicInfos,
    setRefreshing,
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
        <TouchableOpacity
          onPress={() => {
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
          <View
            style={{
              ...styles.flexRow,
              ...styles.alignCenter,
              width:
                activeChatUserBasicInfos.length > 1
                  ? activeChatUserBasicInfos.length * 36
                  : "auto",
              ...styles.mr8,
            }}
          >
            {activeChatUserBasicInfos &&
              activeChatUserBasicInfos.map((userBasicInfo, index) => (
                <View
                  key={userBasicInfo.id}
                  style={{
                    transform: [{ translateX: -(index * 36) }],
                  }}
                >
                  <MakeAvatar
                    displayName={userBasicInfo.displayName}
                    userBasicInfo={userBasicInfo}
                  />
                </View>
              ))}
          </View>

          {activeConversation.is_group && (
            <Text
              style={{
                ...styles.flexFill,
                ...styles.pTag,
              }}
            >
              {activeConversation.chat_name}
            </Text>
          )}

          {!activeConversation.is_group &&
            activeChatUserBasicInfos &&
            activeChatUserBasicInfos[0] && (
              <TouchableOpacity
                onPress={() =>
                  navigation.jumpTo("Profile", {
                    userID: activeChatUserBasicInfos[0].id,
                  })
                }
                style={{
                  ...styles.flexRow,
                  ...styles.flexFill,
                  ...styles.alignCenter,
                }}
              >
                <Text
                  style={{
                    ...styles.titleSmall,
                    ...styles.mr8,
                  }}
                >
                  {capitolizeFirstChar(activeChatUserBasicInfos[0].displayName)}
                </Text>

                <KarmaBadge
                  noOnClick
                  userBasicInfo={activeChatUserBasicInfos[0]}
                />
              </TouchableOpacity>
            )}
        </TouchableOpacity>
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
            <Text
              style={{
                ...styles.titleSmall,
                ...styles.tac,
                ...styles.bgWhite,
                ...styles.pt16,
              }}
            >
              The conversation has been started but no messages have been sent!
            </Text>
          ))}

        <ScrollView
          ref={dummyRef}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
            />
          }
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

      <UserTypingComponent
        activeChatUserBasicInfos={activeChatUserBasicInfos}
        isGroup={activeConversation.is_group}
        showPartnerIsTyping={showPartnerIsTyping}
      />

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
          multiline
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

function UserTypingComponent({
  activeChatUserBasicInfos,
  isGroup,
  showPartnerIsTyping,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showPartnerIsTyping)
      Animated.timing(fadeAnim, {
        toValue: 200,
        useNativeDriver: false,
      }).start();
    else
      Animated.timing(fadeAnim, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
  }, [fadeAnim, showPartnerIsTyping]);

  if (isGroup)
    return (
      <Animated.View
        style={{
          ...styles.flexRow,
          ...styles.alignCenter,
          ...styles.bgWhite,
          ...styles.ovHidden,
          maxHeight: showPartnerIsTyping ? 200 : 0,
        }}
      >
        <Text className="">
          {arrayOfUsersTyping.length}
          {arrayOfUsersTyping.length === 1 ? " person is " : " people are "}
          typing...
        </Text>
      </Animated.View>
    );
  else
    return (
      <Animated.View
        style={{
          ...styles.flexRow,
          ...styles.alignCenter,
          ...styles.bgWhite,
          ...styles.ovHidden,
          maxHeight: fadeAnim,
        }}
      >
        {activeChatUserBasicInfos && activeChatUserBasicInfos[0] && (
          <MakeAvatar
            displayName={activeChatUserBasicInfos[0].displayName}
            userBasicInfo={activeChatUserBasicInfos[0]}
          />
        )}
        <Text style={{ ...styles.pTag }}>...</Text>
      </Animated.View>
    );
}

export default Chat;
