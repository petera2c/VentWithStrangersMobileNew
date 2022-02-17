import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

function ProfileScreen({ navigation, route }) {
  const { user } = useContext(UserContext);
  let { userID } = route.params;

  const [canLoadMoreComments, setCanLoadMoreComments] = useState(true);
  const [canLoadMoreVents, setCanLoadMoreVents] = useState(true);
  const [isFollowing, setIsFollowing] = useState();
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [postsSection, setPostsSection] = useState(true);
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

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [user, userID]);

  return (
    <Screen goBack navigation={navigation}>
      <ScrollView>
        <View style={{ ...styles.pa16 }}>
          {userID && (
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
                  userInfo.gender ||
                  userInfo.pronouns) && (
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
                {userBasicInfo.server_timestamp && (
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

              {userInfo.bio && (
                <View style={{ ...styles.mt16 }}>
                  <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                    Bio
                  </Text>
                  <Text style={{ ...styles.pTag }}>{userInfo.bio}</Text>
                </View>
              )}

              {(userInfo.education !== undefined ||
                userInfo.kids !== undefined ||
                userInfo.partying !== undefined ||
                userInfo.politics !== undefined ||
                userInfo.religion !== undefined) && (
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
                  {userInfo.kids !== undefined && (
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
                  {userInfo.partying !== undefined && (
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
                  {userInfo.politics !== undefined && (
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
                  {userInfo.religion !== undefined && (
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
              {userBasicInfo.displayName &&
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
                    style={{ ...styles.buttonPrimary, ...styles.mt8 }}
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
                  {isUserOnline && isUserOnline.last_online && (
                    <Text style={{ ...styles.pTag, ...styles.fs16 }}>
                      Last Seen: {dayjs(isUserOnline.last_online).fromNow()}
                    </Text>
                  )}
                </View>
                {false &&
                  userBasicInfo.displayName &&
                  userID &&
                  user &&
                  userID !== user.uid && (
                    <Dropdown
                      overlay={
                        <View className="column x-fill bg-white border-all px16 py8 br8">
                          <View
                            className="button-8 clickable align-center"
                            onClick={() => {
                              const userInteractionIssues = userSignUpProgress(
                                user
                              );

                              if (userInteractionIssues) {
                                if (userInteractionIssues === "NSI")
                                  setStarterModal(true);
                                return;
                              }

                              followOrUnfollowUser(
                                isMounted,
                                !isFollowing,
                                setIsFollowing,
                                user.uid,
                                userBasicInfo.id
                              );
                            }}
                          >
                            <Text className="ic ellipsis">
                              {isFollowing ? "Unfollow" : "Follow"}{" "}
                              {capitolizeFirstChar(userBasicInfo.displayName)}
                            </Text>
                          </View>
                          <View
                            className="button-8 clickable align-center"
                            onClick={(e) => {
                              e.preventDefault();
                              //setBlockModal(!blockModal);
                            }}
                          >
                            <Text className=" flex-fill">Block Person</Text>
                            <FontAwesomeIcon
                              className="ml8"
                              icon={faUserLock}
                            />
                          </View>
                        </View>
                      }
                      placement="bottomRight"
                      trigger={["click"]}
                    >
                      <FontAwesomeIcon
                        className="clickable grey-9"
                        icon={faEllipsisV}
                        style={{ width: "50px" }}
                      />
                    </Dropdown>
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
          {postsSection && (
            <View
              dataLength={vents.length}
              endMessage={
                vents.length !== 0 ? (
                  <Text className="primary tac mt16">
                    Yay! You have seen it all
                  </Text>
                ) : (
                  <View />
                )
              }
              hasMore={canLoadMoreVents}
              loader={
                <View className="x-fill full-center">
                  <Text>Loading</Text>
                </View>
              }
              next={() =>
                getUsersVents(
                  isMounted,
                  userID,
                  setCanLoadMoreVents,
                  setVents,
                  vents
                )
              }
              scrollableTarget="scrollable-div"
            >
              <View className="x-fill" direction="vertical" size="middle">
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
                {vents && vents.length === 0 && <Text>No vents found.</Text>}
              </View>
            </View>
          )}
          {!postsSection && (
            <View className="x-fill column">
              {comments && comments.length > 0 && (
                <View className="column bg-white br8 px32 py16">
                  {comments &&
                    comments.map((comment, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          to={"/vent/" + comment.ventID + "/"}
                        >
                          <Comment
                            arrayLength={comments.length}
                            commentID={comment.id}
                            commentIndex={index}
                            comment2={comment}
                            key={index}
                          />
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}
              {comments && comments.length === 0 && (
                <Text>No comments found.</Text>
              )}
              {canLoadMoreComments && (
                <TouchableOpacity
                  block
                  className="mt16"
                  onClick={() =>
                    getUsersComments(
                      isMounted,
                      userID,
                      setCanLoadMoreComments,
                      setComments,
                      comments
                    )
                  }
                  size="large"
                  type="primary"
                >
                  <Text>Load More Comments</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {((!vents && postsSection) || (!comments && !postsSection)) && (
            <View className="x-fill full-center">
              <Text>Loading</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={starterModal}
      />
    </Screen>
  );
}

export default ProfileScreen;
