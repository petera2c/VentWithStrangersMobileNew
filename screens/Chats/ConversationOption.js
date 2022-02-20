import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showMessage } from "react-native-flash-message";

import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { faVolume } from "@fortawesome/pro-solid-svg-icons/faVolume";
import { faVolumeSlash } from "@fortawesome/pro-solid-svg-icons/faVolumeSlash";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import KarmaBadge from "../../components/views/KarmaBadge";
import MakeAvatar from "../../components/views/MakeAvatar";
import OptionsModal from "../../components/modals/Options";

import { styles } from "../../styles";

import {
  blockUser,
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
} from "../../util";
import {
  conversationListener,
  deleteConversation,
  getIsChatMuted,
  muteChat,
} from "./util";

dayjs.extend(relativeTime);

function ConversationOption({
  activeChatUserBasicInfos,
  conversation,
  isActive,
  setActiveConversation,
  setActiveChatUserBasicInfos,
  setConversations,
  userID,
}) {
  const unsubFromConversationUpdates = useRef(false);

  const [blockModal, setBlockModal] = useState(false);
  const [isMuted, setIsMuted] = useState();
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [userBasicInfoArray, setUserBasicInfoArray] = useState([]);
  const hasSeen = conversation[userID];

  useEffect(() => {
    unsubFromConversationUpdates.current = conversationListener(
      conversation,
      setConversations
    );

    let chatMemberIDArray = [];

    for (let index in conversation.members) {
      if (conversation.members[index] !== userID)
        chatMemberIDArray.push(conversation.members[index]);
    }
    if (chatMemberIDArray.length === 0) return;

    const getAllMemberData = async (chatMemberIDArray) => {
      let tempArray = [];
      for (let index in chatMemberIDArray) {
        await getUserBasicInfo((newBasicUserInfo) => {
          tempArray.push(newBasicUserInfo);
        }, chatMemberIDArray[index]);
      }
      setUserBasicInfoArray(tempArray);

      if (isActive) setActiveChatUserBasicInfos(tempArray);
    };
    getAllMemberData(chatMemberIDArray);

    getIsChatMuted(conversation.id, setIsMuted, userID);

    return () => {
      if (unsubFromConversationUpdates.current)
        unsubFromConversationUpdates.current();
    };
  }, [
    conversation,
    hasSeen,
    isActive,
    setActiveChatUserBasicInfos,
    setConversations,
    userID,
  ]);

  if (!conversation) return <View>loading</View>;

  return (
    <TouchableOpacity
      onPress={() => {
        setActiveChatUserBasicInfos(userBasicInfoArray);
        setActiveConversation(conversation);
      }}
      style={{
        ...styles.flexRow,
        ...styles.justifyBetween,
        ...styles.bgWhite,
        ...styles.br4,
        ...styles.mb16,
        ...styles.pa8,
      }}
    >
      <View style={{ ...styles.flexFill }}>
        <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
          <View
            style={{
              ...styles.flexRow,
              ...styles.flexFill,
              ...styles.alignCenter,
              ...styles.pa8,
            }}
          >
            <View
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                width:
                  userBasicInfoArray && userBasicInfoArray.length > 1
                    ? 4 * 74 - 4 * 36
                    : "auto",
              }}
            >
              {userBasicInfoArray.map((userBasicInfo, index) => (
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

            {(conversation.chat_name || userBasicInfoArray) && (
              <DisplayOnlineAndName
                chatName={conversation.chat_name}
                hasSeen={hasSeen}
                userBasicInfo={
                  userBasicInfoArray.length > 0 ? userBasicInfoArray[0] : {}
                }
              />
            )}
            {!conversation.chat_name && userBasicInfoArray.length === 1 && (
              <KarmaBadge
                noOnClick
                userBasicInfo={
                  userBasicInfoArray.length > 0 ? userBasicInfoArray[0] : {}
                }
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowOptionsModal(true)}
            style={{ ...styles.justifyEnd }}
          >
            <FontAwesomeIcon
              icon={faEllipsisV}
              size={24}
              style={{ ...styles.colorGrey9 }}
            />
          </TouchableOpacity>
        </View>
        {conversation.last_message && (
          <Text
            style={{
              ...styles.pTag,
              ...styles.mb8,
              ...styles.px8,
            }}
          >
            {conversation.last_message.length > 40
              ? conversation.last_message.substring(0, 40) + "..."
              : conversation.last_message}{" "}
          </Text>
        )}
        <View style={{ ...styles.alignEnd }}>
          {conversation.last_updated && (
            <Text
              style={{
                ...styles.pTag,
                ...styles.tar,
              }}
            >
              {dayjs(conversation.last_updated).fromNow()}
            </Text>
          )}
        </View>
      </View>

      <OptionsModal
        close={() => setShowOptionsModal(false)}
        options={[
          {
            icon: isMuted ? faVolume : faVolumeSlash,
            onPress: () => {
              setIsMuted(!isMuted);
              muteChat(conversation.id, userID, !isMuted);
              showMessage({
                message: "Chat is " + (isMuted ? "unmuted" : "muted") + " :)",
                type: "success",
              });
            },
            text: (isMuted ? "Unmute " : "Mute ") + "Chat",
          },
          {
            icon: faUserLock,
            onPress: () => {
              blockUser(
                userID,
                conversation.members.find((memberID) => {
                  if (memberID !== userID) return memberID;
                  else return undefined;
                })
              );
            },
            text: "Block User",
          },
          {
            icon: faTrash,
            onPress: () => {
              if (unsubFromConversationUpdates.current)
                unsubFromConversationUpdates.current();

              deleteConversation(
                conversation.id,
                navigate,
                setActiveConversation,
                setConversations,
                userID
              );
            },
            text: "Leave Chat",
          },
        ]}
        title="Conversation Options"
        visible={showOptionsModal}
      />
    </TouchableOpacity>
  );
}

function DisplayOnlineAndName({ chatName, hasSeen, userBasicInfo }) {
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    let isUserOnlineSubscribe;

    if (!chatName)
      isUserOnlineSubscribe = getIsUserOnline((isUserOnlineObj) => {
        if (isUserOnlineObj && isUserOnlineObj.state) {
          if (isUserOnlineObj.state === "online") setIsUserOnline(true);
          else setIsUserOnline(false);
        }
      }, userBasicInfo.id);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [chatName, userBasicInfo]);

  return (
    <View style={{ ...styles.flexRow, flexShrink: 1, ...styles.alignCenter }}>
      <Text
        style={{
          ...styles.titleSmall,
          ...(hasSeen ? styles.colorGrey1 : {}),
          ...styles.mr8,
        }}
      >
        {chatName
          ? chatName
          : userBasicInfo
          ? capitolizeFirstChar(userBasicInfo.displayName)
          : "Anonymous"}
      </Text>
      {!chatName && isUserOnline && <View style={{ ...styles.onlineDot }} />}
    </View>
  );
}

export default ConversationOption;
