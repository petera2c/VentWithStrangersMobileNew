import React, { useContext, useEffect } from "react";
import useState from "react-usestateref";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { sendEmailVerification } from "firebase/auth";

import { faBars } from "@fortawesome/pro-solid-svg-icons/faBars";
import { faBell } from "@fortawesome/pro-solid-svg-icons/faBell";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faHouse } from "@fortawesome/pro-solid-svg-icons/faHouse";
import { faPen } from "@fortawesome/pro-solid-svg-icons/faPen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Rules from "../../../screens/Basic/Rules";
import SiteInfo from "../../../screens/Basic/SiteInfo";

import Feed from "../../../screens/Feed";
import SingleVent from "../../../screens/Feed/SingleVent";

import Account from "../../../screens/Profile/Account";
import Avatar from "../../../screens/Profile/Avatar";
import Notifications from "../../../screens/Profile/Notifications";
import Profile from "../../../screens/Profile";
import Settings from "../../../screens/Profile/Settings";

import QuoteContest from "../../../screens/QuoteContest";
import TopQuotesMonth from "../../../screens/QuoteContest/TopQuotesMonth";

import Chats from "../../../screens/Chats";
import ChatWithStrangers from "../../../screens/ChatWithStrangers";
import NewVent from "../../../screens/NewVent";
import OnlineUsers from "../../../screens/OnlineUsers";
import Rewards from "../../../screens/Rewards";

import AllTags from "../../../screens/tags/All";
import IndividualTag from "../../../screens/tags/Individual";

import { RouteContext, UserContext } from "../../../context";

import { styles } from "../../../styles";

import {
  conversationsListener,
  newNotificationsListener,
  getNotifications,
  getUnreadConversations,
  isUserInQueueListener,
  leaveQueue,
  readNotifications,
  resetUnreadConversationCount,
} from "./util";

const Tab = createBottomTabNavigator();

function BottomHeader({ navigation, route }) {
  const { activeRoute, setActiveRoute } = useContext(RouteContext);

  const { user, userBasicInfo } = useContext(UserContext);

  const [activeModal, setActiveModal] = useState("");
  const [isUserInQueue, setIsUserInQueue, isUserInQueueRef] = useState();
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showFeedbackContainer, setShowFeedbackContainer] = useState(false);
  const [unreadConversationsCount, setUnreadConversationsCount] = useState();

  useEffect(() => {
    let conversationsUnsubscribe;
    let isUserInQueueUnsubscribe;
    let newConversationsListenerUnsubscribe;
    let newNotificationsListenerUnsubscribe;

    if (user) {
      getNotifications(
        [],
        undefined,
        setNotificationCounter,
        setNotifications,
        user
      );

      conversationsUnsubscribe = conversationsListener(navigation, user.uid);
      isUserInQueueUnsubscribe = isUserInQueueListener(
        setIsUserInQueue,
        user.uid
      );
      newConversationsListenerUnsubscribe = getUnreadConversations(
        activeRoute,
        setUnreadConversationsCount,
        user.uid
      );
      newNotificationsListenerUnsubscribe = newNotificationsListener(
        setNotificationCounter,
        setNotifications,
        user
      );
    }

    const cleanup = () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
      if (conversationsUnsubscribe) conversationsUnsubscribe();
      if (user && isUserInQueueRef.current) leaveQueue(user.uid);
    };

    return () => {
      cleanup();
      if (isUserInQueueUnsubscribe) isUserInQueueUnsubscribe();
      if (newConversationsListenerUnsubscribe)
        newConversationsListenerUnsubscribe();
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
    };
  }, [activeRoute, isUserInQueueRef, navigation, setIsUserInQueue, user]);

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
      }}
      tabBar={({ navigation, state }) => {
        return (
          <SafeAreaView style={{ ...styles.flexRow }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Feed");
              }}
              style={{
                flex: 1,
                ...styles.fullCenter,
                ...styles.py16,
              }}
            >
              <FontAwesomeIcon
                icon={faHouse}
                size={28}
                style={{
                  ...(state.index === 0 ? styles.colorMain : styles.colorGrey1),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (user)
                  resetUnreadConversationCount(
                    setUnreadConversationsCount,
                    user.uid
                  );

                navigation.navigate("Chats");
              }}
              style={{
                ...styles.flexRow,
                flex: 1,
                ...styles.fullCenter,
                ...styles.py16,
              }}
            >
              <FontAwesomeIcon
                icon={faComments}
                size={28}
                style={{
                  ...(state.index === 1 ? styles.colorMain : styles.colorGrey1),
                  ...styles.mr8,
                }}
              />
              {Boolean(unreadConversationsCount) && (
                <View
                  style={{
                    ...styles.bgRed,
                    ...styles.px4,
                    ...styles.br4,
                  }}
                >
                  <Text
                    style={{
                      ...styles.colorWhite,
                      ...styles.fs22,
                    }}
                  >
                    {unreadConversationsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("NewVent");
              }}
              style={{ flex: 1, ...styles.fullCenter, ...styles.py16 }}
            >
              <FontAwesomeIcon
                icon={faPen}
                size={28}
                style={{
                  ...(state.index === 2 ? styles.colorMain : styles.colorGrey1),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                readNotifications(notifications, setNotificationCounter);
                navigation.navigate("Notifications");
              }}
              style={{
                ...styles.flexRow,
                flex: 1,
                ...styles.fullCenter,
                ...styles.py16,
              }}
            >
              <FontAwesomeIcon
                icon={faBell}
                size={28}
                style={{
                  ...(state.index === 3 ? styles.colorMain : styles.colorGrey1),
                  ...styles.mr8,
                }}
              />
              {Boolean(notificationCounter) && (
                <View
                  style={{
                    ...styles.bgRed,
                    ...styles.px4,
                    ...styles.br4,
                  }}
                >
                  <Text
                    style={{
                      ...styles.colorWhite,
                      ...styles.fs22,
                    }}
                  >
                    {notificationCounter}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
              style={{ flex: 1, ...styles.fullCenter, ...styles.py16 }}
            >
              <FontAwesomeIcon
                icon={faBars}
                size={28}
                style={{
                  ...styles.colorGrey1,
                }}
              />
            </TouchableOpacity>
          </SafeAreaView>
        );
      }}
    >
      <Tab.Screen
        component={Feed}
        name="Feed"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Chats}
        name="Chats"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={NewVent}
        name="NewVent"
        options={{
          headerShown: false,
        }}
        tabBarOptions={{
          showLabel: false,
        }}
      />
      <Tab.Screen
        component={Notifications}
        name="Notifications"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Profile}
        name="Profile"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Avatar}
        name="Avatar"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Account}
        name="Account"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Settings}
        name="Settings"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={OnlineUsers}
        name="OnlineUsers"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={QuoteContest}
        name="QuoteContest"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={ChatWithStrangers}
        name="ChatWithStrangers"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Rewards}
        name="Rewards"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={TopQuotesMonth}
        name="TopQuotesMonth"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Rules}
        name="Rules"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={SiteInfo}
        name="SiteInfo"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={AllTags}
        name="AllTags"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={IndividualTag}
        name="IndividualTag"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={SingleVent}
        name="SingleVent"
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomHeader;
