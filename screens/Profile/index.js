import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { faBaby } from "@fortawesome/pro-solid-svg-icons/faBaby";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faGlassCheers } from "@fortawesome/pro-solid-svg-icons/faGlassCheers";
import { faLandmark } from "@fortawesome/pro-solid-svg-icons/faLandmark";
import { faPray } from "@fortawesome/pro-solid-svg-icons/faPray";
import { faSchool } from "@fortawesome/pro-solid-svg-icons/faSchool";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Comment from "../../components/Comment";
import KarmaBadge from "../../components/views/KarmaBadge";
import MakeAvatar from "../../components/views/MakeAvatar";
import Screen from "../../components/containers/Screen";
import StarterModal from "../../components/modals/Starter";
import Vent from "../../components/Vent";

import { UserContext } from "../../context";

import { startConversation } from "../../components/Vent/util";
import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
} from "../../PersonalOptions";
import {
  blockUser,
  calculateKarma,
  capitolizeFirstChar,
  getIsMobileOrTablet,
  getIsUserOnline,
  getUserBasicInfo,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import {
  followOrUnfollowUser,
  getIsFollowing,
  getUser,
  getUsersComments,
  getUsersVents,
} from "./util";

dayjs.extend(relativeTime);

function ProfileScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Profile</Text>
    </Screen>
  );
}

export default ProfileScreen;
