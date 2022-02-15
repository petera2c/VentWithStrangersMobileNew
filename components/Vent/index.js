import React, { useContext, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { faBirthdayCake } from "@fortawesome/pro-regular-svg-icons/faBirthdayCake";
import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faComments } from "@fortawesome/pro-regular-svg-icons/faComments";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Comment from "../Comment";
//import ConfirmAlertModal from "../modals/ConfirmAlert";
import KarmaBadge from "../views/KarmaBadge";
//import LoadingHeart from "../views/loaders/Heart";
import MakeAvatar from "../views/MakeAvatar";
//import Options from "../Options";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";
import {
  blockUser,
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
  hasUserBlockedUser,
  isUserAccountNew,
  isUserKarmaSufficient,
  userSignUpProgressFunction,
  viewTagFunction,
} from "../../util";
import {
  commentVent,
  deleteVent,
  findPossibleUsersToTag,
  getVent,
  getVentComments,
  getVentDescription,
  getVentPartialLink,
  likeOrUnlikeVent,
  newVentCommentListener,
  reportVent,
  startConversation,
  ventHasLiked,
} from "./util";

dayjs.extend(relativeTime);

function VentComponent({
  disablePostOnClick,
  displayCommentField,
  isOnSingleVentPage,
  navigation,
  previewMode,
  searchPreviewMode,
  setTitle,
  ventID,
  ventInit,
}) {
  const textInput = useRef(null);

  const { user, userBasicInfo } = useContext(UserContext);

  const [activeSort, setActiveSort] = useState("First");
  const [author, setAuthor] = useState({});
  const [blockModal, setBlockModal] = useState(false);
  const [canLoadMoreComments, setCanLoadMoreComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentString, setCommentString] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [vent, setVent] = useState(ventInit);

  const [isUserAccountNewLocal, setIsUserAccountNewLocal] = useState();
  const [signUpProgressFunction, setSignUpProgressFunction] = useState();
  const [partialLink, setPartialLink] = useState("");
  const [ventPreview, setVentPreview] = useState("");

  useEffect(() => {
    let isUserOnlineSubscribe;
    let newCommentListenerUnsubscribe;

    const ventSetUp = (newVent) => {
      isUserOnlineSubscribe = getIsUserOnline((isUserOnline) => {
        setIsUserOnline(isUserOnline.state);
      }, newVent.userID);

      setPartialLink(getVentPartialLink(newVent));
      setVentPreview(getVentDescription(previewMode, newVent));

      if (setTitle && newVent && newVent.title) setTitle(newVent.title);

      getUserBasicInfo((author) => {
        setAuthor(author);
      }, newVent.userID);

      if (user)
        hasUserBlockedUser(user.uid, newVent.userID, setIsContentBlocked);

      setIsUserAccountNewLocal(isUserAccountNew(userBasicInfo));

      setSignUpProgressFunction(
        userSignUpProgressFunction(setStarterModal, user)
      );

      setVent(newVent);
    };

    if (!ventInit) {
      getVent(ventSetUp, ventID);
    } else ventSetUp(ventInit);

    if (!searchPreviewMode && displayCommentField)
      newCommentListenerUnsubscribe = newVentCommentListener(
        setCanLoadMoreComments,
        setComments,
        user ? user.uid : "",
        ventID
      );

    if (!searchPreviewMode && !previewMode) {
      getVentComments(
        "First",
        undefined,
        setCanLoadMoreComments,
        setComments,
        false,
        ventID
      );
    }

    if (user && !searchPreviewMode)
      ventHasLiked(
        (newHasLiked) => {
          setHasLiked(newHasLiked);
        },
        user.uid,
        ventID
      );

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
      if (newCommentListenerUnsubscribe) newCommentListenerUnsubscribe();
    };
  }, [
    displayCommentField,
    previewMode,
    searchPreviewMode,
    setTitle,
    user,
    userBasicInfo,
    ventInit,
    ventID,
  ]);

  if ((!vent || (vent && !vent.server_timestamp)) && isOnSingleVentPage)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );

  if (isContentBlocked) return <View />;

  return (
    <View>
      <Text>Vent</Text>
    </View>
  );
}

export default VentComponent;
