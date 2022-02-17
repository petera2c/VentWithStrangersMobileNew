import React, { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import BottomHeader from "../components/navigations/BottomHeader";
import Drawer from "../components/navigations/Drawer";

import { OnlineUsersContext, RouteContext, UserContext } from "../context";

import { getUserBasicInfo } from "../util";
import {
  getIsUsersBirthday,
  getIsUserSubscribed,
  newRewardListener,
  setIsUserOnlineToDatabase,
  setUserOnlineStatus,
} from "./util";

const Stack = createNativeStackNavigator();

function Routes() {
  const [activeRoute, setActiveRoute] = useState();
  const [firstOnlineUsers, setFirstOnlineUsers] = useState([]);
  const [isUsersBirthday, setIsUsersBirthday] = useState(false);
  const [newReward, setNewReward] = useState();
  const [totalOnlineUsers, setTotalOnlineUsers] = useState();
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userSubscription, setUserSubscription] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  onAuthStateChanged(getAuth(), (user) => {
    setLoading(false);
    if (user) setUser(user);
  });

  useEffect(() => {
    let newRewardListenerUnsubscribe;

    const appStateListener = () => {
      if (user) {
        if (AppState.currentState === "active") {
          setUserOnlineStatus("online", user.uid);
        } else setUserOnlineStatus("offline", user.uid);
      }
    };

    if (user) {
      newRewardListenerUnsubscribe = newRewardListener(setNewReward, user.uid);
      getIsUsersBirthday(setIsUsersBirthday, user.uid);
      getIsUserSubscribed(setUserSubscription, user.uid);
      setIsUserOnlineToDatabase(user.uid);

      getUserBasicInfo((newBasicUserInfo) => {
        setUserBasicInfo(newBasicUserInfo);
      }, user.uid);
    }

    AppState.addEventListener("change", appStateListener);

    return () => {
      if (newRewardListenerUnsubscribe) newRewardListenerUnsubscribe();
      AppState.removeEventListener("change", appStateListener);
    };
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        userBasicInfo,
        userSubscription,
        setUserBasicInfo,
        setUserSubscription,
      }}
    >
      <OnlineUsersContext.Provider
        value={{
          firstOnlineUsers,
          setFirstOnlineUsers,
          setTotalOnlineUsers,
          totalOnlineUsers,
        }}
      >
        <RouteContext.Provider value={{ activeRoute, setActiveRoute }}>
          <NavigationContainer>
            <Drawer />
          </NavigationContainer>
        </RouteContext.Provider>
      </OnlineUsersContext.Provider>
    </UserContext.Provider>
  );
}

export default Routes;
