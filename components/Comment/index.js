import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faHeart } from "@fortawesome/pro-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/pro-solid-svg-icons/faHeart";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import DisplayName from "../views/DisplayName";
import ContentOptions from "../ContentOptions";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";

import { styles } from "../../styles";

import {
  getIsUserOnline,
  getUserBasicInfo,
  hasUserBlockedUser,
  userSignUpProgress,
} from "../../util";
import { findPossibleUsersToTag } from "../Vent/util";
import {
  deleteComment,
  editComment,
  getCommentHasLiked,
  likeOrUnlikeComment,
  reportComment,
  swapTags,
} from "./util";

dayjs.extend(relativeTime);

function CommentComponent() {
  return (
    <View>
      <Text>Chat With Strangers</Text>
    </View>
  );
}

export default CommentComponent;
