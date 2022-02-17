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
      <View style={{ ...styles.xFill }}>
        {urlify(message.body).map((obj, index) => {
          return (
            <Text key={index} style={{ ...styles.fs20, ...styles.colorGrey11 }}>
              {obj}
            </Text>
          );
        })}
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
            {message.userID !== userID &&
              shouldShowDisplayName &&
              displayName && <Text className="orange">{displayName}</Text>}
            <View>
              {urlify(message.body).map((obj, index) => {
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
            <View
              onClick={() => {
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
