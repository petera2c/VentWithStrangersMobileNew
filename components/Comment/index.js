import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
  getCommentHasLiked,
  likeOrUnlikeComment,
  reportComment,
  swapTags,
} from "./util";

dayjs.extend(relativeTime);

function CommentComponent({
  arrayLength,
  comment2,
  commentID,
  commentIndex,
  navigation,
  setComments,
  setCommentString,
  setEdittingCommentID,
  ventUserID,
}) {
  const { user } = useContext(UserContext);

  const [comment, setComment] = useState(comment2);
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState({});

  useEffect(() => {
    setComment(comment2);
    let isUserOnlineSubscribe;

    if (user) {
      getCommentHasLiked(
        commentID,
        (hasLiked) => {
          setHasLiked(hasLiked);
        },
        user.uid
      );
      hasUserBlockedUser(user.uid, comment2.userID, setIsContentBlocked);
    }

    getUserBasicInfo((newBasicUserInfo) => {
      setUserBasicInfo(newBasicUserInfo);
    }, comment2.userID);

    isUserOnlineSubscribe = getIsUserOnline((isUserOnline) => {
      setIsUserOnline(isUserOnline.state);
    }, comment2.userID);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [commentID, comment2, user]);

  if (isContentBlocked) return <View />;

  return (
    <View style={{ ...styles.pa16 }}>
      <View
        style={{ ...styles.flexRow, ...styles.justifyBetween, ...styles.mb16 }}
      >
        <DisplayName
          displayName={userBasicInfo.displayName}
          isUserOnline={isUserOnline}
          navigation={navigation}
          userBasicInfo={userBasicInfo}
          userID={comment.userID}
        />

        {user && (
          <ContentOptions
            canUserInteractFunction={
              userSignUpProgress(user, true)
                ? () => {
                    const userInteractionIssues = userSignUpProgress(user);

                    if (userInteractionIssues) {
                      if (userInteractionIssues === "NSI")
                        return setStarterModal(true);
                    }
                  }
                : false
            }
            deleteFunction={(commentID) => {
              deleteComment(comment.id, setComments);
            }}
            editFunction={() => {
              setEdittingCommentID(comment.id);
              setCommentString(comment.text);
            }}
            objectID={comment.id}
            objectUserID={comment.userID}
            reportFunction={() => {
              const userInteractionIssues = userSignUpProgress(user);

              if (userInteractionIssues) {
                if (userInteractionIssues === "NSI") setStarterModal(true);
                return;
              }

              reportComment(comment.id, user.uid, comment.ventID);
            }}
            userID={user.uid}
          />
        )}
      </View>
      <Text style={{ ...styles.pTag, ...styles.mb16 }}>
        {swapTags(comment.text, navigation)}
      </Text>

      <View
        style={{
          ...styles.flexRow,
          ...styles.alignCenter,
          ...styles.justifyBetween,
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            const userInteractionIssues = userSignUpProgress(user);

            if (userInteractionIssues) {
              if (userInteractionIssues === "NSI") setStarterModal(true);
              return;
            }

            await likeOrUnlikeComment(comment, hasLiked, user);
            await getCommentHasLiked(commentID, setHasLiked, user.uid);

            if (hasLiked) comment.like_counter--;
            else comment.like_counter++;
            setComment({ ...comment });
          }}
          style={{ ...styles.flexRow, ...styles.alignCenter }}
        >
          <FontAwesomeIcon
            icon={hasLiked ? faHeart2 : faHeart}
            size={24}
            style={{
              ...(hasLiked ? styles.colorRed : styles.colorGrey5),
              ...styles.mr4,
            }}
          />
          <Text style={{ ...styles.colorGrey5, ...styles.fs24 }}>
            {comment.like_counter ? comment.like_counter : 0}
          </Text>
        </TouchableOpacity>
        <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
          <FontAwesomeIcon
            icon={faClock}
            style={{ ...styles.colorGrey5, ...styles.mr8 }}
          />
          <Text style={{ ...styles.fs16, ...styles.colorGrey5 }}>
            {dayjs(comment.server_timestamp).fromNow()}
          </Text>
        </View>
      </View>

      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={Boolean(starterModal)}
      />
    </View>
  );
}

export default CommentComponent;
