import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { faVolume } from "@fortawesome/pro-solid-svg-icons/faVolume";
import { faVolumeSlash } from "@fortawesome/pro-solid-svg-icons/faVolumeSlash";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

//import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import KarmaBadge from "../../components/views/KarmaBadge";
import MakeAvatar from "../../components/views/MakeAvatar";

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
  readConversation,
} from "./util";

dayjs.extend(relativeTime);

function ConversationOption({
  activeChatUserBasicInfos,
  conversation,
  isActive,
  setActiveConversation,
  setActiveChatUserBasicInfos,
  setConversations,
  setGroupChatEditting,
  setIsCreateGroupModalVisible,
  userID,
}) {
  const unsubFromConversationUpdates = useRef(false);

  const [blockModal, setBlockModal] = useState(false);
  const [deleteConversationConfirm, setDeleteConversationConfirm] = useState(
    false
  );
  const [isMuted, setIsMuted] = useState();
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

    if (isActive && (!hasSeen || conversation.go_to_inbox))
      readConversation(conversation, userID);

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
        <View style={{ ...styles.flexRow }}>
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

          <TouchableOpacity onPress={() => {}} style={{ ...styles.justifyEnd }}>
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

      {deleteConversationConfirm && (
        <ConfirmAlertModal
          close={() => setDeleteConversationConfirm(false)}
          message="Deleting this conversation will be permanent. Are you sure you would like to delete this conversation?"
          submit={() => {
            if (unsubFromConversationUpdates.current)
              unsubFromConversationUpdates.current();

            deleteConversation(
              conversation.id,
              navigate,
              setActiveConversation,
              setConversations,
              userID
            );
          }}
          title="Delete Conversation"
        />
      )}
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => {
            blockUser(
              userID,
              conversation.members.find((memberID) => {
                if (memberID !== userID) return memberID;
                else return undefined;
              })
            );
          }}
          title="Block User"
        />
      )}
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
    <View
      style={{ ...styles.flexRow, ...styles.flexFill, ...styles.alignCenter }}
    >
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

/*
<View className="column x-fill bg-white border-all px16 py8 br8">
  <View
    className="button-8 clickable align-center"
    onClick={(e) => {
      setIsMuted(!isMuted);
      muteChat(conversation.id, userID, !isMuted);
      message.success(
        "Chat is " + (isMuted ? "unmuted" : "muted") + " :)"
      );
    }}
  >
    <Text className="flex-fill ic">
      {isMuted ? "Unmute " : "Mute "}Chat
    </Text>
    <FontAwesomeIcon
      className="ml8"
      icon={isMuted ? faVolume : faVolumeSlash}
    />
  </View>
  <View
    className="button-8 clickable align-center"
    onClick={(e) => {
      setBlockModal(!blockModal);
    }}
  >
    <Text className="ic fw-400 flex-fill">Block User</Text>
    <FontAwesomeIcon className="ml8" icon={faUserLock} />
  </View>
  <View
    className="button-9 clickable align-center"
    onClick={(e) => {
      setDeleteConversationConfirm(true);
    }}
  >
    <Text className="flex-fill ic">Leave Chat</Text>
    <FontAwesomeIcon className="ml8" icon={faTrash} />
  </View>
</View>*/

export default ConversationOption;
