import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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

function ChatsScreen({ navigation }) {
  const { user } = useContext(UserContext);

  const [activeChatUserBasicInfos, setActiveChatUserBasicInfos] = useState();
  const [activeConversation, setActiveConversation] = useState();
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversations, setConversations] = useState([]);
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
            setActiveConversation,
            setCanLoadMore,
            setConversations
          ),
        user.uid
      );
    }

    return () => {
      if (newMessageListenerUnsubscribe) newMessageListenerUnsubscribe();
    };
  }, [user]);

  return (
    <Screen navigation={navigation}>
      {!activeConversation && (
        <View className="flex-fill column ov-auto bg-white pa8 br4">
          {conversations.length === 0 && (
            <TouchableOpacity className="" to="/people-online">
              <Text className="TouchableOpacity-1 grey-1 tac">
                <Text className="blue">Start</Text> a conversation with someone!
              </Text>
            </TouchableOpacity>
          )}
          <ScrollView>
            <View style={{ ...styles.pa16 }}>
              {conversations.map((conversation, index) => {
                return (
                  <ConversationOption
                    activeChatUserBasicInfos={activeChatUserBasicInfos}
                    conversation={conversation}
                    isActive={
                      activeConversation
                        ? conversation.id === activeConversation.id
                        : false
                    }
                    key={conversation.id}
                    setActiveConversation={setActiveConversation}
                    setActiveChatUserBasicInfos={setActiveChatUserBasicInfos}
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
                        if (newConversations.length < 5) setCanLoadMore(false);

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
        </View>
      )}
      {activeConversation && (
        <View style={{ ...styles.flexFill }}>
          {!activeConversation && user && user.emailVerified && (
            <TouchableOpacity className="grey-1 tac pa32" to="/people-online">
              <Text className="tac">
                Check your messages from friends on Vent With Strangers,{" "}
              </Text>
              <Text className="blue">See Who is Online :)</Text>
            </TouchableOpacity>
          )}
          {(!user || (user && !user.emailVerified)) && (
            <Text
              className="TouchableOpacity-1 grey-1 tac pa32"
              onClick={() => {
                if (!user) setStarterModal(true);
                else {
                  userSignUpProgress(user);
                }
              }}
            >
              Check your messages from friends on Vent With Strangers,
              <Text className="blue">
                {user ? " verify your email!" : " get started here!"}
              </Text>
            </Text>
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
                setActiveConversation={setActiveConversation}
                setActiveChatUserBasicInfos={setActiveChatUserBasicInfos}
                userID={user.uid}
              />
            )}
        </View>
      )}
      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={starterModal}
      />
    </Screen>
  );
}

export default ChatsScreen;
