import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { faCut } from "@fortawesome/pro-regular-svg-icons/faCut";
import { faEye } from "@fortawesome/pro-regular-svg-icons/faEye";
import { faHatWinter } from "@fortawesome/pro-regular-svg-icons/faHatWinter";
import { faLips } from "@fortawesome/pro-regular-svg-icons/faLips";
import { faPalette } from "@fortawesome/pro-regular-svg-icons/faPalette";
import { faPencil } from "@fortawesome/pro-regular-svg-icons/faPencil";
import { faSunglasses } from "@fortawesome/pro-regular-svg-icons/faSunglasses";
import { faUserTie } from "@fortawesome/pro-regular-svg-icons/faUserTie";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Avatar from "../../../components/views/react-native-avataaars";
import Screen from "../../../components/containers/Screen";

import { UserContext } from "../../../context";

import { styles } from "../../../styles";

import { getUserBasicInfo } from "../../../util";
import {
  accessoriesArray,
  clothesArray,
  eyebrowArray,
  eyesArray,
  facialHairArray,
  getActiveSection,
  hairColorArray,
  mouthArray,
  saveAvatar,
  skinArray,
  topArray,
} from "./util";

function AvatarScreen({ navigation }) {
  const { setUserBasicInfo, user } = useContext(UserContext);

  const [activeSection, setActiveSection] = useState(0);
  const [avatar, setAvatar] = useState({});
  const [refresh, setRefresh] = useState();

  const sectionsArray = [
    topArray,
    accessoriesArray,
    hairColorArray,
    facialHairArray,
    clothesArray,
    eyesArray,
    eyebrowArray,
    mouthArray,
    skinArray,
  ];

  useEffect(() => {
    getUserBasicInfo((userInfo) => {
      if (userInfo && userInfo.avatar) setAvatar(userInfo.avatar);
    }, user.uid);
  }, [refresh, setAvatar, user]);

  return (
    <Screen navigation={navigation}>
      <View style={{ ...styles.flexFill, maxHeight: "100%", ...styles.pa16 }}>
        <View style={{ ...styles.flexFill, ...styles.flexRow }}>
          <View
            style={{
              ...styles.box,
              maxHeight: "100%",
              ...styles.mr16,
              ...styles.pa16,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveSection(0)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.mb16,
              }}
            >
              <FontAwesomeIcon
                icon={faHatWinter}
                size={24}
                style={{
                  ...(activeSection === 0
                    ? styles.colorMain
                    : styles.colorGrey11),
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.fs20,
                  ...(activeSection === 0
                    ? styles.colorMain
                    : styles.colorGrey11),
                }}
              >
                Hair
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSection(1)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.mb16,
              }}
            >
              <FontAwesomeIcon
                icon={faSunglasses}
                size={24}
                style={{
                  ...(activeSection === 1
                    ? styles.colorMain
                    : styles.colorGrey11),
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.fs20,
                  ...(activeSection === 1
                    ? styles.colorMain
                    : styles.colorGrey11),
                }}
              >
                Accessories
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSection(2)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.mb16,
              }}
            >
              <FontAwesomeIcon
                icon={faPalette}
                size={24}
                style={{
                  ...(activeSection === 2
                    ? styles.colorMain
                    : styles.colorGrey11),
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.fs20,
                  ...(activeSection === 2
                    ? styles.colorMain
                    : styles.colorGrey11),
                }}
              >
                Hair Color
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSection(3)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.mb16,
              }}
            >
              <FontAwesomeIcon
                icon={faCut}
                size={24}
                style={{
                  ...(activeSection === 3
                    ? styles.colorMain
                    : styles.colorGrey11),
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.fs20,
                  ...(activeSection === 3
                    ? styles.colorMain
                    : styles.colorGrey11),
                }}
              >
                Facial Hair
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSection(4)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.mb16,
              }}
            >
              <FontAwesomeIcon
                icon={faUserTie}
                size={24}
                style={{
                  ...(activeSection === 4
                    ? styles.colorMain
                    : styles.colorGrey11),
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.fs20,
                  ...(activeSection === 4
                    ? styles.colorMain
                    : styles.colorGrey11),
                }}
              >
                Clothes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSection(5)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.mb16,
              }}
            >
              <FontAwesomeIcon
                icon={faEye}
                size={24}
                style={{
                  ...(activeSection === 5
                    ? styles.colorMain
                    : styles.colorGrey11),
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.fs20,
                  ...(activeSection === 5
                    ? styles.colorMain
                    : styles.colorGrey11),
                }}
              >
                Eyes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSection(6)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.mb16,
              }}
            >
              <FontAwesomeIcon
                icon={faPencil}
                size={24}
                style={{
                  ...(activeSection === 6
                    ? styles.colorMain
                    : styles.colorGrey11),
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.fs20,
                  ...(activeSection === 6
                    ? styles.colorMain
                    : styles.colorGrey11),
                }}
              >
                Eyebrows
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSection(7)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.mb16,
              }}
            >
              <FontAwesomeIcon
                icon={faLips}
                size={24}
                style={{
                  ...(activeSection === 7
                    ? styles.colorMain
                    : styles.colorGrey11),
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.fs20,
                  ...(activeSection === 7
                    ? styles.colorMain
                    : styles.colorGrey11),
                }}
              >
                Mouth
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSection(8)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.mb16,
              }}
            >
              <FontAwesomeIcon
                icon={faPalette}
                size={24}
                style={{
                  ...(activeSection === 8
                    ? styles.colorMain
                    : styles.colorGrey11),
                  ...styles.mr8,
                }}
              />
              <Text
                style={{
                  ...styles.fs20,
                  ...(activeSection === 8
                    ? styles.colorMain
                    : styles.colorGrey11),
                }}
              >
                Skin
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ ...styles.flexFill, ...styles.box, maxHeight: "100%" }}
          >
            <ScrollView>
              <View style={{ ...styles.pa16 }}>
                {sectionsArray[activeSection].map((obj, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      avatar[getActiveSection(activeSection)] = obj.value;
                      setAvatar({ ...avatar });
                    }}
                    style={{
                      ...styles.py8,
                      ...(index !== sectionsArray[activeSection].length - 1
                        ? styles.borderBottom
                        : {}),
                    }}
                  >
                    <Text
                      style={{
                        ...styles.fs20,
                        ...(obj.value ===
                        avatar[getActiveSection(activeSection)]
                          ? styles.colorMain
                          : styles.colorGrey1),
                      }}
                    >
                      {obj.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            ...styles.flexRow,
            ...styles.alignEnd,
            ...styles.justifyBetween,
            ...styles.mt16,
          }}
        >
          <View
            style={{
              height: 125,
              width: 125,
              ...styles.fullCenter,
            }}
          >
            <Avatar
              avatarStyle={"Circle"}
              topType={avatar.topType}
              accessoriesType={avatar.accessoriesType}
              hairColor={avatar.hairColor}
              facialHairType={avatar.facialHairType}
              clotheType={avatar.clotheType}
              eyeType={avatar.eyeType}
              eyebrowType={avatar.eyebrowType}
              mouthType={avatar.mouthType}
              skinColor={avatar.skinColor}
            />
          </View>
          <TouchableOpacity
            onPress={() => setRefresh(!refresh)}
            style={{ ...styles.buttonPrimary, ...styles.mr8 }}
          >
            <Text style={{ ...styles.fs20, ...styles.colorWhite }}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => saveAvatar(avatar, setUserBasicInfo, user.uid)}
            style={{ ...styles.buttonPrimary }}
          >
            <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
              Save Avatar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

export default AvatarScreen;
