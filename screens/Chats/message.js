import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import { showMessage } from "react-native-flash-message";

import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";

import OptionsModal from "../../components/modals/Options";

import { styles } from "../../styles";

import { urlify } from "../../util";
import { deleteMessage } from "./util";

function Message({
  activeChatUserBasicInfos,
  activeConversationID,
  message,
  setMessages,
  shouldShowDisplayName,
  userID,
}) {
  const [displayName, setDisplayName] = useState("");
  const [messageOptions, setMessageOptions] = useState(false);

  useEffect(() => {
    if (
      activeChatUserBasicInfos &&
      activeChatUserBasicInfos.find(
        (userBasicInfo) => userBasicInfo.id === message.userID
      )
    )
      setDisplayName(
        activeChatUserBasicInfos.find(
          (userBasicInfo) => userBasicInfo.id === message.userID
        ).displayName
      );
  }, [activeChatUserBasicInfos, message]);

  if (message.is_notice)
    return (
      <View
        style={{
          ...styles.xFill,
          ...styles.mb8,
        }}
      >
        {urlify({ ...styles.fs20, ...styles.colorGrey11 }, message.body).map(
          (obj, index) => {
            return (
              <Text
                key={index}
                style={{ ...styles.fs20, ...styles.colorGrey11, ...styles.tac }}
              >
                {obj}
              </Text>
            );
          }
        )}
      </View>
    );
  else
    return (
      <View
        style={{
          ...styles.xFill,
          ...(message.userID === userID ? styles.alignEnd : styles.alignStart),
          ...styles.mb8,
        }}
      >
        <View
          style={{
            ...styles.flexRow,
            ...(message.userID === userID ? styles.bgMain : styles.bgBlue1),
            ...styles.br4,
          }}
        >
          <View
            style={{
              maxWidth: "70%",
              ...styles.px16,
              ...styles.py8,
            }}
          >
            {Boolean(
              message.userID !== userID && shouldShowDisplayName && displayName
            ) && (
              <Text style={{ ...styles.fs18, ...styles.mb8 }}>
                {displayName}
              </Text>
            )}
            <View>
              {urlify(
                {
                  ...styles.fs20,
                  ...(message.userID === userID ? styles.colorWhite : {}),
                },
                message.body
              ).map((obj, index) => {
                return (
                  <Text
                    key={index}
                    style={{
                      ...styles.fs20,
                      ...(message.userID === userID ? styles.colorWhite : {}),
                    }}
                  >
                    {obj}
                  </Text>
                );
              })}
            </View>
          </View>
          <View style={{ ...styles.flexRow }}>
            <TouchableOpacity
              onPress={() => {
                setMessageOptions(!messageOptions);
              }}
              onMouseLeave={() => setMessageOptions(false)}
              style={{ ...styles.flexRow, ...styles.alignEnd, ...styles.pr2 }}
            >
              <Text
                style={{
                  ...(message.userID === userID ? styles.colorWhite : {}),
                }}
              >
                {dayjs(message.server_timestamp).format("h:mm A")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <OptionsModal
          close={() => setMessageOptions(false)}
          options={
            message.userID === userID
              ? [
                  {
                    icon: faTrash,
                    onPress: () => {
                      setMessageOptions(false);
                      deleteMessage(
                        activeConversationID,
                        message.id,
                        setMessages
                      );
                    },
                    text: "Delete Message",
                  },
                ]
              : [
                  {
                    icon: faExclamationTriangle,
                    onPress: () => {
                      setMessageOptions(false);
                      showMessage({
                        message: "Message Reported :)",
                        type: "success",
                      });
                    },
                    text: "Report Message",
                  },
                ]
          }
          title="Conversation Options"
          visible={messageOptions}
        />
      </View>
    );
}

/*{deleteMessageConfirm && (
  <ConfirmAlertModal
    close={() => setDeleteMessageConfirm(false)}
    message="Are you sure you would like to delete this message?"
    submit={() =>

    }
    title="Delete Message"
  />
)}*/

export default Message;
