import React, { useContext, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { off } from "firebase/database";
import algoliasearch from "algoliasearch";
import { showMessage } from "react-native-flash-message";

import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import KarmaBadge from "../../views/KarmaBadge";
import MakeAvatar from "../../views/MakeAvatar";

import { UserContext } from "../../../context";

import { colors, styles } from "../../../styles";

import {
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
} from "../../../util";
import { saveGroup } from "./util";

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);

const usersIndex = searchClient.initIndex("users");
const GROUP_MAX = 5;

function GroupChatCreateModal({
  close,
  groupChatEditting,
  navigation,
  visible,
}) {
  const { userBasicInfo } = useContext(UserContext);

  const [chatNameString, setChatNameString] = useState(
    groupChatEditting && groupChatEditting.chat_name
      ? groupChatEditting.chat_name
      : ""
  );
  const [existingUsers, setExistingUsers] = useState([]);
  const [users, setUsers] = useState(groupChatEditting ? [] : [userBasicInfo]);
  const [hits, setHits] = useState([]);
  const [userSearchString, setUserSearchString] = useState("");

  useEffect(() => {
    setExistingUsers([]);

    if (groupChatEditting && groupChatEditting.members) {
      for (let index in groupChatEditting.members) {
        getUserBasicInfo((userBasicInfo) => {
          setExistingUsers((existingUsers) => {
            existingUsers.push(userBasicInfo);
            return [...existingUsers];
          });
        }, groupChatEditting.members[index]);
      }
    }
  }, [groupChatEditting]);

  const isNewGroupChatOrOwner =
    !groupChatEditting ||
    (groupChatEditting && groupChatEditting.group_owner === userBasicInfo.id);

  return (
    <Modal transparent={true} visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ ...styles.flexFill }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            close();
            Keyboard.dismiss();
          }}
          style={{
            ...styles.fill,
            ...styles.justifyEnd,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <TouchableWithoutFeedback>
            <SafeAreaView
              style={{
                ...styles.box,
                maxHeight: "60%",
              }}
            >
              <ScrollView>
                <View onStartShouldSetResponder={() => true}>
                  <View style={{ ...styles.bgMain, ...styles.pa16 }}>
                    <Text style={{ ...styles.title, ...styles.colorWhite }}>
                      {groupChatEditting
                        ? groupChatEditting.chat_name
                        : "Create New Group Chat"}{" "}
                    </Text>
                  </View>

                  <View style={{ ...styles.pa32 }}>
                    {existingUsers && existingUsers.length > 0 && (
                      <View style={{ ...styles.mb16 }}>
                        <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                          Users In Chat
                        </Text>
                        {existingUsers.map((user) => {
                          return (
                            <DisplayExistingUser
                              groupChatEditting={groupChatEditting}
                              key={user.id}
                              navigation={navigation}
                              setExistingUsers={setExistingUsers}
                              user={user}
                              userBasicInfo={userBasicInfo}
                            />
                          );
                        })}
                      </View>
                    )}

                    {isNewGroupChatOrOwner && (
                      <View>
                        <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>
                          Change Chat Name or Add Users
                        </Text>
                        <TextInput
                          onChangeText={(text) => {
                            setChatNameString(text);
                          }}
                          placeholder="Group Chat Name"
                          placeholderTextColor={colors.grey1}
                          style={{ ...styles.input }}
                          value={chatNameString}
                        />
                        <TextInput
                          onChangeText={(text) => {
                            setUserSearchString(text);
                            usersIndex
                              .search(text, {
                                hitsPerPage: 10,
                              })
                              .then(({ hits }) => {
                                setHits(hits);
                              });
                          }}
                          placeholder="Search for people to add by name or their ID"
                          placeholderTextColor={colors.grey1}
                          style={{ ...styles.input, ...styles.mb16 }}
                          value={userSearchString}
                        />
                        {hits.length > 0 && (
                          <View>
                            <Text
                              style={{ ...styles.titleSmall, ...styles.mb16 }}
                            >
                              Search Results
                            </Text>
                            <View style={{ ...styles.flexRow, ...styles.wrap }}>
                              {hits.map((hit) => {
                                if (
                                  users.find(
                                    (user) => user.id === hit.objectID
                                  ) ||
                                  existingUsers.find(
                                    (user) => user.id === hit.objectID
                                  )
                                ) {
                                  return (
                                    <View
                                      key={hit.objectID}
                                      style={{ display: "none" }}
                                    />
                                  );
                                } else
                                  return (
                                    <HitDisplay
                                      existingUsers={existingUsers}
                                      hit={hit}
                                      key={hit.objectID}
                                      setUsers={setUsers}
                                    />
                                  );
                              })}
                            </View>
                          </View>
                        )}
                        {users.length > 0 && (
                          <View>
                            <Text
                              style={{ ...styles.titleSmall, ...styles.mb16 }}
                            >
                              Selected People
                            </Text>
                            <View
                              style={{
                                ...styles.flexRow,
                                ...styles.alignStart,
                                ...styles.wrap,
                              }}
                            >
                              {users.map((user) => {
                                return (
                                  <TouchableOpacity
                                    key={user.id}
                                    onPress={() => {
                                      if (user.id === userBasicInfo.id) {
                                        return showMessage({
                                          message:
                                            "You can not remove yourself.",
                                          type: "error",
                                        });
                                      }

                                      setUsers((users) => {
                                        users.splice(
                                          users.findIndex(
                                            (user2) => user2.id === user.id
                                          ),
                                          1
                                        );
                                        return [...users];
                                      });
                                    }}
                                    style={{ ...styles.buttonSecondary }}
                                  >
                                    <View
                                      style={{
                                        ...styles.flexRow,
                                        ...styles.alignCenter,
                                      }}
                                    >
                                      <MakeAvatar
                                        displayName={user.displayName}
                                        size="small"
                                        userBasicInfo={user}
                                      />
                                      <Text
                                        style={{
                                          ...styles.pTag,
                                          ...styles.mx8,
                                        }}
                                      >
                                        {capitolizeFirstChar(user.displayName)}
                                      </Text>
                                    </View>
                                    <KarmaBadge
                                      noOnClick={true}
                                      noTooltip={true}
                                      userBasicInfo={user}
                                    />
                                    <FontAwesomeIcon
                                      icon={faTimes}
                                      size={24}
                                      style={{ ...styles.colorMain }}
                                    />
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  {isNewGroupChatOrOwner && (
                    <View
                      style={{
                        ...styles.flexRow,
                        ...styles.alignCenter,
                        ...styles.px8,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => close()}
                        style={{
                          ...styles.flexFill,
                          ...styles.fullCenter,
                          ...styles.border,
                          ...styles.br4,
                          ...styles.mr8,
                          ...styles.pa8,
                        }}
                      >
                        <Text style={{ ...styles.pTag }}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          saveGroup(
                            chatNameString,
                            existingUsers,
                            groupChatEditting,
                            navigation,
                            userBasicInfo.id,
                            users
                          );
                          close();
                        }}
                        style={{
                          ...styles.buttonPrimary,
                          ...styles.flexFill,
                          ...styles.ml8,
                        }}
                      >
                        <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                          Save
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function DisplayExistingUser({
  groupChatEditting,
  navigation,
  setExistingUsers,
  user,
  userBasicInfo,
}) {
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    let isUserOnlineSubscribe;

    isUserOnlineSubscribe = getIsUserOnline((isUserOnlineObj) => {
      if (isUserOnlineObj && isUserOnlineObj.state) {
        if (isUserOnlineObj.state === "online") setIsUserOnline(true);
        else setIsUserOnline(false);
      }
    }, user.id);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [user]);

  return (
    <View style={{ ...styles.flexRow, ...styles.alignCenter, ...styles.mb8 }}>
      <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
        <MakeAvatar
          displayName={user.displayName}
          size="small"
          userBasicInfo={user}
        />
        <TouchableOpacity
          onPress={() => navigation.jumpTo("Profile", { userID: user.id })}
        >
          <Text style={{ ...styles.pTag, ...styles.mr8 }}>
            {user.displayName}
          </Text>
        </TouchableOpacity>
        {isUserOnline && (
          <View style={{ ...styles.onlineDot, ...styles.mr8 }} />
        )}
      </View>
      <KarmaBadge noOnClick={true} noTooltip={true} userBasicInfo={user} />
      {groupChatEditting && groupChatEditting.group_owner === userBasicInfo.id && (
        <TouchableOpacity
          onPress={() => {
            if (user.id === userBasicInfo.id) {
              return showMessage({
                message: "You can not remove yourself.",
                type: "error",
              });
            }

            setExistingUsers((users) => {
              users.splice(
                users.findIndex((user2) => user2.id === user.id),
                1
              );
              return [...users];
            });
          }}
          style={{ ...styles.ml8 }}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size={24}
            style={{ ...styles.colorGrey1 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

function HitDisplay({ existingUsers, hit, setUsers }) {
  const [userBasicInfo, setUserBasicInfo] = useState();

  useEffect(() => {
    getUserBasicInfo((userBasicInfo) => {
      setUserBasicInfo(userBasicInfo);
    }, hit.objectID);
  }, [hit, setUserBasicInfo]);

  return (
    <TouchableOpacity
      onPress={() => {
        setUsers((users) => {
          if (existingUsers.length + users.length >= GROUP_MAX) {
            showMessage({
              message: `Groups can have a max of ${GROUP_MAX} people!`,
              type: "info",
            });
            return users;
          }
          users.push(userBasicInfo);
          return [...users];
        });
      }}
    >
      <View
        style={{
          ...styles.flexRow,
          ...styles.alignCenter,
          ...styles.mr8,
          ...styles.mb8,
        }}
      >
        {userBasicInfo && (
          <MakeAvatar
            displayName={hit.displayName}
            size="small"
            userBasicInfo={userBasicInfo}
          />
        )}
        <Text style={{ ...styles.pTag }}>{hit.displayName}</Text>
      </View>
      {userBasicInfo && (
        <KarmaBadge
          noOnClick={true}
          noTooltip={true}
          userBasicInfo={userBasicInfo}
        />
      )}
    </TouchableOpacity>
  );
}

export default GroupChatCreateModal;
