import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CreateGroupChatModal from "../../components/modals/CreateGroupChat";
import Screen from "../../components/containers/Screen";
import StarterModal from "../../components/modals/Starter";

import ConversationOption from "./ConversationOption";
import Chat from "./chat";

import { UserContext } from "../../context";

import { styles } from "../../styles";

import { userSignUpProgress } from "../../util";

import {
  getConversations,
  mostRecentConversationListener,
  setInitialConversationsAndActiveConversation,
} from "./util";

function ChatsScreen({ navigation, route }) {
  const { user } = useContext(UserContext);

  const [activeChatUserBasicInfos, setActiveChatUserBasicInfos] = useState();
  const [activeConversation, setActiveConversation] = useState();
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [groupChatEditting, setGroupChatEditting] = useState();
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [starterModal, setStarterModal] = useState(false);

  useEffect(() => {
    let newMessageListenerUnsubscribe;

    if (user) {
      newMessageListenerUnsubscribe = mostRecentConversationListener(
        setConversations,
        user.uid
      );

      getConversations(
        [],
        (newConversations) =>
          setInitialConversationsAndActiveConversation(
            newConversations,
            false,
            route,
            setActiveConversation,
            setCanLoadMore,
            setConversations
          ),
        user.uid
      );
    }

    setTimeout(() => setRefreshing(false), 400);

    return () => {
      if (newMessageListenerUnsubscribe) newMessageListenerUnsubscribe();
    };
  }, [refreshing, setRefreshing, user]);

  return (
    <Screen navigation={navigation}>
      {!activeConversation && (
        <View style={{ ...styles.flexFill }}>
          {user && user.emailVerified && (
            <View style={{ ...styles.pt16, ...styles.px16 }}>
              <TouchableOpacity
                onPress={() => {
                  setGroupChatEditting(false);
                  setIsCreateGroupModalVisible(true);
                }}
                style={{ ...styles.buttonPrimary, ...styles.mb16 }}
              >
                <Text
                  style={{
                    ...styles.fs20,
                    ...styles.colorWhite,
                  }}
                >
                  New Group Chat
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {user && conversations.length === 0 && (
            <TouchableOpacity
              onPress={() => navigation.jumpTo("OnlineUsers")}
              style={{
                ...styles.box,
                ...styles.mx16,
                ...styles.mt16,
                ...styles.pa16,
              }}
            >
              <Text style={{ ...styles.title }}>
                <Text style={{ ...styles.colorMain }}>Start</Text> a
                conversation with someone!
              </Text>
            </TouchableOpacity>
          )}
          {!user && conversations.length === 0 && (
            <TouchableOpacity
              onPress={() => setStarterModal(true)}
              style={{ ...styles.box, ...styles.ma16, ...styles.pa16 }}
            >
              <Text style={{ ...styles.title }}>
                <Text style={{ ...styles.colorMain }}>Sign In</Text> to view
                your conversations
              </Text>
            </TouchableOpacity>
          )}
          {user && conversations.length > 0 && (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => setRefreshing(true)}
                />
              }
              style={{ flex: 1 }}
            >
              <View style={{ ...styles.pa16 }}>
                {conversations.map((conversation) => {
                  return (
                    <ConversationOption
                      conversation={conversation}
                      isActive={
                        activeConversation
                          ? conversation.id === activeConversation.id
                          : false
                      }
                      key={conversation.id}
                      navigation={navigation}
                      setActiveChatUserBasicInfos={setActiveChatUserBasicInfos}
                      setActiveConversation={setActiveConversation}
                      setConversations={setConversations}
                      userID={user.uid}
                    />
                  );
                })}
                {!userSignUpProgress(user, true) && canLoadMore && (
                  <TouchableOpacity
                    onPress={() => {
                      getConversations(
                        conversations,
                        (newConversations) => {
                          if (newConversations.length < 5)
                            setCanLoadMore(false);

                          setConversations((oldConversations) => [
                            ...oldConversations,
                            ...newConversations,
                          ]);
                        },
                        user.uid
                      );
                    }}
                    style={{ ...styles.buttonPrimary }}
                  >
                    <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                      Load More Conversations
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      )}
      {activeConversation && (
        <View style={{ ...styles.flexFill }}>
          {!activeConversation && user && user.emailVerified && (
            <TouchableOpacity onPress={() => navigation.jumpTo("OnlineUsers")}>
              <Text style={{ ...styles.titleSmall, ...styles.tac }}>
                Check your messages from friends on Vent With Strangers,{" "}
                <Text style={{ ...styles.colorMain }}>
                  See Who is Online :)
                </Text>
              </Text>
            </TouchableOpacity>
          )}
          {(!user || (user && !user.emailVerified)) && (
            <TouchableOpacity
              onPress={() => {
                if (!user) setStarterModal(true);
                else {
                  userSignUpProgress(user);
                }
              }}
            >
              <Text style={{ ...styles.titleSmall, ...styles.tac }}>
                Check your messages from friends on Vent With Strangers,
                <Text style={{ ...styles.colorMain }}>
                  {user ? " verify your email!" : " get started here!"}
                </Text>
              </Text>
            </TouchableOpacity>
          )}
          {user &&
            user.emailVerified &&
            activeConversation &&
            activeConversation.id && (
              <Chat
                activeConversation={activeConversation}
                activeChatUserBasicInfos={activeChatUserBasicInfos}
                isChatInConversationsArray={Boolean(
                  conversations.find(
                    (conversation) => conversation.id === activeConversation.id
                  )
                )}
                navigation={navigation}
                setActiveChatUserBasicInfos={setActiveChatUserBasicInfos}
                setActiveConversation={setActiveConversation}
                setGroupChatEditting={setGroupChatEditting}
                setIsCreateGroupModalVisible={setIsCreateGroupModalVisible}
                userID={user.uid}
              />
            )}
        </View>
      )}
      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={Boolean(starterModal)}
      />
      {isCreateGroupModalVisible && (
        <CreateGroupChatModal
          close={() => setIsCreateGroupModalVisible(false)}
          groupChatEditting={groupChatEditting}
          navigation={navigation}
          visible={Boolean(isCreateGroupModalVisible)}
        />
      )}
    </Screen>
  );
}

export default ChatsScreen;
