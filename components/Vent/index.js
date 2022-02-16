import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { faBirthdayCake } from "@fortawesome/pro-regular-svg-icons/faBirthdayCake";
import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Comment from "../Comment";
//import ConfirmAlertModal from "../modals/ConfirmAlert";
import KarmaBadge from "../views/KarmaBadge";
import MakeAvatar from "../views/MakeAvatar";
//import Options from "../Options";
import StarterModal from "../modals/Starter";

import { styles } from "../../styles";

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
  getVentPartialLnk,
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
  console.log(navigation);

  const { user, userBasicInfo } = useContext(UserContext);

  const [activeSort, setActiveSort] = useState("First");
  const [author, setAuthor] = useState({});
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
  const [ventPreview, setVentPreview] = useState("");

  useEffect(() => {
    let isUserOnlineSubscribe;
    let newCommentListenerUnsubscribe;

    const ventSetUp = (newVent) => {
      isUserOnlineSubscribe = getIsUserOnline((isUserOnline) => {
        setIsUserOnline(isUserOnline.state);
      }, newVent.userID);

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
    <View style={{ ...styles.xFill }}>
      {vent && (
        <View style={{ ...styles.box, ...styles.mb16, ...styles.pt16 }}>
          <View style={{ ...styles.borderBottom, ...styles.pa16 }}>
            <View
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
              }}
            >
              <MakeAvatar
                displayName={author.displayName}
                userBasicInfo={author}
              />
              <View
                style={{
                  ...styles.flexRow,
                  ...styles.flexFill,
                  ...styles.alignCenter,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.jumpTo("Profile", { authorID: author.id });
                  }}
                  style={{ ...styles.mr8 }}
                >
                  <Text style={{ ...styles.colorGrey11, ...styles.fs20 }}>
                    {capitolizeFirstChar(author.displayName)}
                  </Text>
                </TouchableOpacity>
                {isUserOnline === "online" && (
                  <View style={{ ...styles.onlineDot, ...styles.mr8 }} />
                )}
                <KarmaBadge userBasicInfo={author} />
              </View>
              {vent.is_birthday_post && (
                <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
                  <FontAwesomeIcon
                    icon={faBirthdayCake}
                    size={32}
                    style={{ ...styles.colorMain, ...styles.mr8 }}
                  />
                  <FontAwesomeIcon
                    icon={faBirthdayCake}
                    size={32}
                    style={{ ...styles.colorMain }}
                  />
                </View>
              )}
              {user && (
                <Options
                  canUserInteractFunction={
                    signUpProgressFunction ? signUpProgressFunction : false
                  }
                  deleteFunction={(ventID) => {
                    deleteVent(navigate, ventID);
                  }}
                  editFunction={() => {
                    navigate("SingleVent-to-strangers?" + vent.id);
                  }}
                  objectID={vent.id}
                  objectUserID={vent.userID}
                  reportFunction={(option) => {
                    if (signUpProgressFunction) return signUpProgressFunction();

                    reportVent(option, user.uid, vent.id);
                  }}
                  userID={user.uid}
                />
              )}
            </View>

            {vent.new_tags && vent.new_tags.length > 0 && (
              <View style={{ ...styles.flexRow, ...styles.wrap }}>
                {vent.new_tags.map((tag, index) => (
                  <Tag key={index} navigation={navigation} tag={tag} />
                ))}
              </View>
            )}
          </View>
          <SmartLink
            disablePostOnClick={disablePostOnClick}
            onPress={
              vent && vent.id
                ? () => navigation.jumpTo("SingleVent", { ventID })
                : ""
            }
            style={{ ...styles.borderBottom, ...styles.py16, ...styles.px32 }}
          >
            <Text style={{ ...styles.fs20, ...styles.mb8 }}>{vent.title}</Text>

            <Text
              ellipsizeMode="tail"
              numberOfLines={displayCommentField ? 150 : 3}
              style={{ ...styles.colorGrey1, ...styles.fs20, ...styles.mb8 }}
            >
              {ventPreview}
            </Text>
            <View
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.justifyEnd,
              }}
            >
              <FontAwesomeIcon
                icon={faClock}
                style={{
                  ...styles.colorGrey5,
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.colorGrey5,
                  ...styles.fs16,
                }}
              >
                {dayjs(vent.server_timestamp).fromNow()}
              </Text>
            </View>
          </SmartLink>

          {!searchPreviewMode && (
            <View
              style={{
                ...styles.flexRow,
                ...styles.justifyBetween,
                ...styles.wrap,
                ...styles.pa16,
                ...(!searchPreviewMode && displayCommentField
                  ? styles.borderBottom
                  : {}),
              }}
            >
              <View
                style={{
                  ...styles.flexRow,
                  ...styles.alignCenter,
                  ...styles.mr8,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (signUpProgressFunction) return signUpProgressFunction();

                    likeOrUnlikeVent(
                      hasLiked,
                      setHasLiked,
                      setVent,
                      user,
                      vent
                    );
                  }}
                  style={{
                    ...styles.flexRow,
                    ...styles.alignCenter,
                    ...styles.mr8,
                  }}
                >
                  {hasLiked ? (
                    <Image
                      source={require("../../assets/support-active.png")}
                      style={{ width: 34, height: 34 }}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/support.png")}
                      style={{ width: 34, height: 34 }}
                    />
                  )}

                  <Text style={{ ...styles.colorGrey5, ...styles.fs24 }}>
                    {vent.like_counter ? vent.like_counter : 0}
                  </Text>
                </TouchableOpacity>

                <SmartLink
                  disablePostOnClick={disablePostOnClick}
                  onPress={
                    vent && vent.id
                      ? () => navigation.jumpTo("SingleVent", { ventID })
                      : ""
                  }
                  style={{ ...styles.flexRow, ...styles.alignCenter }}
                >
                  <FontAwesomeIcon
                    icon={faComments}
                    onClick={() => {
                      if (disablePostOnClick) textInput.current.focus();
                    }}
                    size={32}
                    style={{ ...styles.colorMain, ...styles.mr4 }}
                  />
                  <Text style={{ ...styles.colorGrey5, ...styles.fs24 }}>
                    {vent.comment_counter ? vent.comment_counter : 0}
                  </Text>
                </SmartLink>
              </View>

              {(!user || (user && user.uid !== vent.userID && author.id)) && (
                <TouchableOpacity
                  onPress={() => {
                    if (signUpProgressFunction) return signUpProgressFunction();

                    startConversation(navigate, user, vent.userID);
                  }}
                  style={{
                    ...styles.buttonPrimary,
                    ...styles.flexFill,
                    ...styles.px16,
                    ...styles.py8,
                  }}
                >
                  <Text
                    style={{
                      ...styles.colorWhite,
                      ...styles.fs20,
                      ...styles.tac,
                    }}
                  >
                    Message {capitolizeFirstChar(author.displayName)}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {!searchPreviewMode && displayCommentField && comments && (
            <View>
              {vent.comment_counter > 0 && (
                <View
                  style={{
                    ...styles.borderBottom,
                    ...styles.px32,
                    ...styles.py16,
                  }}
                >
                  <TouchableOpacity className="blue">
                    <Text>Sort By: {activeSort}</Text>
                  </TouchableOpacity>
                </View>
              )}
              {comments && comments.length > 0 && (
                <View className="column px32 pb16">
                  {comments.map((comment, index) => {
                    return (
                      <Comment
                        arrayLength={comments.length}
                        commentID={comment.id}
                        commentIndex={index}
                        comment2={comment}
                        setComments={setComments}
                        ventUserID={vent.userID}
                        key={comment.id}
                      />
                    );
                  })}
                  {canLoadMoreComments && (
                    <TouchableOpacitys
                      className="blue underline"
                      onClick={() => {
                        getVentComments(
                          activeSort,
                          comments,
                          isMounted,
                          setCanLoadMoreComments,
                          setComments,
                          true,
                          vent.id
                        );
                      }}
                      key={comments.length}
                    >
                      <Text>Load More Comments</Text>
                    </TouchableOpacitys>
                  )}
                </View>
              )}
              {vent.comment_counter === 0 &&
                (!comments || (comments && comments.length === 0)) && (
                  <Text className="tac px32 py16">
                    There are no comments yet. Please help this person :)
                  </Text>
                )}
            </View>
          )}
          {displayCommentField && !comments && (
            <View className="x-fill full-center">
              <Text>Loading</Text>
            </View>
          )}

          {false && !searchPreviewMode && displayCommentField && (
            <View
              className="sticky column x-fill bg-white border-top shadow-2 br8 pa16"
              style={{ bottom: 0 }}
            >
              {isUserAccountNewLocal && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.jumpTo("Rules");
                  }}
                >
                  <Text>Read Our VWS Rules</Text>
                </TouchableOpacity>
              )}
              <View className="flex-fill align-center gap8">
                <View className="relative column flex-fill">
                  <MentionsInput
                    className="mentions"
                    onChange={(e) => {
                      if (signUpProgressFunction)
                        return signUpProgressFunction();

                      if (!isUserKarmaSufficient(userBasicInfo))
                        return message.error(
                          "Your karma is too low to interact with this"
                        );

                      setCommentString(e.target.value);
                    }}
                    placeholder="Say something nice :)"
                    inputRef={textInput}
                    value={commentString}
                  >
                    <Mention
                      className="mentions__mention"
                      data={(currentTypingTag, callback) => {
                        findPossibleUsersToTag(
                          currentTypingTag,
                          vent.id,
                          callback
                        );
                      }}
                      markup="@[__display__](__id__)"
                      renderSuggestion={(
                        entry,
                        search,
                        highlightedDisplay,
                        index,
                        focused
                      ) => {
                        return (
                          <View className="flex-fill align-center pa8 gap8">
                            <MakeAvatar
                              displayName={entry.displayName}
                              userBasicInfo={entry}
                            />
                            <View className="button-7">
                              <Text className="ellipsis fw-400 mr8">
                                {capitolizeFirstChar(entry.displayName)}
                              </Text>
                            </View>
                            <KarmaBadge userBasicInfo={entry} noOnClick />
                          </View>
                        );
                      }}
                      trigger="@"
                    />
                  </MentionsInput>
                </View>
                <TouchableOpacity
                  onClick={async () => {
                    if (signUpProgressFunction) return signUpProgressFunction();

                    if (!commentString) return;
                    commentVent(commentString, setVent, user, vent, vent.id);

                    setCommentString("");
                  }}
                >
                  <Text>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </View>
  );
}

function SmartLink({ children, disablePostOnClick, onPress, style }) {
  if (disablePostOnClick || !onPress) {
    return <View style={style}>{children}</View>;
  } else {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        {children}
      </TouchableOpacity>
    );
  }
}

function Tag({ navigation, tag }) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.jumpTo("IndividualTag", { tag });
      }}
      style={{ ...styles.borderBottom, ...styles.mr8, ...styles.mt8 }}
    >
      <Text style={{ ...styles.colorGrey1, ...styles.fs20 }}>
        {viewTagFunction(tag)}
      </Text>
    </TouchableOpacity>
  );
}

function Something({}) {
  return (
    <View className="column bg-white shadow-2 pa8 br8">
      <Text
        className="button-4 py8"
        onClick={() => {
          setActiveSort("First");

          getVentComments(
            "First",
            [],
            isMounted,
            setCanLoadMoreComments,
            setComments,
            false,
            ventID ? ventID : vent.id
          );
        }}
      >
        First
      </Text>
      <Text
        className="button-4 py8"
        onClick={() => {
          setActiveSort("Best");

          getVentComments(
            "Best",
            [],
            isMounted,
            setCanLoadMoreComments,
            setComments,
            false,
            ventID ? ventID : vent.id
          );
        }}
      >
        Best
      </Text>
      <Text
        className="button-4 py8"
        onClick={() => {
          setActiveSort("Last");

          getVentComments(
            "Last",
            [],
            isMounted,
            setCanLoadMoreComments,
            setComments,
            false,
            ventID ? ventID : vent.id
          );
        }}
      >
        Last
      </Text>
    </View>
  );
}

export default VentComponent;
