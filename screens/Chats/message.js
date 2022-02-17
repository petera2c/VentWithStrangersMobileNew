import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";

import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

//import ConfirmAlertModal from "../../components/modals/ConfirmAlert";

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
  const [deleteMessageConfirm, setDeleteMessageConfirm] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [messageOptions, setMessageOptions] = useState(false);
  const [reportModal, setReportModal] = useState(false);

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
      <View className="x-fill">
        {urlify(message.body).map((obj, index) => {
          return (
            <Text className="grey-11 py8" key={index}>
              {obj}
            </Text>
          );
        })}
      </View>
    );
  else
    return (
      <View className="x-fill">
        <View
          className={
            "br4 " + (message.userID === userID ? "bg-blue" : "bg-blue-1")
          }
          style={{ maxWidth: "80%" }}
        >
          <View className="column flex-fill px16 py8">
            {message.userID !== userID &&
              shouldShowDisplayName &&
              displayName && <Text className="orange">{displayName}</Text>}
            <View className="flex-fill description ">
              {urlify(message.body).map((obj, index) => {
                return (
                  <Text
                    className={
                      "description " +
                      (message.userID === userID ? "white" : "primary")
                    }
                    key={index}
                  >
                    {obj}
                  </Text>
                );
              })}
            </View>
          </View>
          <View className="relative br4">
            <View
              className="clickable align-end pr2"
              onClick={() => {
                setMessageOptions(!messageOptions);
              }}
              onMouseLeave={() => setMessageOptions(false)}
            >
              <Text
                className={
                  "fs-12 " + (message.userID === userID ? "white" : "grey-1")
                }
              >
                {dayjs(message.server_timestamp).format("h:mm A")}
              </Text>
            </View>
            {messageOptions && (
              <View
                className="absolute top-100 left-0 pt4"
                style={{ zIndex: 1 }}
              >
                <View className="column x-fill bg-white border-all px16 py8 br8">
                  <View
                    className="button-8 clickable align-center"
                    onClick={(e) => {
                      e.preventDefault();
                      if (message.userID === userID) {
                        setDeleteMessageConfirm(true);
                        setMessageOptions(false);
                      } else {
                        setReportModal(!reportModal);
                      }
                    }}
                  >
                    <Text className="flex-fill">
                      {message.userID === userID
                        ? "Delete Message"
                        : "Report Message"}
                    </Text>
                    <FontAwesomeIcon
                      className="ml8"
                      icon={
                        message.userID === userID
                          ? faTrash
                          : faExclamationTriangle
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        {deleteMessageConfirm && (
          <ConfirmAlertModal
            close={() => setDeleteMessageConfirm(false)}
            message="Are you sure you would like to delete this message?"
            submit={() =>
              deleteMessage(activeConversationID, message.id, setMessages)
            }
            title="Delete Message"
          />
        )}
      </View>
    );
}

export default Message;
