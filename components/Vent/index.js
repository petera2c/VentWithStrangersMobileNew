import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showMessage } from "react-native-flash-message";
import { MentionInput } from "react-native-controlled-mentions";

import { faBirthdayCake } from "@fortawesome/pro-regular-svg-icons/faBirthdayCake";
import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Comment from "../Comment";
//import ConfirmAlertModal from "../modals/ConfirmAlert";
import ContentOptions from "../ContentOptions";
import KarmaBadge from "../views/KarmaBadge";
import MakeAvatar from "../views/MakeAvatar";
import StarterModal from "../modals/Starter";
import TrendingOptions from "../../components/modals/TrendingOptions";

import { colors, styles } from "../../styles";

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

  const { user, userBasicInfo } = useContext(UserContext);

  const [activeSort, setActiveSort] = useState("First");
  const [author, setAuthor] = useState({});
  const [canLoadMoreComments, setCanLoadMoreComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentString, setCommentString] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [trendingOptions, setTrendingOptions] = useState(false);
  const [vent, setVent] = useState(ventInit);

  const [isUserAccountNewLocal, setIsUserAccountNewLocal] = useState();
  const [signUpProgressFunction, setSignUpProgressFunction] = useState();

  useEffect(() => {
    let isUserOnlineSubscribe;
    let newCommentListenerUnsubscribe;

    const ventSetUp = (newVent) => {
      isUserOnlineSubscribe = getIsUserOnline((isUserOnline) => {
        setIsUserOnline(isUserOnline.state);
      }, newVent.userID);

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

    setTimeout(() => setRefreshing(false), 400);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
      if (newCommentListenerUnsubscribe) newCommentListenerUnsubscribe();
    };
  }, [
    displayCommentField,
    refreshing,
    previewMode,
    searchPreviewMode,
    setRefreshing,
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

  const mainVentBody = (
    <View style={{ ...styles.box, ...styles.mb16, ...styles.pt16 }}>
      <View style={{ ...styles.borderBottom, ...styles.pa16 }}>
        <View
          style={{
            ...styles.flexRow,
            ...styles.alignCenter,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.jumpTo("Profile", { userID: author.id });
            }}
            style={{
              ...styles.flexFill,
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
              <View style={{ ...styles.mr8 }}>
                <Text style={{ ...styles.colorGrey11, ...styles.fs20 }}>
                  {capitolizeFirstChar(author.displayName)}
                </Text>
              </View>
              {isUserOnline === "online" && (
                <View style={{ ...styles.onlineDot, ...styles.mr8 }} />
              )}
              <KarmaBadge userBasicInfo={author} />
            </View>
          </TouchableOpacity>
          {vent.is_birthday_post && (
            <View
              style={{
                ...styles.flexFill,
                ...styles.flexRow,
                ...styles.alignCenter,
              }}
            >
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
            <ContentOptions
              canUserInteractFunction={
                signUpProgressFunction ? signUpProgressFunction : false
              }
              deleteFunction={(ventID) => {
                deleteVent(navigate, ventID);
              }}
              editFunction={() => {
                navigation.jumpTo("NewVent", { ventID: vent.id });
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
            {vent.new_tags.map((tagID, index) => (
              <Tag key={index} navigation={navigation} tagID={tagID} />
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
        style={{ ...styles.borderBottom, ...styles.pa16 }}
      >
        <Text style={{ ...styles.fs20, ...styles.mb8 }}>{vent.title}</Text>

        <Text
          ellipsizeMode="tail"
          numberOfLines={displayCommentField ? 150 : 3}
          style={{ ...styles.colorGrey1, ...styles.fs20, ...styles.mb8 }}
        >
          {vent.description}
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

                likeOrUnlikeVent(hasLiked, setHasLiked, setVent, user, vent);
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
          <View
            style={{
              ...styles.borderBottom,
              ...styles.px32,
              ...styles.py16,
            }}
          >
            <TouchableOpacity onPress={() => setTrendingOptions(true)}>
              <Text style={{ ...styles.fs20, ...styles.colorMain }}>
                Sort By: {activeSort}
              </Text>
            </TouchableOpacity>
          </View>
          {vent.comment_counter > 0 && (
            <TrendingOptions
              close={() => setTrendingOptions(false)}
              options={[
                {
                  isActive: activeSort === "First",
                  onClick: () => {
                    setActiveSort("First");

                    getVentComments(
                      "First",
                      [],
                      setCanLoadMoreComments,
                      setComments,
                      false,
                      ventID ? ventID : vent.id
                    );
                  },
                  title: "First",
                },
                {
                  isActive: activeSort === "Best",
                  onClick: () => {
                    setActiveSort("Best");

                    getVentComments(
                      "Best",
                      [],
                      setCanLoadMoreComments,
                      setComments,
                      false,
                      ventID ? ventID : vent.id
                    );
                  },
                  title: "Best",
                },
                {
                  isActive: activeSort === "Last",
                  onClick: () => {
                    setActiveSort("Last");

                    getVentComments(
                      "Last",
                      [],
                      setCanLoadMoreComments,
                      setComments,
                      false,
                      ventID ? ventID : vent.id
                    );
                  },
                  title: "Last",
                },
              ]}
              visible={trendingOptions}
            />
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
                <TouchableOpacity
                  className="blue underline"
                  onClick={() => {
                    getVentComments(
                      activeSort,
                      comments,
                      setCanLoadMoreComments,
                      setComments,
                      true,
                      vent.id
                    );
                  }}
                  key={comments.length}
                >
                  <Text>Load More Comments</Text>
                </TouchableOpacity>
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
    </View>
  );

  return (
    <View style={{ ...styles.flexFill }}>
      {isOnSingleVentPage ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
            />
          }
          style={{ ...styles.flexFill }}
        >
          <View style={{ ...styles.pa16 }}>{mainVentBody}</View>
        </ScrollView>
      ) : (
        mainVentBody
      )}

      {!searchPreviewMode && displayCommentField && (
        <View
          style={{
            ...styles.bgWhite,
            ...styles.pa16,
          }}
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
          <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
            <View style={{ ...styles.flexFill }}>
              <MentionInput
                containerStyle={{
                  flex: 1,
                }}
                onChange={(commentString) => {
                  if (signUpProgressFunction) return signUpProgressFunction();

                  if (!isUserKarmaSufficient(userBasicInfo))
                    return showMessage({
                      message: "Your karma is too low to interact with this",
                      type: "error",
                    });

                  setCommentString(commentString);
                }}
                partTypes={[
                  {
                    trigger: "@",
                    renderSuggestions: ({ keyword, onSuggestionPress }) =>
                      renderSuggestions({ keyword, onSuggestionPress, ventID }),
                    textStyle: { fontWeight: "bold", color: colors.main },
                  },
                ]}
                style={{
                  ...styles.input,
                  marginBottom: -2,
                }}
                value={commentString}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (signUpProgressFunction) return signUpProgressFunction();

                if (!commentString) return;
                commentVent(commentString, setVent, user, vent, vent.id);

                setCommentString("");
              }}
              style={{ ...styles.buttonPrimary, ...styles.ml8 }}
            >
              <Text style={{ ...styles.fs20, ...styles.colorWhite }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={starterModal}
      />
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

function Tag({ navigation, tagID }) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.jumpTo("IndividualTag", { tagID });
      }}
      style={{ ...styles.borderBottom, ...styles.mr8, ...styles.mt8 }}
    >
      <Text style={{ ...styles.colorGrey1, ...styles.fs20 }}>
        {viewTagFunction(tagID)}
      </Text>
    </TouchableOpacity>
  );
}

const renderSuggestions = ({ keyword, onSuggestionPress, ventID }) => {
  const [possibleUsersToTag, setPossibleUsersToTag] = useState([]);

  useEffect(() => {
    if (keyword) findPossibleUsersToTag(keyword, ventID, setPossibleUsersToTag);
    else setPossibleUsersToTag([]);
  }, [keyword]);

  if (!possibleUsersToTag || possibleUsersToTag.length === 0)
    return <View></View>;

  return (
    <View
      style={{
        position: "absolute",
        bottom: "140%",
        maxHeight: 300,
        ...styles.xFill,
        ...styles.bgWhite,
        ...styles.shadowAll,
        ...styles.br4,
      }}
    >
      <ScrollView
        style={{
          ...styles.pa8,
        }}
      >
        {possibleUsersToTag.map((possibleUserToTag, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setPossibleUsersToTag([]);
                onSuggestionPress({
                  id: possibleUserToTag.id,
                  name: possibleUserToTag.displayName,
                });
              }}
              style={{ ...styles.flexRow, ...styles.alignCenter }}
            >
              <MakeAvatar
                displayName={possibleUserToTag.displayName}
                userBasicInfo={possibleUserToTag}
              />
              <Text style={{ ...styles.fs20, ...styles.mx8 }}>
                {capitolizeFirstChar(possibleUserToTag.displayName)}
              </Text>
              <KarmaBadge userBasicInfo={possibleUserToTag} noOnClick />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default VentComponent;
