import React, { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { faBaby } from "@fortawesome/pro-solid-svg-icons/faBaby";
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

import { styles } from "../../styles";

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
  getIsUserOnline,
  getKeyboardVerticalOffSet,
  getUserBasicInfo,
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

function ProfileScreen({ navigation, route }) {
  const { user } = useContext(UserContext);
  let { userID } = route.params;

  const [canLoadMoreComments, setCanLoadMoreComments] = useState(true);
  const [canLoadMoreVents, setCanLoadMoreVents] = useState(true);
  const [isFollowing, setIsFollowing] = useState();
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [postsSection, setPostsSection] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});

  const [vents, setVents] = useState([]);
  const [comments, setComments] = useState([]);

  if (!userID && user) userID = user.uid;

  const isActive = (page) => {
    if (page) return " active";
    else return "";
  };

  useEffect(() => {
    let isUserOnlineSubscribe;

    setVents([]);
    setComments([]);

    if (userID) {
      isUserOnlineSubscribe = getIsUserOnline((isUserOnline) => {
        setIsUserOnline(isUserOnline);
      }, userID);
      getUserBasicInfo((userBasicInfo) => {
        setUserBasicInfo(userBasicInfo);
      }, userID);
      getUser((userInfo) => {
        setUserInfo(userInfo);

        if (user) getIsFollowing(setIsFollowing, user.uid, userID);
      }, userID);
    } else navigation.jumpTo("Home");

    getUsersVents(userID, setCanLoadMoreVents, setVents, []);
    getUsersComments(userID, setCanLoadMoreComments, setComments, []);

    setTimeout(() => setRefreshing(false), 400);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [refreshing, setRefreshing, user, userID]);

  return (
    <Screen goBack navigation={navigation}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        <View style={{ ...styles.pa16 }}>
          {Boolean(userID) && (
            <View style={{ ...styles.box, ...styles.mb16, ...styles.pa16 }}>
              <View style={{ ...styles.fullCenter }}>
                <MakeAvatar
                  displayName={userBasicInfo.displayName}
                  size="large"
                  userBasicInfo={userBasicInfo}
                />
              </View>

              <View
                style={{
                  ...styles.flexRow,
                  ...styles.alignCenter,
                  ...styles.wrap,
                }}
              >
                <View style={{ ...styles.mt16, ...styles.mr16 }}>
                  <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
                    {isUserOnline && isUserOnline.state === "online" && (
                      <View style={{ ...styles.onlineDot, ...styles.mr8 }} />
                    )}
                    <Text style={{ ...styles.fs24, ...styles.mr8 }}>
                      {capitolizeFirstChar(userBasicInfo.displayName)}
                    </Text>
                    <KarmaBadge userBasicInfo={userBasicInfo} />
                  </View>
                  <Text style={{ ...styles.pTag }}>
                    {calculateKarma(userBasicInfo)} Karma Points
                  </Text>
                </View>

                {(Boolean(
                  new dayjs().year() - new dayjs(userInfo.birth_date).year()
                ) ||
                  Boolean(userInfo.gender || userInfo.pronouns)) && (
                  <View style={{ ...styles.flexRow }}>
                    {Boolean(
                      new dayjs().year() - new dayjs(userInfo.birth_date).year()
                    ) && (
                      <View style={{ ...styles.mt16 }}>
                        <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                          Age
                        </Text>
                        <Text style={{ ...styles.pTag }}>
                          {new dayjs().diff(
                            new dayjs(userInfo.birth_date),
                            "years"
                          )}
                        </Text>
                      </View>
                    )}

                    {userInfo.gender && (
                      <View style={{ ...styles.mt16, ...styles.mr16 }}>
                        <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                          Gender
                        </Text>
                        <Text style={{ ...styles.pTag }}>
                          {userInfo.gender}
                        </Text>
                      </View>
                    )}
                    {userInfo.pronouns && (
                      <View style={{ ...styles.mt16, ...styles.mr16 }}>
                        <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                          Pronouns
                        </Text>
                        <Text style={{ ...styles.pTag }}>
                          {userInfo.pronouns}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                {Boolean(userBasicInfo.server_timestamp) && (
                  <View
                    style={{
                      ...styles.mt16,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.titleSmall,
                      }}
                    >
                      Created Account
                    </Text>
                    <Text style={{ ...styles.pTag }}>
                      {new dayjs(userBasicInfo.server_timestamp).format(
                        "MMMM D YYYY"
                      )}
                    </Text>
                  </View>
                )}
              </View>

              {Boolean(userInfo.bio) && (
                <View style={{ ...styles.mt16 }}>
                  <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                    Bio
                  </Text>
                  <Text style={{ ...styles.pTag }}>{userInfo.bio}</Text>
                </View>
              )}

              {Boolean(
                userInfo.education !== undefined ||
                  userInfo.kids !== undefined ||
                  userInfo.partying !== undefined ||
                  userInfo.politics !== undefined ||
                  userInfo.religion !== undefined
              ) && (
                <View
                  style={{ ...styles.flexRow, ...styles.wrap, ...styles.mt16 }}
                >
                  {userInfo.education !== undefined && (
                    <View
                      style={{
                        ...styles.flexRow,
                        ...styles.mr8,
                        ...styles.mb8,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faSchool}
                        size={24}
                        style={{ ...styles.colorGrey1, ...styles.mr4 }}
                      />
                      <Text style={{ ...styles.pTag }}>
                        {educationList[userInfo.education]}
                      </Text>
                    </View>
                  )}
                  {Boolean(userInfo.kids !== undefined) && (
                    <View
                      style={{
                        ...styles.flexRow,
                        ...styles.mr8,
                        ...styles.mb8,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faBaby}
                        size={24}
                        style={{ ...styles.colorGrey1, ...styles.mr4 }}
                      />
                      <Text style={{ ...styles.pTag }}>
                        {kidsList[userInfo.kids]}
                      </Text>
                    </View>
                  )}
                  {Boolean(userInfo.partying !== undefined) && (
                    <View
                      style={{
                        ...styles.flexRow,
                        ...styles.mr8,
                        ...styles.mb8,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faGlassCheers}
                        size={24}
                        style={{ ...styles.colorGrey1, ...styles.mr4 }}
                      />
                      <Text style={{ ...styles.pTag }}>
                        {partyingList[userInfo.partying]}
                      </Text>
                    </View>
                  )}
                  {Boolean(userInfo.politics !== undefined) && (
                    <View
                      style={{
                        ...styles.flexRow,
                        ...styles.mr8,
                        ...styles.mb8,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faLandmark}
                        size={24}
                        style={{ ...styles.colorGrey1, ...styles.mr4 }}
                      />
                      <Text style={{ ...styles.pTag }}>
                        {politicalBeliefsList[userInfo.politics]}
                      </Text>
                    </View>
                  )}
                  {Boolean(userInfo.religion !== undefined) && (
                    <View
                      style={{
                        ...styles.flexRow,
                        ...styles.mr8,
                        ...styles.mb8,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPray}
                        size={24}
                        style={{ ...styles.colorGrey1, ...styles.mr4 }}
                      />
                      <Text style={{ ...styles.pTag }}>
                        {userInfo.religion}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              {Boolean(userBasicInfo.displayName) &&
                userID &&
                (user ? userID !== user.uid : true) && (
                  <TouchableOpacity
                    onPress={() => {
                      const userInteractionIssues = userSignUpProgress(user);

                      if (userInteractionIssues) {
                        if (userInteractionIssues === "NSI")
                          setStarterModal(true);
                        return;
                      }

                      startConversation(navigation, user, userID);
                    }}
                    style={{
                      ...styles.buttonPrimary,
                      ...styles.mt8,
                      ...styles.mb16,
                    }}
                  >
                    <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                      Message {capitolizeFirstChar(userBasicInfo.displayName)}
                    </Text>
                  </TouchableOpacity>
                )}

              <View
                style={{
                  ...styles.flexRow,
                  ...styles.alignCenter,
                  ...styles.justifyBetween,
                  ...styles.mt8,
                }}
              >
                <View>
                  {Boolean(isUserOnline) &&
                    (isUserOnline.index || isUserOnline.last_online) && (
                      <Text style={{ ...styles.pTag, ...styles.fs16 }}>
                        Last Seen:{" "}
                        {dayjs(
                          isUserOnline.last_online
                            ? isUserOnline.last_online
                            : isUserOnline.index
                        ).fromNow()}
                      </Text>
                    )}
                </View>
                {Boolean(userBasicInfo.displayName) &&
                  userID &&
                  user &&
                  userID !== user.uid && (
                    <TouchableOpacity onPress={() => setShowOptionsModal(true)}>
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        size={24}
                        style={{ ...styles.colorGrey11 }}
                      />
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          )}

          <View
            style={{
              ...styles.box,
              ...styles.flexRow,
              ...styles.mb16,
              ...styles.pa16,
            }}
          >
            <TouchableOpacity
              onPress={() => setPostsSection(true)}
              style={{
                ...styles.flexFill,
                ...(isActive(postsSection)
                  ? styles.borderBottomMain
                  : styles.borderBottom),
              }}
            >
              <Text
                style={{
                  ...styles.pTag,
                  ...styles.tac,
                  ...(isActive(postsSection) ? styles.colorMain : {}),
                }}
              >
                Posts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPostsSection(false);
              }}
              style={{
                ...styles.flexFill,
                ...styles.pb8,
                ...(isActive(!postsSection)
                  ? styles.borderBottomMain
                  : styles.borderBottom),
              }}
            >
              <Text
                style={{
                  ...styles.pTag,
                  ...styles.tac,
                  ...(isActive(!postsSection) ? styles.colorMain : {}),
                }}
              >
                Comments
              </Text>
            </TouchableOpacity>
          </View>
          {Boolean(postsSection) && (
            <View>
              <View>
                {vents &&
                  vents.map((vent, index) => (
                    <Vent
                      key={index}
                      navigation={navigation}
                      previewMode={true}
                      ventID={vent.id}
                      ventInit={vent}
                    />
                  ))}
                {vents && vents.length === 0 && (
                  <Text style={{ ...styles.pTag }}>No vents found.</Text>
                )}
              </View>
              {canLoadMoreVents && (
                <TouchableOpacity
                  onPress={() =>
                    getUsersVents(userID, setCanLoadMoreVents, setVents, vents)
                  }
                  style={{ ...styles.buttonPrimary, ...styles.mt16 }}
                >
                  <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                    Load More Vents
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {Boolean(!postsSection) && (
            <View>
              {comments && comments.length > 0 && (
                <View style={{ ...styles.box }}>
                  {comments &&
                    comments.map((comment, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            navigation.jumpTo("SingleVent", {
                              ventID: comment.ventID,
                            });
                          }}
                        >
                          <Comment
                            commentID={comment.id}
                            comment2={comment}
                            key={index}
                            navigation={navigation}
                          />
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}
              {Boolean(comments && comments.length === 0) && (
                <Text style={{ ...styles.pTag }}>No comments found.</Text>
              )}
              {Boolean(canLoadMoreComments) && (
                <TouchableOpacity
                  onPress={() =>
                    getUsersComments(
                      userID,
                      setCanLoadMoreComments,
                      setComments,
                      comments
                    )
                  }
                  style={{ ...styles.buttonPrimary, ...styles.mt16 }}
                >
                  <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                    Load More Comments
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {Boolean(
            (!vents && postsSection) || (!comments && !postsSection)
          ) && (
            <View style={{ ...styles.fullCenter }}>
              <Text style={{ ...styles.titleSmall, ...styles.tac }}>
                Loading
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal transparent={true} visible={Boolean(showOptionsModal)}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={getKeyboardVerticalOffSet()}
          style={{ ...styles.flexFill }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setShowOptionsModal(false);
            }}
            style={{
              ...styles.fill,
              ...styles.justifyEnd,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
          >
            <TouchableWithoutFeedback>
              <SafeAreaView
                style={{
                  ...styles.bgWhite,
                  overflow: "hidden",
                  ...styles.br8,
                }}
              >
                <View style={{ ...styles.bgBlue1, ...styles.pa16 }}>
                  <Text style={{ ...styles.title }}>Trending Options</Text>
                </View>
                <View style={{ ...styles.pa16 }}>
                  <TouchableOpacity
                    onPress={() => {
                      const userInteractionIssues = userSignUpProgress(user);

                      if (userInteractionIssues) {
                        if (userInteractionIssues === "NSI")
                          setStarterModal(true);
                        return;
                      }

                      followOrUnfollowUser(
                        !isFollowing,
                        setIsFollowing,
                        user.uid,
                        userBasicInfo.id
                      );
                    }}
                    style={{ ...styles.buttonPrimary, ...styles.mb8 }}
                  >
                    <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                      {isFollowing ? "Unfollow" : "Follow"}{" "}
                      {capitolizeFirstChar(userBasicInfo.displayName)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      blockUser(user.uid, userID);
                    }}
                    style={{ ...styles.buttonPrimary }}
                  >
                    <Text
                      style={{
                        ...styles.fs20,
                        ...styles.colorWhite,
                        ...styles.mr8,
                      }}
                    >
                      Block {capitolizeFirstChar(userBasicInfo.displayName)}
                    </Text>
                    <FontAwesomeIcon
                      icon={faUserLock}
                      size={24}
                      style={{ ...styles.colorWhite }}
                    />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={Boolean(starterModal)}
      />
    </Screen>
  );
}

export default ProfileScreen;
