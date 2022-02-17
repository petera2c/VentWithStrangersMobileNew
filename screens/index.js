import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import BottomHeader from "../components/navigations/BottomHeader";
import Drawer from "../components/navigations/Drawer";

import { OnlineUsersContext, RouteContext, UserContext } from "../context";

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
    if (user) {
      import("./util").then((functions) => {
        newRewardListenerUnsubscribe = functions.newRewardListener(
          setNewReward,
          user.uid
        );
        functions.getIsUsersBirthday(setIsUsersBirthday, user.uid);
        functions.getIsUserSubscribed(setUserSubscription, user.uid);
        functions.setIsUserOnlineToDatabase(user.uid);
      });

      import("../util").then((functions) => {
        functions.getUserBasicInfo((newBasicUserInfo) => {
          setUserBasicInfo(newBasicUserInfo);
        }, user.uid);
      });
    }

    return () => {
      if (newRewardListenerUnsubscribe) newRewardListenerUnsubscribe();
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
