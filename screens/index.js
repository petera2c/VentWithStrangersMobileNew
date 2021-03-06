import React, { useEffect, useState } from "react";
import { AppState, Image, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FlashMessage from "react-native-flash-message";

import Drawer from "../components/navigations/Drawer";
import NewRewardModal from "../components/modals/NewReward";
import PrivacyScreen from "./Basic/Privacy";

import { OnlineUsersContext, RouteContext, UserContext } from "../context";
import { styles } from "../styles";

import { getUserBasicInfo } from "../util";
import {
  //getIsUsersBirthday,
  getIsUserSubscribed,
  newRewardListener,
  setIsUserOnlineToDatabase,
  setUserOnlineStatus,
} from "./util";

function Routes() {
  const [activeRoute, setActiveRoute] = useState();
  const [firstLaunch, setFirstLaunch] = useState(null);
  const [firstOnlineUsers, setFirstOnlineUsers] = useState([]);
  //const [isUsersBirthday, setIsUsersBirthday] = useState(false);
  const [newReward, setNewReward] = useState();
  const [totalOnlineUsers, setTotalOnlineUsers] = useState();
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userSubscription, setUserSubscription] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  onAuthStateChanged(getAuth(), (user) => {
    setLoading(false);
    if (user) setUser(user);
    else {
      setUser();
      setUserSubscription();
      if (userBasicInfo.displayName) setUserBasicInfo({});
    }
  });

  useEffect(() => {
    let newRewardListenerUnsubscribe;

    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value === "false" || !value) {
        setFirstLaunch(true);
      } else {
        setFirstLaunch(false);
      }
    });

    const appStateListener = () => {
      if (user) {
        if (AppState.currentState === "active") {
          setUserOnlineStatus("online", user.uid);
        } else setUserOnlineStatus("offline", user.uid);
      }
    };

    if (user) {
      newRewardListenerUnsubscribe = newRewardListener(setNewReward, user.uid);
      //getIsUsersBirthday(setIsUsersBirthday, user.uid);
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

  if (loading) {
    return <View />;
  } else if (firstLaunch === null)
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, ...styles.fullCenter }}>
          <Image
            source={require("../assets/icon0.png")}
            style={{ width: 300, height: 300 }}
          />
        </View>
      </View>
    );
  else if (firstLaunch)
    return <PrivacyScreen setFirstLaunch={setFirstLaunch} />;
  else
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
            {newReward && (
              <NewRewardModal
                close={() => setNewReward(false)}
                newReward={newReward}
                visible={Boolean(newReward)}
              />
            )}
          </RouteContext.Provider>
        </OnlineUsersContext.Provider>
        <FlashMessage position="top" />
      </UserContext.Provider>
    );
}

export default Routes;
