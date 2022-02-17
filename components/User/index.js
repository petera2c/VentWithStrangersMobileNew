import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { faBaby } from "@fortawesome/pro-solid-svg-icons/faBaby";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faGlassCheers } from "@fortawesome/pro-solid-svg-icons/faGlassCheers";
import { faLandmark } from "@fortawesome/pro-solid-svg-icons/faLandmark";
import { faPray } from "@fortawesome/pro-solid-svg-icons/faPray";
import { faSchool } from "@fortawesome/pro-solid-svg-icons/faSchool";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import DisplayName from "../views/DisplayName";
import MakeAvatar from "../views/MakeAvatar";
import StarterModal from "../modals/Starter";

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
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  userSignUpProgress,
} from "../../util";

dayjs.extend(relativeTime);

function UserComponent({
  additionalUserInfo,
  displayName,
  isUserOnline,
  lastOnline,
  navigation,
  showAdditionaluserInformation,
  showMessageUser,
  userID,
}) {
  const { user } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState({ displayName });
  const [starterModal, setStarterModal] = useState(false);

  const [karmaPoints, setKarmaPoints] = useState(0);

  useEffect(() => {
    getUserBasicInfo((newUserInfo) => {
      setUserInfo(newUserInfo);
      setKarmaPoints(calculateKarma(newUserInfo));
    }, userID);

    return () => {};
  }, [userID]);

  return (
    <View style={{ ...styles.box, ...styles.mb16, ...styles.pa32 }}>
      <TouchableOpacity
        className="column x-fill flex-fill gap8"
        onPress={() => navigation.jumpTo("Profile", { userID })}
      >
        <View
          style={{ ...styles.flexRow, ...styles.alignCenter, ...styles.mb16 }}
        >
          <View style={{ ...styles.mr8 }}>
            <MakeAvatar
              displayName={userInfo.displayName}
              userBasicInfo={userInfo}
            />
          </View>

          <View>
            <View style={{ ...styles.mb8 }}>
              <DisplayName
                big
                displayName={userInfo.displayName}
                isLink={false}
                isUserOnline={isUserOnline}
                navigation={navigation}
                noAvatar
                userBasicInfo={userInfo}
              />
            </View>
            <Text style={{ ...styles.pTag, ...styles.fs18 }}>
              {karmaPoints} Karma Points
            </Text>
          </View>
        </View>

        {(userInfo.birth_date || userInfo.gender || userInfo.pronouns) && (
          <View style={{ ...styles.mb16 }}>
            {Boolean(
              new dayjs().year() - new dayjs(userInfo.birth_date).year()
            ) && (
              <View className="column">
                <Text className="fw-400">Age</Text>
                <Text className="grey-1 fw-400">
                  {new dayjs().year() - new dayjs(userInfo.birth_date).year()}
                </Text>
              </View>
            )}

            {userInfo.gender && (
              <View className="column">
                <Text className="fw-400">Gender</Text>
                <Text className="grey-1 fw-400">{userInfo.gender}</Text>
              </View>
            )}
            {userInfo.pronouns && (
              <View className="column">
                <Text className="fw-400">Pronouns</Text>
                <Text className="grey-1 fw-400">{userInfo.pronouns}</Text>
              </View>
            )}
          </View>
        )}

        {showAdditionaluserInformation && (
          <View style={{ ...styles.flexRow, ...styles.wrap, ...styles.mb16 }}>
            {additionalUserInfo.education !== undefined && (
              <View className="border-all align-center px8 py4 br4">
                <Text>
                  <FontAwesomeIcon className="mr8" icon={faSchool} />
                  {educationList[additionalUserInfo.education]}
                </Text>
              </View>
            )}
            {additionalUserInfo.kids !== undefined && (
              <View className="border-all align-center px8 py4 br4">
                <Text>
                  <FontAwesomeIcon className="mr8" icon={faBaby} />
                  {kidsList[additionalUserInfo.kids]}
                </Text>
              </View>
            )}
            {additionalUserInfo.partying !== undefined && (
              <View className="border-all align-center px8 py4 br4">
                <Text>
                  <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                  {partyingList[additionalUserInfo.partying]}
                </Text>
              </View>
            )}
            {additionalUserInfo.politics !== undefined && (
              <View className="border-all align-center px8 py4 br4">
                <Text>
                  <FontAwesomeIcon className="mr8" icon={faLandmark} />
                  {politicalBeliefsList[additionalUserInfo.politics]}
                </Text>
              </View>
            )}
            {additionalUserInfo.religion !== undefined && (
              <View className="border-all align-center px8 py4 br4">
                <Text>
                  <FontAwesomeIcon className="mr8" icon={faPray} />
                  {additionalUserInfo.religion}
                </Text>
              </View>
            )}
          </View>
        )}

        {showMessageUser && (
          <View>
            {lastOnline && (
              <Text style={{ ...styles.fs16, ...styles.mb8 }}>
                Last Seen: {dayjs(lastOnline).fromNow()}
              </Text>
            )}
            {(!user || (user && user.uid !== userID)) && (
              <TouchableOpacity
                onClick={(e) => {
                  e.preventDefault();

                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI") setStarterModal(true);
                    return;
                  }

                  startConversation(navigation, user, userID);
                }}
                style={{ ...styles.buttonPrimary }}
              >
                <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                  Message {capitolizeFirstChar(userInfo.displayName)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </View>
  );
}

export default UserComponent;
