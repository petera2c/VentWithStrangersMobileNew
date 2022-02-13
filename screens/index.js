import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PrivacyPolicy from "./Basic/PrivacyPolicy";
import Rules from "./Basic/Rules";
import SiteInfo from "./Basic/SiteInfo";

import Feed from "./Feed";
import SingleVent from "./Feed/SingleVent";

import Account from "./Profile/Account";
import Avatar from "./Profile/Avatar";
import Notifications from "./Profile/Notifications";
import Profile from "./Profile";
import Settings from "./Profile/Settings";

import QuoteContest from "./QuoteContest";
import TopQuotesMonth from "./QuoteContest/TopQuotesMonth";

import AllTags from "./tags/All";
import IndividualTag from "./tags/Individual";

import Chats from "./Chats";
import ChatWithStrangers from "./ChatWithStrangers";
import MakeFriends from "./MakeFriends";
import NewVent from "./NewVent";
import OnlineUsers from "./OnlineUsers";
import Rewards from "./Rewards";
import Search from "./Search";

import BottomHeader from "../components/navigations/BottomHeader";
import Drawer from "../components/navigations/Drawer";

const Stack = createNativeStackNavigator();

function Routes() {
  return (
    <NavigationContainer>
      <Drawer />
    </NavigationContainer>
  );
}

export default Routes;
